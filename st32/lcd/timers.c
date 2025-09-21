#include "lcd.h"

volatile uint16_t TIM2ticks = 0 ;

// Output buffer for current SEG phase state
volatile uint8_t phase = 0;
volatile uint8_t invert = 1;  // Com Table Inversion flag
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

void configPWMpin (uint8_t i) {
  // Setup the pin in GPIOA for PWM signals
      GPIOA->MODER &= ~(0x3 << (i * 2));   // clear MODER bits
      GPIOA->MODER |=  (0x2 << (i * 2));   // AF mode
      GPIOA->AFR[0] &= ~(0xF << (i * 4));  // clear AFRL bits
      GPIOA->AFR[0] |=  (0x1 << (i * 4));  // AF1
      GPIOA->OTYPER &= ~(1 << i);          // output type = push-pull
      GPIOA->OSPEEDR &= ~(0x3 << (i * 2));   // clear first
      GPIOA->OSPEEDR |=  (0x3 << (i * 2));   // high speed
      GPIOA->PUPDR &= ~(0x3 << (i * 2));     // no pull-up/down
}

void init_TIM2_PWM(void) {
    RCC->AHBENR  |= RCC_AHBENR_GPIOAEN;
    (void)RCC->AHBENR ;  // wait for above to completeyy
    RCC->APB1ENR |= RCC_APB1ENR_TIM2EN;
    (void)RCC->APB1ENR ;  // wait for above to completeyy

    TIM2ticks = 0 ;  

  // PA0–PA3 → TIM2 CH1–CH4 (AF1) Used for Common Signals
    configPWMpin (PA0) ; configPWMpin (PA1) ;
    configPWMpin (PA2) ; configPWMpin (PA3) ;

    TIM2->PSC = TIM2PSC ;
    TIM2->ARR = TIM2ARR ;
    TIM2->CR1  |= TIM_CR1_ARPE; // enable auto-reload preload

    // Channel_x  is active while  TIMx_ARR < TIMx_CCR1 else inactive
    // Channel_x  output preload enable (TIMx_OC1PE)
    // PWM_MODE1  active high if count < ARR (who knows what active high is)
    // Looks as though active high is (low) ... so duty needs inverted 
    TIM2->CCMR1 = (PWM_MODE1 << 4) | (1 << 3) |  // CH1 PWM mode 1 + preload 
                  (PWM_MODE1 << 12) | (1 << 11); // CH2 PWM mode 1 + preload
    TIM2->CCMR2 = (PWM_MODE1 << 4) | (1 << 3) |  // CH3 PWM mode 1 + preload
                  (PWM_MODE1 << 12) | (1 << 11); // CH4 PWM mode 1 + preload
    TIM2->CCER |= TIM_CCER_CC1E | TIM_CCER_CC2E | TIM_CCER_CC3E | TIM_CCER_CC4E;
    
    TIM2->EGR = TIM_EGR_UG;                  // force preload update

    // Fire TIM3_IRQHandler every time Counter Overflow
    TIM2->EGR = TIM_EGR_UG ;    // Force update Event for reload register ARR
    TIM2->SR = 0 ;              // Clear Pending Flags (from status Register)
    TIM2->DIER |= TIM_DIER_UIE; // Enable Update Interrupt
    NVIC_ClearPendingIRQ (TIM2_IRQn) ;
    NVIC_EnableIRQ (TIM2_IRQn);
}

void TIM2_IRQHandler(void) {

   if (TIM2->SR & TIM_SR_UIF) {
       TIM2->SR &= ~TIM_SR_UIF;   // avoids race conditions

      // === Drive all COMs ===
      //  CCRx  is set with 1-duty insteady of duty since
      //  active low in PWM
      // Note CCRs are not aligned with COM index. Nucleo board
      // hardwired in this way (GPIOA1, GPIOA0, GPIOA2, GPIOA3)
      volatile uint32_t *ccr[4] = { &TIM2->CCR2, &TIM2->CCR1, 
				    &TIM2->CCR3, &TIM2->CCR4 };

      for (int com = 3; com < 4; com++) {
	   float duty = comsTable[phase][com];
	   if (invert) duty = 1 - duty;
	   *ccr[com] = (uint16_t)(TIM2ARR * duty);
       }

       TIM2->EGR = TIM_EGR_UG;   // <<< force preload transfer for all 4 channels

       // Drive Segments
       segDriver () ;
       
       TIM2ticks = TIM2ticks + 1 ;
       if (TIM2ticks == (TIM2FRQ / PHASEFRQ) - 1) { // ready for next phase
	    TIM2ticks = 0 ;
	    if (phase == 3) {
		phase = 0 ; // new cycle
		invert = !invert ; // AC signal requirement
	    }
	    else phase = phase + 1 ;
        }   
    } // end of TIM2 Flag test 
}

void init_TIM16_PWM(void) {
 // This timer is tied to PA6 ... can't move this
 // Using CH1 of TIM16 as SIG pin  

    RCC->AHBENR  |= RCC_AHBENR_GPIOAEN;
    (void)RCC->AHBENR ;  // wait for above to completeyy
    RCC->APB2ENR |= RCC_APB2ENR_TIM16EN;
    (void)RCC->APB2ENR ;  // wait for above to completeyy

    configPWMpin (PA6)  ;   // (PA6) as  segment pin

    // Using same frequency settings as TIM2 that control Commons
    TIM16->PSC = TIM2PSC  ;
    TIM16->ARR = TIM2ARR  ;

    // Channel_x  is active while  TIMx_ARR < TIMx_CCR1 else inactive
    // Channel_x  output preload enable (TIMx_OC1PE)
    TIM16->CCMR1 = (PWM_MODE1 << 4) | (1 << 3) ;  // CH1 PWM mode 1 + preload 
    TIM16->CCER |= TIM_CCER_CC1E ; // enable CH1 output
    TIM16->CR1  |= TIM_CR1_ARPE;
    TIM16->EGR = TIM_EGR_UG;
    // This is a must as TIM16 has complementary outputs
    TIM16->BDTR |= TIM_BDTR_MOE ;   //Master output Enable
    TIM16->CCER &= ~TIM_CCER_CC1NE; // ensure PB6 stays free
}


void segDriver(void) {

    // segState   .... Bit pattern controlling on/off status
    // since we have four coms, expect 4 bits in segState
    // A segline therfore can light up (four subsegments)
    // individually with appropriate segState

    float segDuty, comDuty ;

    uint8_t state = getSegState() ;
    uint8_t isOn = (state >> phase) & 0x1;

    comDuty = comsTable[phase][phase] ;
    if (invert) comDuty = 1 - comDuty ;
    segDuty = (isOn ?  1 - comDuty :  comDuty) ;
    // Apply SEG waveform to PWM (Active high is low)
    TIM16->CCR1 = (uint16_t)(TIM16->ARR * (1 - segDuty));
    TIM16->EGR = TIM_EGR_UG;
}
