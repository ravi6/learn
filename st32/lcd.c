#include "stm32f3xx.h"
// Assumes default system clock = 8 MHz from HSI
#define TIM2PSC 7    // 8000 / 8 =  1000kHz
#define TIM2ARR 99   //  1000 / 100  (10kHz -> freq) 
#define TIM3PSC 132  //  8000 / 133 = 60 kHz
#define TIM3ARR 999  // 60 / 1000  kHz = (60 Hz -> freq)
#define LED 4     // PB4 as LED indicator
#define NUM_PHASES   4

void setupLED(void) ;
void blink (int n) ;
void init_TIM2_PWM(void) ;
void init_TIM3_IRQ(void) ;
void TIM3_IRQHandler(void) ;

volatile uint8_t phase = 0;

// Duty cycles for 0%, 33%, 66%, %33 scaled to PWM_PERIOD
const uint16_t pwmDuty[4] = {0, 33, 66, 33} ;

// Each row = phase; each column = COMx duty
const uint16_t comsTable[NUM_PHASES][4] = {
    { pwmDuty[0], pwmDuty[1], pwmDuty[2], pwmDuty[3] },
    { pwmDuty[3], pwmDuty[0], pwmDuty[1], pwmDuty[2] },
    { pwmDuty[2], pwmDuty[3], pwmDuty[0], pwmDuty[1] },
    { pwmDuty[1], pwmDuty[2], pwmDuty[3], pwmDuty[0] }
};


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

    // Channel_x  is active while  TIMx_CNT < TIMx_CCR1 else inactive
    // Channel_x  output preload enable (TIMx_OC1PE)
    TIM2->CCMR1 = (6 << 4) | (1 << 3) |  // CH1 PWM mode 1 + preload 
                  (6 << 12) | (1 << 11); // CH2 PWM mode 1 + preload
    TIM2->CCMR2 = (6 << 4) | (1 << 3) |  // CH3 PWM mode 1 + preload
                  (6 << 12) | (1 << 11); // CH4 PWM mode 1 + preload

    TIM2->CCER |= TIM_CCER_CC1E | TIM_CCER_CC2E | TIM_CCER_CC3E | TIM_CCER_CC4E;
    TIM2->CR1  |= TIM_CR1_ARPE;
    TIM2->EGR   = TIM_EGR_UG;
    TIM2->CR1  |= TIM_CR1_CEN;
}

void TIM3_IRQHandler(void) {
   // Drive all com Lines setting voltage according to Mux phase
   // This is achieved with duty cycle that is proportional to voltage ratio
    if (TIM3->SR & TIM_SR_UIF) {
        TIM3->SR &= ~TIM_SR_UIF;
        TIM2->CCR1 = comsTable[phase][0]; // COM0
        TIM2->CCR2 = comsTable[phase][1]; // COM1
        TIM2->CCR3 = comsTable[phase][2]; // COM2
        TIM2->CCR4 = comsTable[phase][3]; // COM3
        phase = (phase + 1) % NUM_PHASES;
    } 
}

void init_TIM3_IRQ(void) {
    RCC->APB1ENR |= RCC_APB1ENR_TIM3EN;
    (void)RCC->APB1ENR ;  // wait for above to completeyy

    TIM3->PSC = TIM3PSC ;
    TIM3->ARR = TIM3ARR ;

    // Fire TIM3_IRQHandler every time Counter Overflow
    TIM3->EGR = TIM_EGR_UG ; // Force update Event for reload register ARR
    TIM3->SR = 0 ; // Clear Pending Flags (from status Register)
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

    GPIOB->OTYPER &= ~(1 << LED);         // Push-pull
    GPIOB->OSPEEDR |= (1 << (LED * 2));   // Medium speed
    GPIOB->PUPDR &= ~(3 << (LED * 2));    // No pull-up/down
    GPIOB->ODR |= (1 << LED);             // PBx = 1 (LED ON, if active high)
}

void blink (int count) {
    for (int i = 0; i < count ; i++)  {
        GPIOB->ODR ^= (1 << LED);  // Toggle PAx
        for (volatile int i = 0; i < 200000; i++);  // crude delay
    }
}

int main(void) {

  setupLED() ; // Debug indicator
  init_TIM2_PWM() ; // used for common pins signals (4 off)
  init_TIM3_IRQ() ;

   if (!(TIM2->CR1 & TIM_CR1_CEN))  // Timer is not  running!
        blink(3) ;
   
   if (!(RCC->APB1ENR & RCC_APB1ENR_TIM3EN) ||
       !(TIM3->CR1 & TIM_CR1_CEN))  // TIM3 is not clocked or enabled
        blink(10) ;

    while (1) {
       __WFI();  // Sleep until interrupt
    }
}

