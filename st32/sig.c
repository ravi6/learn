#include "stm32f3xx.h"

// Quick and dirty delay
static void delay (unsigned int time) {
    for (unsigned int i = 0; i < time; i++)
        for (volatile unsigned int j = 0; j < 2000; j++);
}

int main (void) {
    // Turn on the GPIOA peripheral
    RCC->AHBENR |= RCC_AHBENR_GPIOAEN;

   // Put pin PA0 and PA1 in general purpose mode ( ms=0 ls=1 )
    GPIOA->MODER  |= GPIO_MODER_MODER0_0;   // A0 .. PA0 ... (P4)
    GPIOA->MODER  |= GPIO_MODER_MODER1_0;   // A1 .. PA1 ... (P5)  --> LED
    GPIOA->MODER  |= GPIO_MODER_MODER8_0;   // D9 .. PA8 ...  (P4L) 
    // Generate squarewaves that differ in phase 
       while(1) {
	  GPIOA->BSRR = GPIO_BSRR_BR_0; // PA0 pin off
	  GPIOA->BSRR = GPIO_BSRR_BS_1; // PA1 pin on
	  GPIOA->BSRR = GPIO_BSRR_BS_8; // PA8 pin on
	  delay(30);
	  // toggle pins 3,8
	  GPIOA->BSRR = GPIO_BSRR_BS_0; // PA0 pin on
	  GPIOA->BSRR = GPIO_BSRR_BR_1; // PA1 pin off
	  GPIOA->BSRR = GPIO_BSRR_BR_8; // PA8 pin off
	  delay(30);
	}

    // Return 0 to satisfy compiler
    return 0;
}
