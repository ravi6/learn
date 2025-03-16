#define __CM4_REV                 0x0001U  /*!< Core revision r0p1                            */
#define __MPU_PRESENT             0U       /*!< STM32F303x8 devices do not provide an MPU */
#define __NVIC_PRIO_BITS          4U       /*!< STM32F303x8 devices use 4 Bits for the Priority Levels */
#define __Vendor_SysTickConfig    0U       /*!< Set to 1 if different SysTick Config is used */
#define __FPU_PRESENT             1U       /*!< STM32F303x8 devices provide an FPU */

typedef enum
{
/******  Cortex-M4 Processor Exceptions Numbers ****************************************************************/
  NonMaskableInt_IRQn         = -14,    /*!< 2 Non Maskable Interrupt                                          */
  HardFault_IRQn              = -13,    /*!< 3 Cortex-M4 Hard Fault Interrupt                                  */
  MemoryManagement_IRQn       = -12,    /*!< 4 Cortex-M4 Memory Management Interrupt                           */
  BusFault_IRQn               = -11,    /*!< 5 Cortex-M4 Bus Fault Interrupt                                   */
  UsageFault_IRQn             = -10,    /*!< 6 Cortex-M4 Usage Fault Interrupt                                 */
  SVCall_IRQn                 = -5,     /*!< 11 Cortex-M4 SV Call Interrupt                                    */
  DebugMonitor_IRQn           = -4,     /*!< 12 Cortex-M4 Debug Monitor Interrupt                              */
  PendSV_IRQn                 = -2,     /*!< 14 Cortex-M4 Pend SV Interrupt                                    */
  SysTick_IRQn                = -1,     /*!< 15 Cortex-M4 System Tick Interrupt                                */
/******  STM32 specific Interrupt Numbers **********************************************************************/
  WWDG_IRQn                   = 0,      /*!< Window WatchDog Interrupt                                         */
  PVD_IRQn                    = 1,      /*!< PVD through EXTI Line detection Interrupt                         */
  TAMP_STAMP_IRQn             = 2,      /*!< Tamper and TimeStamp interrupts through the EXTI line 19          */
  RTC_WKUP_IRQn               = 3,      /*!< RTC Wakeup interrupt through the EXTI line 20                     */
  FLASH_IRQn                  = 4,      /*!< FLASH global Interrupt                                            */
  RCC_IRQn                    = 5,      /*!< RCC global Interrupt                                              */
  EXTI0_IRQn                  = 6,      /*!< EXTI Line0 Interrupt                                              */
  EXTI1_IRQn                  = 7,      /*!< EXTI Line1 Interrupt                                              */
  EXTI2_TSC_IRQn              = 8,      /*!< EXTI Line2 Interrupt and Touch Sense Controller Interrupt         */
  EXTI3_IRQn                  = 9,      /*!< EXTI Line3 Interrupt                                              */
  EXTI4_IRQn                  = 10,     /*!< EXTI Line4 Interrupt                                              */
  DMA1_Channel1_IRQn          = 11,     /*!< DMA1 Channel 1 Interrupt                                          */
  DMA1_Channel2_IRQn          = 12,     /*!< DMA1 Channel 2 Interrupt                                          */
  DMA1_Channel3_IRQn          = 13,     /*!< DMA1 Channel 3 Interrupt                                          */
  DMA1_Channel4_IRQn          = 14,     /*!< DMA1 Channel 4 Interrupt                                          */
  DMA1_Channel5_IRQn          = 15,     /*!< DMA1 Channel 5 Interrupt                                          */
  DMA1_Channel6_IRQn          = 16,     /*!< DMA1 Channel 6 Interrupt                                          */
  DMA1_Channel7_IRQn          = 17,     /*!< DMA1 Channel 7 Interrupt                                          */
  ADC1_2_IRQn                 = 18,     /*!< ADC1 & ADC2 Interrupts                                            */
  CAN_TX_IRQn                 = 19,     /*!< CAN TX Interrupt                                                  */
  CAN_RX0_IRQn                = 20,     /*!< CAN RX0 Interrupt                                                 */
  CAN_RX1_IRQn                = 21,     /*!< CAN RX1 Interrupt                                                 */
  CAN_SCE_IRQn                = 22,     /*!< CAN SCE Interrupt                                                 */
  EXTI9_5_IRQn                = 23,     /*!< External Line[9:5] Interrupts                                     */
  TIM1_BRK_TIM15_IRQn         = 24,     /*!< TIM1 Break and TIM15 Interrupts                                   */
  TIM1_UP_TIM16_IRQn          = 25,     /*!< TIM1 Update and TIM16 Interrupts                                  */
  TIM1_TRG_COM_TIM17_IRQn     = 26,     /*!< TIM1 Trigger and Commutation and TIM17 Interrupt                  */
  TIM1_CC_IRQn                = 27,     /*!< TIM1 Capture Compare Interrupt                                    */
  TIM2_IRQn                   = 28,     /*!< TIM2 global Interrupt                                             */
  TIM3_IRQn                   = 29,     /*!< TIM3 global Interrupt                                             */
  I2C1_EV_IRQn                = 31,     /*!< I2C1 Event Interrupt & EXTI Line23 Interrupt (I2C1 wakeup)        */
  I2C1_ER_IRQn                = 32,     /*!< I2C1 Error Interrupt                                              */
  SPI1_IRQn                   = 35,     /*!< SPI1 global Interrupt                                             */
  USART1_IRQn                 = 37,     /*!< USART1 global Interrupt & EXTI Line25 Interrupt (USART1 wakeup)   */
  USART2_IRQn                 = 38,     /*!< USART2 global Interrupt & EXTI Line26 Interrupt (USART2 wakeup)   */
  USART3_IRQn                 = 39,     /*!< USART3 global Interrupt & EXTI Line28 Interrupt (USART3 wakeup)   */
  EXTI15_10_IRQn              = 40,     /*!< External Line[15:10] Interrupts                                   */
  RTC_Alarm_IRQn              = 41,     /*!< RTC Alarm (A and B) through EXTI Line 17 Interrupt                 */
  TIM6_DAC1_IRQn              = 54,     /*!< TIM6 global and DAC1 underrun error Interrupts*/
  TIM7_DAC2_IRQn              = 55,     /*!< TIM7 global and DAC2 channel1 underrun error Interrupt            */
  COMP2_IRQn                  = 64,     /*!< COMP2 global Interrupt via EXTI Line22                            */
  COMP4_6_IRQn                = 65,     /*!< COMP4 and COMP6 global Interrupt via EXTI Line30 and 32           */
  FPU_IRQn                    = 81,      /*!< Floating point Interrupt                                          */
} IRQn_Type;

