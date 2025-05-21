#include "stm32f3xx.h"

void init_PA8_output(void) {
    RCC->AHBENR |= RCC_AHBENR_GPIOAEN;
    GPIOA->MODER &= ~(3 << (8 * 2));
    GPIOA->MODER |=  (1 << (8 * 2));     // PA8 = output
}

void init_TIM3_test(void) {
    // 1. Enable TIM3 clock
    RCC->APB1ENR |= RCC_APB1ENR_TIM3EN;
    (void)RCC->APB1ENR;  // Read-after-write to settle

    // 2. Make sure TIM3 is OFF before configuring
    TIM3->CR1 = 0;

    // 3. Set up prescaler and ARR
    TIM3->PSC = 7199;     // 72 MHz / (7199 + 1) = 10 kHz
    TIM3->ARR = 1000;     // 1 Hz (1s overflow)

    // 4. Force ARR/PSC load
    TIM3->EGR = TIM_EGR_UG;

    // 5. Clear status register
    TIM3->SR = 0;

    // 6. Enable TIM3
    TIM3->CR1 |= TIM_CR1_CEN;
}

int main(void) {
    init_PA8_output();
    init_TIM3_test();

    uint32_t last_cnt = 0;
    while (1) {
        if (TIM3->CNT != last_cnt) {
            last_cnt = TIM3->CNT;
            GPIOA->ODR ^= (1 << 8);  // Fast toggle
            for (volatile int d = 0; d < 10000; d++);  // Crude debounce
        }
    }
}

