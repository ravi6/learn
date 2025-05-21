#include "stm32f3xx.h"
#define PWM_PERIOD   999  // 1 kHz PWM base
#define NUM_PHASES   4
volatile uint8_t phase = 0;

// Duty cycles for 0%, 33%, 66%, 100% scaled to PWM_PERIOD
const uint16_t pwmDuty[4] = {0, 333, 666, 999};

// Each row = phase; each column = COMx duty
const uint16_t comsTable[NUM_PHASES][4] = {
    { pwmDuty[0], pwmDuty[1], pwmDuty[2], pwmDuty[3] },
    { pwmDuty[3], pwmDuty[0], pwmDuty[1], pwmDuty[2] },
    { pwmDuty[2], pwmDuty[3], pwmDuty[0], pwmDuty[1] },
    { pwmDuty[1], pwmDuty[2], pwmDuty[3], pwmDuty[0] }
};

void setupLED(void) ;
void blink (void) ;
void init_TIM2_PWM(void) ;
__attribute__((used)) void TIM3_IRQHandler(void) ;
void init_TIM3_IRQ(void) ;
