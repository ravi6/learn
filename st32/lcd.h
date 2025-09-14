#include "stm32f303x8.h"
#include <stdint.h>
#include <stdbool.h>
#include <stdlib.h>
//
// LCD Driving with 4Mux and 1/3 bias
//    Four Common Lines .. 
// Assumes default system clock = 8 MHz from HSI
#define TIM2PSC 0  //
#define TIM2ARR 512  //  8000/(1 * 512) =  (15.6kHz -> freq) 
#define TIM3PSC 799
#define TIM3ARR 199 // 8000/(200*800)  kHz = (50 Hz -> freq)
#define NPHASES   4
#define PWM_MODE1 6  // is active high for count < ARR
#define PWM_MODE2 7  // is active low  for count < ARR
//
// Unfortunately there is another TIM2_CCER register bits can
// alter the polarity (a real messs)
// Looks as though default active high is 0 and ac

#define MIN(a, b) (((a) < (b)) ? ( a) : (b))
#define ISSET(reg, n) ( ((reg) &  (1<<(n))) != 0 )
#define SETSTATE(gpio, pin, s) ( (gpio)->BSRR = (1 << (pin + (s ? 0 : 16))) )

// Digit Display related stuff
#define NUM_DIGITS 4
#define NSEGPINS 8
#define NCOMS 4

// Logical segment indices
enum {SEG_A, SEG_B, SEG_C, SEG_D,
      SEG_E, SEG_F, SEG_G, SEG_P}  ;

enum {LED=11, MUXA=4, MUXB=5, MUXC=0, MUXINH=7} ;
// Example LCD Digit Mapper for SEG+COM paired segment layout
// Assumptions:
// - 4 digits
// - Each digit is driven by 2 SEG lines
// - SEG lines: P9-P16 (i.e., SEG[0] to SEG[7])
// - COM lines: COM0 to COM3
// - Segment pairs per digit: [F,G,E,D] and [A,B,C,DP]
// - segState is updated per phase (COM)


// Phase-to-segment mapping for each SEG line
// Format: seg_map[seg_line][phase] = logical segment ID (SEG_A ... SEG_G, SEG_P, or 0xFF if unused)
const uint8_t seg_map[NSEGPINS][NCOMS] = {
    // COM0  COM1  COM2  COM3
    {SEG_D, SEG_G, SEG_D, SEG_G}, // SEG[0] - F/G/E/D (reuse pattern)
    {SEG_P, SEG_B, SEG_P, SEG_B}, // SEG[1] - A/B/C/DP (reuse pattern)
    {SEG_D, SEG_G, SEG_D, SEG_G}, // SEG[2]
    {SEG_P, SEG_B, SEG_P, SEG_B}, // SEG[3]
    {SEG_D, SEG_G, SEG_D, SEG_G}, // SEG[4]
    {SEG_P, SEG_B, SEG_P, SEG_B}, // SEG[5]
    {SEG_D, SEG_G, SEG_D, SEG_G}, // SEG[6]
    {SEG_B, SEG_P, SEG_B, SEG_P}, // SEG[7]
};

// Digit encoding using logical segments (A-G, DP)
const uint8_t digEncode[10] = {0x3F, 0x06, 0x5B, 0x4F, 0x66, 
                               0x6D, 0x7D, 0x07, 0x7F, 0x6F} ;
// Output buffer for current SEG phase state
uint8_t segStates[NSEGPINS] = {0}; // Will be applied in the interrupt

volatile uint8_t phase = 0;
volatile uint8_t invert = 0;  // Com Table Inversion flag
volatile uint8_t comPinMap[4] = {0, 1, 2, 3} ;
volatile uint8_t segState = 0b1010;

const float pwmDuty[4] = {0, 0.33333, 0.66666, 1.0} ;
//const float pwmDuty[4] = {0, 0.5, 0.5, 1.0} ;
//const float f = 1.33 ;
//const float pwmDuty[4] = {0.25*f, 0.5*f, 0.75*f, 0.5*f} ;
//const float pwmDuty[4] = {0, 1, 0.06251, 1} ; // extreme swing but less DC bias and optimal RMS

