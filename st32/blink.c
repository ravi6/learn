#include "stm32f3xx.h"

// Quick and dirty delay
static void delay (unsigned int time) {
    for (unsigned int i = 0; i < time; i++)
        for (volatile unsigned int j = 0; j < 2000; j++);
}

int main (void) {
    // Turn on the GPIOA peripheral
    RCC->AHBENR |= RCC_AHBENR_GPIOAEN;
 //   RCC->AHBENR |= RCC_AHBENR_GPIOBEN;

    // Put pin 8 in general purpose mode ( ms=0 ls=1 )
    GPIOA->MODER  |= GPIO_MODER_MODER8_0;
  //  GPIOB->PUPDR |=  GPIO_PUPDR_PUPDR3_0;
  //  GPIOB->MODER  |= GPIO_MODER_MODER3_0;



    while (1) {
        for (int i=0 ; i < 2 ; i++) {
	  GPIOA->BSRR = GPIO_BSRR_BR_8; // PA8 pin off
//	  GPIOB->BSRR = GPIO_BSRR_BR_3; // PA8 pin off
//#define GPIO_BSRR_BS_8                   (0x00000100U)                         
//#define GPIO_BSRR_BR_8                   (0x01000000U)                         
	  delay(100);
	  GPIOA->BSRR = GPIO_BSRR_BS_8; // on
//	  GPIOB->BSRR = GPIO_BSRR_BS_3; // on
	  delay(100);
	}
	delay (300) ;
    }

    // Return 0 to satisfy compiler
    return 0;
}
