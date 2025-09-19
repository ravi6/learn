#include "lcd.h"

// Output buffer for current SEG phase state
volatile uint8_t phase = 0;
volatile uint8_t invert = 1;  // Com Table Inversion flag
const float pwmDuty[4] = {0, 0.33333, 0.66666, 1.0} ;
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

  // PA0–PA3 → TIM2 CH1–CH4 (AF1) Used for Common Signals
    configPWMpin (PA0) ; configPWMpin (PA1) ;
    configPWMpin (PA2) ; configPWMpin (PA3) ;

    TIM2->PSC = TIM2PSC ;
    TIM2->ARR = TIM2ARR ;
    TIM2->CR1  |= TIM_CR1_ARPE; // enable auto-reload preload
    TIM2->CCMR1 = (PWM_MODE1 << 4) | (1 << 3) |  // CH1 PWM mode 1 + preload 
                  (PWM_MODE1 << 12) | (1 << 11); // CH2 PWM mode 1 + preload
    TIM2->CCMR2 = (PWM_MODE1 << 4) | (1 << 3) |  // CH3 PWM mode 1 + preload
                  (PWM_MODE1 << 12) | (1 << 11); // CH4 PWM mode 1 + preload
    TIM2->CCER |= TIM_CCER_CC1E | TIM_CCER_CC2E | TIM_CCER_CC3E | TIM_CCER_CC4E;
    
    // Master mode: TRGO on update event
    TIM2->CR2 &= ~TIM_CR2_MMS;
    TIM2->CR2 |= (0b010 << TIM_CR2_MMS_Pos); // MMS=010 → Update event
    TIM2->EGR = TIM_EGR_UG;                  // force preload update
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
}

void init_TIM15_PWM(void) {
 // This timer is tied to PA6 ... can't move this
 // Using CH1 of TIM15 as SIG pin  

    RCC->AHBENR  |= RCC_AHBENR_GPIOAEN;
    (void)RCC->AHBENR ;  // wait for above to completeyy
    RCC->APB2ENR |= RCC_APB2ENR_TIM15EN;
    (void)RCC->APB2ENR ;  // wait for above to completeyy

    configPWMpin (PA6)  ;   // (PA6) as  segment pin
    // This is a must as TIM15 has complementary outputs
    TIM15->BDTR |= TIM_BDTR_MOE ;   //Master output Enable
    TIM15->CCER &= ~TIM_CCER_CC1NE; // ensure PB6 stays free

    // Using same frequency settings as TIM2 that control Commons
    TIM15->PSC = TIM2PSC  ;
    TIM15->ARR = TIM2ARR  ;

    // Channel_x  is active while  TIMx_ARR < TIMx_CCR1 else inactive
    // Channel_x  output preload enable (TIMx_OC1PE)
    TIM15->CCMR1 = (PWM_MODE1 << 4) | (1 << 3) ;  // CH1 PWM mode 1 + preload 
    TIM15->CCER |= TIM_CCER_CC1E ;
    TIM15->CR1  |= TIM_CR1_ARPE;
    TIM15->EGR = TIM_EGR_UG;
   
  // Select TIM2 TRGO as trigger input (Table 129, page 732)
  TIM15->SMCR &= ~(TIM_SMCR_SMS | TIM_SMCR_TS);
  TIM15->SMCR |= (0b100 << TIM_SMCR_SMS_Pos);  // SMS=100 → reset mode
  TIM15->SMCR |= (0b000 << TIM_SMCR_TS_Pos);    // (TS =0b000) ITR0 → TIM2 TRGO

// TIM15 will reset counter each TIM2 update
}

void TIM3_IRQHandler(void) {

    if (TIM3->SR & TIM_SR_UIF) {
       TIM3->SR &= ~TIM_SR_UIF;   // avoids race conditions

    // hardwired in this way (GPIOA1, GPIOA0, GPIOA2, GPIOA3)
    volatile uint32_t *ccr[4] = { &TIM2->CCR2, &TIM2->CCR1, 
                                  &TIM2->CCR3, &TIM2->CCR4 };

    for (int com = 0; com < 4; com++) {
         float duty = comsTable[phase][com];
         if (invert) duty = 1 - duty;
         *ccr[com] = (uint16_t)(TIM2ARR * duty);
     }

     TIM2->EGR = TIM_EGR_UG;   // <<< force preload transfer for all 4 channels

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

    float segDuty, comDuty ;
    uint8_t state = getSegState() ;
    uint8_t isOn = (state >> phase) & 0x1;

    comDuty = comsTable[phase][phase] ;
    if (invert) comDuty = 1 - comDuty ;
    segDuty = (isOn ?  1 - comDuty :  comDuty) ;
    // Apply SEG waveform to PWM (Active high is low)
    TIM15->CCR1 = (uint16_t)(TIM15->ARR * (1 - segDuty));
    TIM15->EGR = TIM_EGR_UG;
}

void startUp() {

  init_TIM2_PWM() ;           // used for common pins signals (4 off)
  init_TIM15_PWM() ;          // used for single SEG pin
  init_TIM3_IRQ() ;          // Control wave patterns of Cx, and Seg

  outPin (GPIOA, LED) ;
  SETSTATE(GPIOA, LED, 1) ;   // LED on

  // Enable Timers
  TIM15->CR1 |= TIM_CR1_CEN; // first slave (Seg line PWM clock)
  TIM2->CR1  |= TIM_CR1_CEN;  // then master (Cx lines PWM clock))
  TIM3->CR1  |= TIM_CR1_CEN; // (Seg and Cx signal gen clock)

  // Check they are ticking
  if (!(TIM2->CR1 & TIM_CR1_CEN))  blink (2);   // TIM2 not  running!
  if (!(TIM15->CR1 & TIM_CR1_CEN)) blink (3);  // TIM15 not  running!
  if (!(TIM3->CR1 & TIM_CR1_CEN))  blink (5);  //  TIM2 not running

  // Add Mux
  setupMux() ; 
  SETSTATE(GPIOB, MUXINH, 0) ; // 0 Enable Mux, 1 disable 
}