const float  comsTable[NPHASES][4] = { //Cyclical shifted left
    { pwmDuty[0], pwmDuty[2], pwmDuty[1], pwmDuty[3] }, //phase 0
    { pwmDuty[2], pwmDuty[1], pwmDuty[3], pwmDuty[0] }, //phase 1
    { pwmDuty[1], pwmDuty[3], pwmDuty[0], pwmDuty[2] }, //phase 2
    { pwmDuty[3], pwmDuty[0], pwmDuty[2], pwmDuty[1] }, //phase 3
};

void delay (unsigned int time) ;
void blink (int n) ;
void init_TIM2_PWM(void) ;
void init_TIM16_PWM(void);
void init_TIM3_IRQ(void) ;
void TIM3_IRQHandler(void) ;
void clrSegStates(void) ;
void updateDigit(uint8_t digPos, uint8_t digVal) ;
void segDriver (void) ;
void resetTimers(void) ;
void setupMux(void) ;
void selSeg (uint8_t k) ;
void outPin (GPIO_TypeDef *gpio, uint8_t pin);

void selSeg (uint8_t k) {
// Segment numbers 0 to 7 only
 SETSTATE(GPIOB, MUXA, ISSET (k, 0)) ;
 SETSTATE(GPIOB, MUXB, ISSET (k, 1)) ;
 SETSTATE(GPIOB, MUXC, ISSET (k, 2)) ;
}

void setupMux () {
  //  Setup Mux IO pins 
  RCC->AHBENR  |= RCC_AHBENR_GPIOBEN;
  (void)RCC->AHBENR ;  // wait for above to completeyy
  outPin (GPIOB, MUXA) ;
  outPin (GPIOB, MUXB) ;
  outPin (GPIOB, MUXC) ;
  outPin (GPIOB, MUXINH) ;
} // end setupMuxLED

void outPin (GPIO_TypeDef *gpio, uint8_t pin) {
// Configure a gpio pin for slow output
  gpio->MODER &= ~(3 << (2 * pin)); // clear
  gpio->MODER |= (1 << (2 * pin));  // output mode
  gpio->OSPEEDR |= (0 << ( 2 * pin));   // low speed
  gpio->OTYPER &= ~(1 << pin);      // Push-pull
  gpio->AFR[0] &= ~(0xF << (4 * pin)) ; // CLR AFRL bits  (insurence)
  gpio->PUPDR  &= ~(3 << (2 * pin));    // No pull-up/down
}

void resetTimers (void) {
  // Turn off timers
  TIM15->CR1 &= ~TIM_CR1_CEN;
  TIM2->CR1  &= ~TIM_CR1_CEN;

  // Reset counters
  TIM15->CNT = 0;
  TIM2->CNT  = 0;

  // Start both together
  TIM15->CR1 |= TIM_CR1_CEN;
  TIM2->CR1  |= TIM_CR1_CEN;

}
void delay (unsigned int time) {
  // Time in MilliSeconds (Caliberated on STM32F303X8B)
    for (volatile unsigned int i = 0; i < time; i++)
        for (volatile unsigned int j = 0; j < 575 ; j++);
}

void blink (int count) {
    for (int i = 0; i < 2*count ; i++)  {
        GPIOA->ODR ^= (1 << LED);  // Toggle PBx
        delay (1000) ;
    }
}

char * toBin (uint8_t k) {
   char *s ;
   s = (char *) malloc (8) ;
   for (int i=0 ; i<8 ; i++) {
      if (k & (1 << i)) s[7-i] = '1' ;
      else s[7-i] = '0' ;
   } 
   return (s);
}

void startUp() {

  init_TIM2_PWM() ;           // used for common pins signals (4 off)
  init_TIM16_PWM() ;          // used for single SEG pin

  // Enable Timers
  TIM2->CR1  |= TIM_CR1_CEN;
  TIM16->CR1  |= TIM_CR1_CEN;
  init_TIM3_IRQ() ;

  if (!(TIM2->CR1 & TIM_CR1_CEN))  blink (2);   // Timer is not  running!
  if (!(TIM16->CR1 & TIM_CR1_CEN)) blink (3);  // Timer is not  running!
  if (!(TIM3->CR1 & TIM_CR1_CEN))  blink (5);  //  Timer not running

  //Add LED
  outPin (GPIOA, LED) ;
  SETSTATE(GPIOA, LED, 1) ;   // LED on
  // Add Mux
  setupMux() ; 
  SETSTATE(GPIOB, MUXINH, 0) ; // 0 Enable Mux, 1 disable 
}
