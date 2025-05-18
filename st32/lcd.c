#include "stm32f3xx.h"
#define PWM_PERIOD   999  // 1 kHz PWM base
#define NUM_PHASES   4

// Duty cycles for 0%, 33%, 66%, 100% scaled to PWM_PERIOD
const uint16_t pwmDuty[4] = {0, 333, 666, 999};

// Each row = phase; each column = COMx duty
const uint16_t comsTable[NUM_PHASES][4] = {
    { pwmDuty[0], pwmDuty[1], pwmDuty[2], pwmDuty[3] },
    { pwmDuty[3], pwmDuty[0], pwmDuty[1], pwmDuty[2] },
    { pwmDuty[2], pwmDuty[3], pwmDuty[0], pwmDuty[1] },
    { pwmDuty[1], pwmDuty[2], pwmDuty[3], pwmDuty[0] }
};

volatile uint8_t phase = 0;
void init_TIM2_PWM(void) {
    RCC->AHBENR  |= RCC_AHBENR_GPIOAEN;
    RCC->APB1ENR |= RCC_APB1ENR_TIM2EN;

    // PA0–PA3 → TIM2 CH1–CH4 (AF1)
    
    GPIOA->MODER   |= (2 << 0) | (2 << 2) | (2 << 4) | (2 << 6);  // AF mode
    GPIOA->AFR[0] = 0 ;
    GPIOA->AFR[0]  |= 0x1111; // AF1 for TIM2_CH1–4

    TIM2->PSC = 71;  // 72MHz / (71+1) = 1 MHz
    TIM2->ARR = PWM_PERIOD;

    TIM2->CCMR1 = (6 << 4) | (1 << 3) |  // CH1 PWM mode 1 + preload
                  (6 << 12) | (1 << 11); // CH2 PWM mode 1 + preload
    TIM2->CCMR2 = (6 << 4) | (1 << 3) |  // CH3 PWM mode 1 + preload
                  (6 << 12) | (1 << 11); // CH4 PWM mode 1 + preload

    TIM2->CCER |= TIM_CCER_CC1E | TIM_CCER_CC2E | TIM_CCER_CC3E | TIM_CCER_CC4E;
    TIM2->CR1  |= TIM_CR1_ARPE;
    TIM2->EGR   = TIM_EGR_UG;
    TIM2->CR1  |= TIM_CR1_CEN;
}
void init_TIM3_IRQ(void) {
    RCC->APB1ENR |= RCC_APB1ENR_TIM3EN;

    TIM3->PSC = 7199;   // 72MHz / (7199+1) = 10kHz
    TIM3->ARR = 10;     // 10kHz / 10 = 1kHz → 1ms

    TIM3->DIER |= TIM_DIER_UIE;
    TIM3->CR1  |= TIM_CR1_CEN;
    NVIC_EnableIRQ(TIM3_IRQn);
}
void TIM3_IRQHandler(void) {
    if (TIM3->SR & TIM_SR_UIF) {
        TIM3->SR &= ~TIM_SR_UIF;

        TIM2->CCR1 = comsTable[phase][0]; // COM0
        TIM2->CCR2 = comsTable[phase][1]; // COM1
        TIM2->CCR3 = comsTable[phase][2]; // COM2
        TIM2->CCR4 = comsTable[phase][3]; // COM3

        phase = (phase + 1) % NUM_PHASES;
    }
}

int main(void) {
    init_TIM2_PWM();
    init_TIM3_IRQ();

    while (1) {
        __WFI();  // Sleep until interrupt
    }
}

