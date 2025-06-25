#include "stm32f303x8.h"
#include <stdint.h>
#include <stdbool.h>
#include <stdlib.h>


// LCD Driving with 4Mux and 1/3 bias
//    Four Common Lines .. 
// Assumes default system clock = 8 MHz from HSI
#define TIM2PSC 0
#define TIM2ARR 511  //  8000/(1 * 512) =  (15.6kHz -> freq) 
#define TIM3PSC 199 
#define TIM3ARR 799 // 8000/(20800)  kHz = (50 Hz -> freq)
#define LED 4     // PB0 as LED indicator
#define NPHASES   4
#define PWM_MODE1 6  // is active high for count < ARR
#define PWM_MODE2 7  // is active low  for count < ARR
// Unfortunately there is another TIM2_CCER register bits can
// alter the polarity (a real messs)
// Looks as though default active high is 0 and ac
#define MIN(a, b) (((a) < (b)) ? ( a) : (b))

// Digit Display related stuff
#define NUM_DIGITS 4
#define NSEGPINS 8
#define NCOMS 4

const uint8_t comPinMap[24][4] = {
{0, 1, 2, 3}, {0, 1, 3, 2}, {0, 2, 1, 3}, {0, 2, 3, 1}, 
{0, 3, 1, 2}, {0, 3, 2, 1}, {1, 0, 2, 3}, {1, 0, 3, 2}, 
{1, 2, 0, 3}, {1, 2, 3, 0}, {1, 3, 0, 2}, {1, 3, 2, 0}, 
{2, 0, 1, 3}, {2, 0, 3, 1}, {2, 1, 0, 3}, {2, 1, 3, 0}, 
{2, 3, 0, 1}, {2, 3, 1, 0}, {3, 0, 1, 2}, {3, 0, 2, 1}, 
{3, 1, 0, 2}, {3, 1, 2, 0}, {3, 2, 0, 1}, {3, 2, 1, 0} } ;

const uint8_t iMap = 0 ;
volatile uint8_t target_com = 2 ; 
//volatile uint8_t comPinMap[4] = map
volatile uint8_t segState = 0b1111;
volatile uint8_t mux_index = 2 ;

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
void segDriver (void) ;

volatile uint8_t phase = 0;
volatile uint8_t invert = 0;  // Com Table Inversion flag

//const float pwmDuty[4] = {0, 0.33333, 0.66666, 1.0} ;
const float pwmDuty[4] = {0, 0.5, 0.5, 1.0} ;
const float  comsTable[NPHASES][4] = { //Cyclical shifted left
    { pwmDuty[0], pwmDuty[1], pwmDuty[2], pwmDuty[3] }, //phase 0
    { pwmDuty[1], pwmDuty[2], pwmDuty[3], pwmDuty[0] }, //phase 1
    { pwmDuty[2], pwmDuty[3], pwmDuty[0], pwmDuty[1] }, //phase 2
    { pwmDuty[3], pwmDuty[0], pwmDuty[1], pwmDuty[2] }, //phase 3
};

void TIM3_IRQHandler(void) {

    if (TIM3->SR & TIM_SR_UIF) {
       TIM3->SR &= ~TIM_SR_UIF;   // avoids race conditions

      // === Drive all COMs ===
      for (int com = 0; com < 4; com++) {
	  uint8_t ccr = comPinMap[iMap][com];
	  float duty = comsTable[phase][com];
          if (invert) duty = 1 - duty ;  // for AC signal 
          // Active high is 0
	  (&TIM2->CCR1)[ccr] = (uint16_t)(TIM2ARR * (1-duty));
      }
      // Drive Segments
      segDriver () ;

      if (phase == 3) invert = !invert ; //LCD AC generation
      phase = (phase + 1) % NPHASES;
         
    } // end of TIM3 Flag test 
} // End of TIM3_IRQ Handle

void segDriver(void) {

    // mux_index  .... select which subsegment to lit
    // target_com .... the com line that is connected to the above
    // segState   .... Bit pattern controlling on/off status
    // since we have four coms, expect 4 bits in segState
    // A segline therfore can light up (four subsegments)
    // individually with appropriate com signal levels

    uint8_t isOn = (segState >> mux_index) & 0x1;
    // We are in the phase that corresponds to the
    // com line associated with the segment and it is to be lit
    uint8_t isActive = (phase == target_com && isOn) ;

    // The following woud ensure segment turn on when
    // active, and off when not active, while honouring
    // iversion to mainatain AC pattern in Seg.
    float segDuty, comDuty ;
    comDuty = comsTable[phase][phase] ;
    if (invert) comDuty = 1 - comDuty ;
    segDuty = (isActive ?  1 - comDuty :  comDuty) ;
    // Apply SEG waveform to PWM (Active high is low)
    TIM16->CCR1 = (uint16_t)(TIM16->ARR * (1 - segDuty));
}

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
    // PWM_MODE1  active high if count < ARR (who knows what active high is)
    // Looks as though active high is (low) ... so duty needs inverted 
    TIM2->CCMR1 = (PWM_MODE1 << 4) | (1 << 3) |  // CH1 PWM mode 1 + preload 
                  (PWM_MODE1 << 12) | (1 << 11); // CH2 PWM mode 1 + preload
    TIM2->CCMR2 = (PWM_MODE1 << 4) | (1 << 3) |  // CH3 PWM mode 1 + preload
                  (PWM_MODE1 << 12) | (1 << 11); // CH4 PWM mode 1 + preload

    TIM2->CCER |= TIM_CCER_CC1E | TIM_CCER_CC2E | TIM_CCER_CC3E | TIM_CCER_CC4E;
    TIM2->CR1  |= TIM_CR1_ARPE;
    TIM2->EGR   = TIM_EGR_UG;
    TIM2->CR1 |=  (3 << 5)  ;   // Center Aligned PWM
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
    TIM3->CR1 |=  (3 << 5)  ;   // Center Aligned PWM
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
    TIM16->CCMR1 = (PWM_MODE1 << 4) | (1 << 3) ;  // CH1 PWM mode 1 + preload 
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
