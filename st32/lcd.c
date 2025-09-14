#include "lcd.h"

int main(void) {
  uint8_t s[8] = {
                  15, 15,
                  0, 0,
                  0, 0,
                  0, 0,
} ;
  startUp () ;
  selSeg (0) ;
  while (1) {
    for (uint8_t i=0 ; i<7 ; i++) {
        selSeg (i) ; // push toseg0
        segState = s[i];
//        resetTimers () ;
        delay (4500) ;
//        blink(1) ;
    } 
       __WFI();  // Sleep until interrupt (use when timers exist)
  } // end while
} // end main

void TIM3_IRQHandler(void) {

    if (TIM3->SR & TIM_SR_UIF) {
       TIM3->SR &= ~TIM_SR_UIF;   // avoids race conditions

      // === Drive all COMs ===
      for (int com = 0; com < 4; com++) {
	  float duty = comsTable[phase][com];
          if (invert) duty = 1 - duty ;  // for AC signal 
          // Active high is 0
	  (&TIM2->CCR1)[com] = (uint16_t)(TIM2ARR * (1-duty));
      }
      TIM2->EGR = TIM_EGR_UG;  // force CCR1 update

      // Drive Segments
      segDriver () ;

      if (phase == 3) {
          phase = 0 ; // new cycle
          invert = !invert ; // AC signal requirement
      }
      else phase = phase + 1 ;

    } // end of TIM3 Flag test 
} // End of TIM3_IRQ Handle

void segDriver(void) {

    // segState   .... Bit pattern controlling on/off status
    // since we have four coms, expect 4 bits in segState
    // A segline therfore can light up (four subsegments)
    // individually with appropriate segState

    float segDuty, comDuty ;
    uint8_t isOn = (segState >> phase) & 0x1;

    comDuty = comsTable[phase][phase] ;
    if (invert) comDuty = 1 - comDuty ;
    segDuty = (isOn ?  1 - comDuty :  comDuty) ;
    // Apply SEG waveform to PWM (Active high is low)
    TIM16->CCR1 = (uint16_t)(TIM16->ARR * (1 - segDuty));
    TIM16->EGR = TIM_EGR_UG;
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
    TIM2->CR1 &=  ~(3 << 5)  ;   // clear Center Aligned PWM
    TIM2->CR1 &= ~TIM_CR1_CEN;      // Stop the timer
    TIM2->CR1 &= ~(3 << 5);          // CMS = 00 → edge-aligned
    TIM2->CR1 |= TIM_CR1_CEN;        // Restart timer
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

    TIM3->CR1 &= ~TIM_CR1_CEN;      // Stop the timer
    TIM3->CR1 &= ~(3 << 5);          // CMS = 00 → edge-aligned
    TIM3->CR1  |= TIM_CR1_CEN; // Start Timer
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
    TIM16->CCER &= ~TIM_CCER_CC1NE; // ensure PB6 stays free

    TIM16->CR1 &= ~TIM_CR1_CEN;      // Stop the timer
    TIM16->CR1 &= ~(3 << 5);          // CMS = 00 → edge-aligned
    TIM16->CR1  |= TIM_CR1_CEN; // Start Timer
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

