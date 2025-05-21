#include "lcd.h"

void init_TIM2_PWM(void) {
    RCC->AHBENR  |= RCC_AHBENR_GPIOAEN;
    (void)RCC->AHBENR ;  // wait for above to completeyy
    RCC->APB1ENR |= RCC_APB1ENR_TIM2EN;
    (void)RCC->APB1ENR ;  // wait for above to completeyy

    // PA0–PA3 → TIM2 CH1–CH4 (AF1)
    for (int i = 0 ; i < 4 ; i++) {
      GPIOA->MODER &= ~(0x3 << (i * 2));     // Clear MODER_i
      GPIOA->MODER |= (2 << (i * 2)) ;       // Set to AF mode
      GPIOA->AFR[0] &= ~(0xF << (i * 4));    // Clear AFRL0 of pin_i
      GPIOA->AFR[0] |=  (0x1 << (i * 4));    // set to AF1  function (TIM2)
      GPIOA->OTYPER &= ~(1 << i);            // Push-pull
      GPIOA->OSPEEDR |= (0x3 << (i * 2));    // High speed
      GPIOA->PUPDR &= ~(0x3 << (i * 2));     // No pull-up/down
    }

    TIM2->PSC = 7;  // 8MHz / (7+1) = 1 MHz timer Base
    TIM2->ARR = PWM_PERIOD;

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
__attribute__((used)) void TIM3_IRQHandler(void) {
// Need this  to ensure linker sees thi IRQHandler
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

    // Assumes default system clock = 8 MHz from HSI
    TIM3->PSC = 7999;   // 8MHz / (7999+1) = 1kHz (prescaler)
    TIM3->ARR = 1;     // 1kHz / 1 = 1kHz → 1ms   (Auto Reload Register)

    // Fire TIM3_IRQHandler every time Counter Overflow
    TIM3->SR = 0 ; // Clear Pending Flags (from status Register)
    (void)TIM3->SR ; // Wait to clear
    TIM3->DIER |= TIM_DIER_UIE; // Enable Update Interrupt
    NVIC_ClearPendingIRQ (TIM3_IRQn) ;
    NVIC_EnableIRQ (TIM3_IRQn);
    TIM3->CR1  |= TIM_CR1_CEN; // Start Timer
    (void)TIM3->CR1 ; // wait
}

int main(void) {
    init_TIM2_PWM();
    init_TIM3_IRQ();
    setupLED() ;

    if (!(TIM2->CR1 & TIM_CR1_CEN)) {
    // Timer not running!
        blink() ;
    }
   if ((RCC->APB1ENR & RCC_APB1ENR_TIM3EN) &&
    (TIM3->CR1 & TIM_CR1_CEN)) {
    // TIM3 is clocked and enabled
        blink() ;
    }


    while (1) {
    /*
    if (TIM3->SR & TIM_SR_UIF) {
        TIM3->SR &= ~TIM_SR_UIF;
     //   GPIOA->ODR ^= (1 << 8);  // Confirm update event is occurring
    }
*/
        __WFI();  // Sleep until interrupt
    }
}

void setupLED(void) {
    // 1. Enable GPIOA clock
    RCC->AHBENR |= RCC_AHBENR_GPIOAEN;

    // Short delay to let the clock stabilize (optional, but safe)
    volatile int delay;
    for (delay = 0; delay < 100; delay++) __NOP();

    // 2. Set PA8 to General Purpose Output mode (MODER8 = 0b01)
    GPIOA->MODER &= ~(3 << (8 * 2));    // Clear MODER8 bits
    GPIOA->MODER |=  (1 << (8 * 2));    // Set MODER8 = 0b01 (output mode)

    // 3. Set Output Type to Push-Pull (OTYPER8 = 0)
    GPIOA->OTYPER &= ~(1 << 8);         // Push-pull

    // 4. Set Output Speed to Medium or High (optional)
    GPIOA->OSPEEDR |= (1 << (8 * 2));   // Medium speed

    // 5. No pull-up, pull-down
    GPIOA->PUPDR &= ~(3 << (8 * 2));    // No pull-up/down

    // 6. Turn on the LED (set PA8 high)
    GPIOA->ODR |= (1 << 8);             // PA8 = 1 (LED ON, if active high)
}

void blink (void) {
    for (int i = 0; i < 6 ; i++)  {
        GPIOA->ODR ^= (1 << 8);  // Toggle PA8
     //   for (volatile int i = 0; i < 100000; i++);  // crude delay
    }
}

