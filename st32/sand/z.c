#include "stm32f3xx.h"

void delay(volatile uint32_t t) {
    while (t--);
}

int main(void) {
    // 1. Enable clocks for GPIOA and TIM2
    RCC->AHBENR |= RCC_AHBENR_GPIOAEN;     // GPIOA clock enable
    RCC->APB1ENR |= RCC_APB1ENR_TIM2EN;    // TIM2 clock enable

    // 2. Configure PA0 as alternate function (AF1 for TIM2_CH1)
    GPIOA->MODER &= ~(0x3 << (0 * 2));     // Clear MODER0
    GPIOA->MODER |=  (0x2 << (0 * 2));     // Set MODER0 to Alternate Function

    GPIOA->AFR[0] &= ~(0xF << (0 * 4));    // Clear AFRL0
    GPIOA->AFR[0] |=  (0x1 << (0 * 4));    // Set AFRL0 to AF1 (TIM2_CH1)

    GPIOA->OTYPER &= ~(1 << 0);            // Push-pull
    GPIOA->OSPEEDR |= (0x3 << (0 * 2));    // High speed
    GPIOA->PUPDR &= ~(0x3 << (0 * 2));     // No pull-up/down

    // 3. Configure TIM2 for PWM
    // Prescaler = 63 → TIM2 counts at 64MHz / (63+1) = 1 MHz
    TIM2->PSC = 63;

    // Auto-reload = 999 → PWM frequency = 1 MHz / 1000 = 1 kHz
    TIM2->ARR = 999;

    // Capture/Compare Register = 500 → 50% duty cycle
    TIM2->CCR1 = 500;

    // Set PWM mode 1 on CH1 (output high until counter matches CCR1, then low)
    TIM2->CCMR1 &= ~TIM_CCMR1_OC1M;
    TIM2->CCMR1 |= (6 << TIM_CCMR1_OC1M_Pos);  // OC1M = 110 (PWM mode 1)
    TIM2->CCMR1 |= TIM_CCMR1_OC1PE;            // Output preload enable

    // Enable output on channel 1
    TIM2->CCER |= TIM_CCER_CC1E;

    // Enable auto-reload preload
    TIM2->CR1 |= TIM_CR1_ARPE;

    // Enable counter
    TIM2->CR1 |= TIM_CR1_CEN;
TIM2->CCR1 = desired_pulse_width; 

    while (1) {
        // Main loop does nothing — PWM is hardware driven
    }
}

