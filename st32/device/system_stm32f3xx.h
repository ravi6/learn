#ifndef __SYSTEM_STM32F3XX_H
#define __SYSTEM_STM32F3XX_H

extern uint32_t SystemCoreClock;          /*!< System Clock Frequency (Core Clock) */
extern const uint8_t AHBPrescTable[16];   /*!< AHB prescalers table values */
extern const uint8_t APBPrescTable[8];    /*!< APB prescalers table values */
extern void SystemInit(void);
extern void SystemCoreClockUpdate(void);

#endif 
