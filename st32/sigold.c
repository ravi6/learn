#include "stm32f3xx.h"
// This gets me an AC signal )-3.3v to 3.3v) with the use of two
// io pins that are out of phase

// Quick and dirty delay
static void delay (unsigned int time) {
    for (unsigned int i = 0; i < time; i++)
        for (volatile unsigned int j = 0; j < 2000; j++);
}

void TwoPinAC () {
    // Turn on the GPIOA peripheral
    RCC->AHBENR |= RCC_AHBENR_GPIOAEN;
    (void)RCC->AHBENR ;  // wait for above to completeyy

    // Reset the GPIO pins I want to use
    GPIOA->AFR[0] &= ~(0xF << (0 * 4));    // Clear AFRL0 of pin_i
    GPIOA->AFR[0] &= ~(0xF << (1 * 4));    // Clear AFRL0 of pin_i
    GPIOA->OSPEEDR &= ~(0x3 << (0 * 2));    // Low Speed
    GPIOA->OSPEEDR &= ~(0x3 << (1 * 2));    // Low Speed
    GPIOA->OSPEEDR &= ~(0x3 << (8 * 2));    // Low Speed
        GPIOA->MODER &= ~GPIO_MODER_MODER0 ; 
        GPIOA->MODER &= ~GPIO_MODER_MODER1 ; 
        GPIOA->MODER &= ~GPIO_MODER_MODER8 ; 

   // Put pin PA0 and PA1 in general purpose mode ( ms=0 ls=1 )
    GPIOA->MODER  |= GPIO_MODER_MODER0_0;   // A0 .. PA0 ... (P4 from Right)
    GPIOA->MODER  |= GPIO_MODER_MODER1_0;   // A1 .. PA1 ... (P5 from Right)  --> LED
    GPIOA->MODER  |= GPIO_MODER_MODER8_0;   // D9 .. PA8 ...  (P4L) 
    
    (void)RCC->AHBENR ;  // wait for above to completeyy
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
} // end TwoPin AC


int main (void) {
    while (1) ;
    TwoPinAC() ;  
    // Return 0 to satisfy compiler
    return 0;
}
