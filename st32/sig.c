#include "stm32f3xx.h"
// This gets me an AC signal )-3.3v to 3.3v) with the use of two
// io pins that are out of phase

// Quick and dirty delay
static void delay (unsigned int time) {
    for (unsigned int i = 0; i < time; i++)
        for (volatile unsigned int j = 0; j < 2000; j++);
}

// Include the specific header for your STM32F303K8 (e.g., stm32f3xx.h)

void resetGPIOA(void) {
    RCC->AHBENR |= RCC_AHBENR_GPIOAEN;
    (void)RCC->AHBENR ;  // wait for above to completeyy
    GPIOA->MODER   = 0xA8000000; 
    GPIOA->OTYPER  = 0x00000000;
    GPIOA->OSPEEDR = 0x0C000000;  
    GPIOA->PUPDR   = 0x64000000;
    GPIOA->AFR[0]  = 0x00000000;
    GPIOA->AFR[1]  = 0x00000000;
}

void TwoPinAC () {
    resetGPIOA () ;

   // Put pin PA0,1,8 are output pins
    GPIOA->MODER  |= (0x1 << (0 * 2));   // A0 .. PA0 ... (P4 from Right)
    GPIOA->MODER  |= (0x1 << (1 * 2));   // A1 .. PA1 ... (P5 from Right)  --> LED
    GPIOA->MODER  |= (0x1 << (8 * 2));   // D9 .. PA8 ...  (P4L) 
    
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
    TwoPinAC() ;  
    // Return 0 to satisfy compiler
    while (1) ;
    return 0;
}


