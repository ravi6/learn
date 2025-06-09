#include "stm32f303x8.h"
#include <stdint.h>
#include <stdbool.h>
#include <stdlib.h>


// LCD Driving with 4Mux and 1/3 bias
//    Four Common Lines .. 
// Assumes default system clock = 8 MHz from HSI
#define TIM2PSC 1
#define TIM2ARR 255  //  8000/(2 * 256) =  (15.6kHz -> freq) 
#define TIM3PSC 99 
#define TIM3ARR 799 // 8000/(200*800)  kHz = (50 Hz -> freq)
#define LED 4     // PB0 as LED indicator
#define NUM_PHASES   4
#define PWM_MODE1 6
#define PWM_MODE2 7
#define MIN(a, b) (((a) < (b)) ? ( a) : (b))

// Digit Display related stuff
#define NUM_DIGITS 4
#define NSEGPINS 8
#define NCOMS 4
#define MAPCOM(i)  ( comMap[i] )

volatile uint8_t segState = 0b0010 ;
const uint8_t comMap[4] = {3,2,1,0} ;

// Logical segment indices
enum {SEG_A, SEG_B, SEG_C, SEG_D,
      SEG_E, SEG_F, SEG_G, SEG_P}  ;

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

void setupLED(void) ;
void delay (unsigned int time) ;
void blink (int n) ;
void init_TIM2_PWM(void) ;
void init_TIM16_PWM(void);
void init_TIM3_IRQ(void) ;
void TIM3_IRQHandler(void) ;
void clrSegStates(void) ;
void updateDigit(uint8_t digPos, uint8_t digVal) ;

volatile uint8_t phase = 0;
volatile uint8_t invert = 0;  // Com Table Inversion flag

//Duty cycles for to PWM Count (Period)  (slightly more than 1/3 bias)
// Ideally [1/3, 1/2, 2/3, 1/2] .... typical 1/3 bias
// But my LCD wants higher RMS ... 
// The above pattern has symmetry around mean (0.5)
// ie. Subtract 0.5 we get   [-1/3, 0, 1/3, 0]
// In my case I scale this by 1.4 to get higher RMS
//
const float sf = 1.4 ;
const uint16_t pwmDuty[4] = {TIM2ARR*(sf * 1/3), TIM2ARR*(sf * 1/2),
                             TIM2ARR*(sf * 2/3), TIM2ARR} ;
const uint16_t comsTable[NUM_PHASES][4] = {
    { pwmDuty[0], pwmDuty[1], pwmDuty[2], pwmDuty[3] }, //C0
    { pwmDuty[1], pwmDuty[2], pwmDuty[3], pwmDuty[0] }, //C1
    { pwmDuty[2], pwmDuty[3], pwmDuty[0], pwmDuty[1] }, //C2
    { pwmDuty[3], pwmDuty[0], pwmDuty[1], pwmDuty[2] }  //C3
};

void TIM3_IRQHandler(void) {
   // Drive all com Lines setting voltage according to Mux phase
   // This is achieved with duty cycle that 
   // is proportional to voltage ratio

    if (TIM3->SR & TIM_SR_UIF) {
       TIM3->SR &= ~TIM_SR_UIF;

       uint8_t  com ;    // Active Com 
       uint16_t comDuty;

       com = MAPCOM (phase) ;   // Driving one Com per phase
       
       if (invert)
         comDuty = pwmDuty[3] - comsTable[phase][com];
       else
         comDuty = comsTable[phase][com];
             
        switch (com) {  // set CCR value corresponding to COM
           case 0: TIM2->CCR1 = comDuty; break;  // COM0 
           case 1: TIM2->CCR2 = comDuty; break;  // COM1
           case 2: TIM2->CCR3 = comDuty; break;  // COM2
           case 3: TIM2->CCR4 = comDuty; break;  // COM3 
        }

       // Drive Segment Line connected to Active com 
       // For now we are testing just one segline
         if ( (1 << phase) & segState )     // SEG Pin Output 
	       TIM16->CCR1 = pwmDuty[3] - comDuty ; // oppose comValue
	 else   
	    TIM16->CCR1 = comDuty; // follow com value 
       
         phase = (phase + 1) % NUM_PHASES;
         if (phase == 0) invert = !invert ; //LCD AC generation
         
    } // end of TIM3 Flag test 
} // End of TIM3_IRQ Handle

