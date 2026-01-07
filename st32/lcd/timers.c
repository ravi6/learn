#include "lcd.h"
volatile uint16_t TIM2ticks = 0 ;

// Output buffer for current SEG phase state
volatile uint8_t phase = 0;
volatile uint8_t state ;  // state used for display
//const float pwmDuty[4] = {0, 1/3, 2/3, 1}  ;
const float pwmDuty[4] = {0, 1/3, 2/3, 1}  ;

const float  comsTable[NPHASES][4] = { // RMS optimized ? 
    { pwmDuty[0], pwmDuty[1], pwmDuty[2], pwmDuty[3] }, //phase 0
    { pwmDuty[1], pwmDuty[0], pwmDuty[3], pwmDuty[2] }, //phase 1
    { pwmDuty[2], pwmDuty[3], pwmDuty[0], pwmDuty[1] }, //phase 2
    { pwmDuty[3], pwmDuty[2], pwmDuty[1], pwmDuty[0] }, //phase 3

    { pwmDuty[0], pwmDuty[2], pwmDuty[1], pwmDuty[3] }, //phase 4
    { pwmDuty[2], pwmDuty[0], pwmDuty[3], pwmDuty[1] }, //phase 5
    { pwmDuty[1], pwmDuty[3], pwmDuty[0], pwmDuty[2] }, //phase 6
    { pwmDuty[3], pwmDuty[1], pwmDuty[2], pwmDuty[0] }, //phase 7
} ;

/* ChatGPt says this replica of AN1428 */
/*
const float comsTable[NPHASES][4] = {
    {0.0f, 1.0f/3.0f, 2.0f/3.0f, 1.0f}, // P0
    {1.0f/3.0f, 2.0f/3.0f, 1.0f, 2.0f/3.0f}, // P1
    {2.0f/3.0f, 1.0f, 2.0f/3.0f, 1.0f/3.0f}, // P2
    {1.0f, 2.0f/3.0f, 1.0f/3.0f, 0.0f}, // P3
    {2.0f/3.0f, 1.0f/3.0f, 0.0f, 1.0f/3.0f}, // P4
    {1.0f/3.0f, 0.0f, 1.0f/3.0f, 2.0f/3.0f}, // P5
    {0.0f, 1.0f/3.0f, 2.0f/3.0f, 1.0f}, // P6
    {1.0f/3.0f, 2.0f/3.0f, 1.0f, 2.0f/3.0f}  // P7
};
*/


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
       if (TIM2ticks == (TIM2FRQ / PHASEFRQ)/NPHASES - 1) { 
	    TIM2ticks = 0 ;
        }   

   } // end race cond 
}// end of TIM2 Interrupt

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
	   *ccr[com] = (uint16_t)(TIM2ARR *  (1-duty));
       }

    // Drive Seg Line
    // segState   .... Bit pattern controlling on/off status
    // Controlling the four subsegments of the digit

    // Update state at start of four phase cycle
    // and get corresponding segWaveForm
    if (phase == 0) 
          state =  getSegState() ; // one of sixteen states
   
    float   segDuty;
    uint8_t targetCom = phase / 2;  // integer division

      if ( (state >> targetCom) & 0x1 )  // if the segment is on
         segDuty = 1 - comsTable[phase][targetCom];
      else
         segDuty = comsTable[phase][targetCom];

    TIM16->CCR1 = (uint16_t)(TIM16->ARR *  (1-segDuty));

    if (phase == NPHASES - 1) {
	phase = 0 ; // new cycle
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

    // Channel_x  is active while  TIMx_CNT < TIMx_CCR1 else inactive
    // Channel_x  output preload enable (TIMx_OC1PE)
    TIM16->CCMR1 = (PWM_MODE1 << 4) | (1 << 3) ;  // CH1 PWM mode 1 + preload 
    TIM16->CCER |= TIM_CCER_CC1E ; // enable CH1 output
    TIM16->CR1  |= TIM_CR1_ARPE  ;

    // This is a must as TIM16 has complementary outputs
    TIM16->BDTR |= TIM_BDTR_MOE ;   //Master output Enable
    TIM16->CCER &= ~TIM_CCER_CC1NE; // ensure PB6 stays free
}

