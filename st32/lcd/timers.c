#include "lcd.h"
volatile uint16_t TIM2ticks = 0 ;

// Output buffer for current SEG phase state
volatile uint8_t phase = 0;
volatile uint8_t invert = 1;  // Com Table Inversion flag
volatile uint8_t state ;  // state used for display

//const float pwmDuty[4] = {0, 0.5, 1.0, 0.5} ;
const float pwmDuty[4] = {0, 0.3333, 0.6666, 1} ;

const float  comsTable[NPHASES][4] = { //Cyclical shifted left
    { pwmDuty[0], pwmDuty[1], pwmDuty[2], pwmDuty[3] }, //phase 0
    { pwmDuty[1], pwmDuty[2], pwmDuty[3], pwmDuty[0] }, //phase 1
    { pwmDuty[2], pwmDuty[3], pwmDuty[0], pwmDuty[1] }, //phase 2
    { pwmDuty[3], pwmDuty[0], pwmDuty[1], pwmDuty[2] }, //phase 3
};

void TIM2_IRQHandler(void) {

   // avoid race conditions
   if (TIM2->SR & TIM_SR_UIF) {
       TIM2->SR &= ~TIM_SR_UIF;   // clear update flag
       
       if (TIM2ticks == 0) { // Load ccrs at start of phase
         segDriver () ;
         TIM2->EGR = TIM_EGR_UG;   // <<< force preload
         TIM16->EGR = TIM_EGR_UG;   // <<< force preload
       }
       TIM2ticks = TIM2ticks + 1 ; // phase time ticker

       // start of phase
       if (TIM2ticks == (TIM2FRQ / PHASEFRQ)/4 - 1) { 
	    TIM2ticks = 0 ;
        }   

   } // end race cond 
}// end of TIM3 Interrupt

void segDriver (void) {

      // === Drive all COMs ===
      //  CCRx  is set with 1-duty insteady of duty since
      //  active low in PWM
      // Note CCRs are not aligned with COM index. Nucleo board
      // hardwired in this way (GPIOA1, GPIOA0, GPIOA2, GPIOA3)
      volatile uint32_t *ccr[4] = { &TIM2->CCR2, &TIM2->CCR1, 
				    &TIM2->CCR3, &TIM2->CCR4 };
      for (int com = 0; com < 4; com++) {
	   float duty = comsTable[phase][com];
	   if (invert) duty = 1 - duty;
	   *ccr[com] = (uint16_t)(TIM2ARR * duty);
       }

    // Drive Seg Line
    // segState   .... Bit pattern controlling on/off status
    // since we have four coms, expect 4 bits in segState
    // A segline therfore can light up (four subsegments)
    // individually with appropriate segState

    float segDuty, comDuty ;
    uint8_t  isOn ;

    // Update state at start of four phase cycle
    if (phase == 3) state =  getSegState() ;
    isOn = (state >> phase) & 0x1;

    comDuty = comsTable[phase][phase] ;
    if (invert & isOn) comDuty = 1 - comDuty ;
    segDuty = (isOn ?  1 - comDuty :  comDuty) ;
    // Apply SEG waveform to PWM (Active high is low)
    TIM16->CCR1 = (uint16_t)(TIM16->ARR * (1 - segDuty));

    if (phase == 3) {
	phase = 0 ; // new cycle
	invert = !invert ; // AC signal requirement
    }
    else phase = phase + 1 ;
}

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

void setup_TIM2_PWM(void) {
    RCC->APB1ENR |= RCC_APB1ENR_TIM2EN;
    (void)RCC->APB1ENR ;  // wait for above to completeyy

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
    
    TIM2->SR = 0 ;              // Clear Pending Flags (from status Register)
    
    // Fire TIM2_IRQHandler every time Counter Overflow
    NVIC_ClearPendingIRQ (TIM2_IRQn) ;
    NVIC_EnableIRQ (TIM2_IRQn);
}


void setup_TIM16_PWM(void) {
 // This timer is tied to PA6 ... can't move this
 // Using CH1 of TIM16 as SIG pin  

    RCC->APB2ENR |= RCC_APB2ENR_TIM16EN;
    (void)RCC->APB2ENR ;  // wait for above to completeyy

    // Using same frequency settings as TIM2 that control Commons
    TIM16->PSC = TIM2PSC  ;
    TIM16->ARR = TIM2ARR  ;

    configPWMpin (PA6)  ;   // (PA6) as  segment pin

    // Channel_x  is active while  TIMx_ARR < TIMx_CCR1 else inactive
    // Channel_x  output preload enable (TIMx_OC1PE)
    TIM16->CCMR1 = (PWM_MODE1 << 4) | (1 << 3) ;  // CH1 PWM mode 1 + preload 
    TIM16->CCER |= TIM_CCER_CC1E ; // enable CH1 output
    TIM16->CR1  |= TIM_CR1_ARPE;

    // This is a must as TIM16 has complementary outputs
    TIM16->BDTR |= TIM_BDTR_MOE ;   //Master output Enable
    TIM16->CCER &= ~TIM_CCER_CC1NE; // ensure PB6 stays free
}