void init_TIM2_PWM(void) {
    RCC->AHBENR  |= RCC_AHBENR_GPIOAEN;
    (void)RCC->AHBENR ;  // wait for above to completeyy
    RCC->APB1ENR |= RCC_APB1ENR_TIM2EN;
    (void)RCC->APB1ENR ;  // wait for above to completeyy

    // PA0–PA3 → TIM2 CH1–CH4 (AF1) Used for Common Signals 
    //
    for (int i = 0 ; i < 4 ; i++) {
      GPIOA->MODER &= ~(0x3 << (i * 2));     // Clear MODER_i
      GPIOA->MODER |= (2 << (i * 2)) ;       // Set to AF mode
      GPIOA->AFR[0] &= ~(0xF << (i * 4));    // Clear AFRL0 of pin_i
      GPIOA->AFR[0] |=  (0x1 << (i * 4));    // set to AF1  function (TIM2)
      GPIOA->OTYPER &= ~(1 << i);            // Push-pull
      GPIOA->OSPEEDR |= (0x3 << (i * 2));    // High speed
      GPIOA->PUPDR &= ~(0x3 << (i * 2));     // No pull-up/down
    }

    TIM2->PSC = TIM2PSC ;
    TIM2->ARR = TIM2ARR ;

    // Channel_x  is active while  TIMx_ARR < TIMx_CCR1 else inactive
    // Channel_x  output preload enable (TIMx_OC1PE)
    // PWM_MODE2   center aligned pwm  (Pulse count is at the middle of the pulse)
    // Improves alighnment
    TIM2->CCMR1 = (PWM_MODE2 << 4) | (1 << 3) |  // CH1 PWM mode 2 + preload 
                  (PWM_MODE2 << 12) | (1 << 11); // CH2 PWM mode 2 + preload
    TIM2->CCMR2 = (PWM_MODE2 << 4) | (1 << 3) |  // CH3 PWM mode 2 + preload
                  (PWM_MODE2 << 12) | (1 << 11); // CH4 PWM mode 2 + preload

    TIM2->CCER |= TIM_CCER_CC1E | TIM_CCER_CC2E | TIM_CCER_CC3E | TIM_CCER_CC4E;
    TIM2->CR1  |= TIM_CR1_ARPE;
    TIM2->EGR   = TIM_EGR_UG;
    TIM2->CR1  |= TIM_CR1_CEN;
}

void init_TIM3_IRQ(void) {
    RCC->APB1ENR |= RCC_APB1ENR_TIM3EN;
    (void)RCC->APB1ENR ;  // wait for above to completeyy

    TIM3->PSC = TIM3PSC ;
    TIM3->ARR = TIM3ARR ;

    // Fire TIM3_IRQHandler every time Counter Overflow
    TIM3->EGR = TIM_EGR_UG ;    // Force update Event for reload register ARR
    TIM3->SR = 0 ;              // Clear Pending Flags (from status Register)
    TIM3->DIER |= TIM_DIER_UIE; // Enable Update Interrupt
    NVIC_ClearPendingIRQ (TIM3_IRQn) ;
    NVIC_EnableIRQ (TIM3_IRQn);
    TIM3->CR1  |= TIM_CR1_CEN; // Start Timer
}

void setupLED() {
    RCC->AHBENR |= RCC_AHBENR_GPIOBEN; // 1. Enable GPIOB clock
    (void)RCC->AHBENR ;  // wait for above to completeyy

    GPIOB->MODER &= ~(3 << (LED * 2));    // Clear MODERx bits
    GPIOB->MODER |=  (1 << (LED * 2));    // Set MODERx = 0b01 (output mode)
    GPIOB->AFR[0] &= ~(0xF << (LED * 4)) ; // CLR AFRL bits  (insurence)

    GPIOB->OTYPER &= ~(1 << LED);         // Push-pull
    GPIOB->OSPEEDR |= (1 << (LED * 2));   // Medium speed
    GPIOB->PUPDR   &= ~(3 << (LED * 2));    // No pull-up/down
    GPIOB->ODR |= (1 << LED);             // PBx = 1 (LED ON, if active high)
}

void delay (unsigned int time) {
  // Time in MilliSeconds (Caliberated on STM32F303X8B)
    for (volatile unsigned int i = 0; i < time; i++)
        for (volatile unsigned int j = 0; j < 575 ; j++);
}