#include <stdio.h>
#include "core_cm4.h"            /* Cortex-M4 processor and core peripherals */
#include "system_stm32f3xx.h"    /* STM32F3xx System Header */
#include <stdint.h>

#define SET(reg, n) ((reg) |=  (1<<(n)))
#define CLR(reg, n) ((reg) &= ~(1<<(n)))
#define CLRSET(reg, cmask, smask) ( (reg) = ((reg) & ~(cmask)) | (smask) ) 
#define FLIP(reg, n) ((reg) ^=  (1<<(n)))
#define ISSET(reg, n) ( ((reg) &  (1<<(n))) != 0 )

typedef struct 
{
  volatile uint32_t CR, CFGR, CIR, APB2RSTR,  APB1RSTR,
   AHBENR, APB2ENR, APB1ENR, BDCR, CSR, AHBRSTR, CFGR2 ;
} RCC_Type ;

typedef struct  
{
  volatile uint32_t MODER, OTYPER, OSPEEDR, PUPDR, IDR, ODR, BSRR, LCKR, AFRL, AFRH;
} GPIO_Type ;

typedef struct 
{
  volatile uint32_t CR1, CR2, SR, DR, CRCPR, RXCRCR, TXCRCR ;
} SPI_Type ;

#define RCC   ((RCC_Type *) 0x40021000)
#define GPIOA ((GPIO_Type *) 0x48000000)
#define GPIOB ((GPIO_Type *) 0x48000400)
#define SPI   ((SPI_Type *) 0x40013000)

enum {IN, OUT, AF, AI} ; // GPIO MODER modes
enum {CLKA=17, CLKB, CLKC, CLKD} ; // GPIO clocks

// GPIO Pins
enum {P0, P1, P2, P3, P4, P5, P6, P7, 
      P8, P9, P10, P11, P12, P13, P14, P15} ;

// SPI Control Register (CR1) flags
enum {CPHA, CPOL, MSTR, BR, BR1, BR2, SPE, LSBFIRST, 
      SSI, SSM, RXONLY, CRCL, CRCNEXT, CRCEN, BIDIOE, BIDIMODE} ;

// SPI Control Register (CR2) flags
enum {RXDMAEN, TXDMAEN, SSOE, NSSP, FRF, ERRIE, RXNEIE, 
      TXEIE, DS, DS1, DS2, DS3, FRXTH, LDMARX, LDMATX}  ;

// SPI status Register
enum {RXNE, TXE, CHSIDE, UDR, CRCERR, MODF, OVR, BSY, 
      FRE, FRLVL1, FRLVL0, FTLVL1, FTLVL0} ;

// Alternate Functions for GPIO
enum {AF0, AF1, AF2, AF3, AF4, AF5, AF6, AF7,
      AF8, AF9, AF10, AF11, AF12, AF13, AF14, AF15} ;

// SPI related macros
#define TX_EMPTY   (ISSET(SPI->SR, TXE)) 
#define RX_EMPTY   (!( ISSET(SPI->SR, RXNE) ))
#define SPI_BUSY   (ISSET(SPI->SR, BSY))
#define SPI_ENABLE   (SET(SPI->CR1, SPE))   
#define SPI_DISABLE  (CLR(SPI->CR1, SPE))   
#define SPI_STATE    (ISSET(SPI->CR1, SPE))
#define SPI_RESET    (CLR(RCC->APB2RSTR, 12))    
#define SPI_CLKON    (SET(RCC->APB2ENR, 12))   
#define SPI_CLKOFF   (CLR(RCC->APB2ENR, 12))   
#define SPI_CLKSTATE (ISSET(RCC->APB2ENR, 12))
#define HSI_READY    (ISSET(RCC->CR, 1))

// GPIOA seup macros
#define PINA_LOW(n)  (SET(GPIOA->BSRR, (n) + 16))  
#define PINA_HIGH(n)   (SET(GPIOA->BSRR, (n) ))  
#define GPIOA_CLKON   (SET(RCC->AHBENR,  (CLKA)))   
#define GPIOA_CLKOFF  (CLR(RCC->AHBENR,  (CLKA)))   
#define GPIOA_CLKSTATE (ISSET(RCC->AHBENR, (CLKA)))
#define PINA_TYPE(n, mode) (CLRSET(GPIOA->MODER, 3 << 2*(n), (mode) << 2*(n)))  
// Assign Alternate Functions to GPIOA pins (0 to 7 only)
#define ALT_FUNA(p, a)  (CLRSET(GPIOA->AFRL, 0xF << 4*(p), (a) << 4*(p)))  