void blink (int count) {
    for (int i = 0; i < 2*count ; i++)  {
        GPIOB->ODR ^= (3 << LED);  // Toggle PBx
        delay (1000) ;
    }
}

void init_TIM16_PWM(void) {
 // This timer is tied to PA6 ... can't move this
 // Using CH1 of TIM16 as SIG pin  

    RCC->AHBENR  |= RCC_AHBENR_GPIOAEN;
    (void)RCC->AHBENR ;  // wait for above to completeyy
    RCC->APB2ENR |= RCC_APB2ENR_TIM16EN;
    (void)RCC->APB2ENR ;  // wait for above to completeyy

    // TIM16 as PWM with output on  GPIOA PA6 as segment output 
    // with AF1 alternate function
      int i ;
      i = 6 ;   // (PA6) as  segment pin
      GPIOA->MODER &= ~(0x3 << (i * 2));     // Clear MODER_i
      GPIOA->MODER |= (2 << (i * 2)) ;       // Set to AF mode
      GPIOA->AFR[0] &= ~(0xF << (i * 4));    // Clear AFRL0 of pin_i
      GPIOA->AFR[0] |=  (0x1 << (i * 4));    // set to AF1  function (TIM16)
      GPIOA->OTYPER &= ~(1 << i);            // Push-pull
      GPIOA->OSPEEDR |= (0x3 << (i * 2));    // High speed
      GPIOA->PUPDR &= ~(0x3 << (i * 2));     // No pull-up/down

    // Using same frequency settings as TIM2 that control Commons
    TIM16->PSC = TIM2PSC  ;
    TIM16->ARR = TIM2ARR  ;

    // Channel_x  is active while  TIMx_ARR < TIMx_CCR1 else inactive
    // Channel_x  output preload enable (TIMx_OC1PE)
    TIM16->CCMR1 = (PWM_MODE2 << 4) | (1 << 3) ;  // CH1 PWM mode 2 + preload 
    TIM16->CCER |= TIM_CCER_CC1E ;
    TIM16->CR1  |= TIM_CR1_ARPE;
    TIM16->EGR   = TIM_EGR_UG;
    // This is a must as TIM16 has complementary outputs
    TIM16->BDTR |= TIM_BDTR_MOE ;   //Master output Enable
    TIM16->CR1  |= TIM_CR1_CEN;
}

// Update SEG states for a given digit and its value
void updateDigit(uint8_t digPos, uint8_t digVal) {
    uint8_t enc = digEncode[digVal];  // digValue 0 to 9

    for (uint8_t phase = 0; phase < NCOMS; ++phase) {
        uint8_t sL = seg_map[digPos*2][phase];
        uint8_t sR = seg_map[digPos*2 + 1][phase];

       // Load segState bits for the digit we want
        segStates[digPos*2] |= ((enc >> sL) & 1) << phase;
        segStates[digPos*2+1] |= ((enc >> sR) & 1) << phase;
    }
} // end Update Digit

// Clear segment states
void clrSegStates(void) {
    for (int i = 0; i < NSEGPINS; ++i)
        segStates[i] = 0;
}

int main(void) {

  setupLED() ; // Debug indicator
  GPIOB->ODR = (0 << LED);  // LED off
  init_TIM2_PWM() ; // used for common pins signals (4 off)
  init_TIM16_PWM() ; // used for single SEG pin

  init_TIM3_IRQ() ;

   if (!(TIM2->CR1 & TIM_CR1_CEN))  // Timer is not  running!
        blink(2) ;
   if (!(TIM16->CR1 & TIM_CR1_CEN))  // Timer is not  running!
        blink(3) ;
   if (!(TIM3->CR1 & TIM_CR1_CEN))  //  Timer not running
        blink(5) ;
/*
    clrSegStates() ;
    for (volatile uint8_t i=0 ; i < 10 ; i++) {
    blink(6) ;
    updateDigit(0, i) ;
    } 
// Not yet connected
    updateDigit(1, 1) ;
    updateDigit(2, 1) ;
    updateDigit(3, 1) ;
*/
    while (1) {
    for (int i=0 ; i < 4 ; i++) {
         blink (1) ;
         segState = (1 << i) ;
    } 
       __WFI();  // Sleep until interrupt
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
