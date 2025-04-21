// Author: Ravi Saripalli
// 10th Sep. 2024

#include "mystm32.h"
#include "gpio.h"
#include "spi.h"
#include <string.h>

void delay (unsigned int time) {
  // Time in MilliSeconds (Caliberated on STM32F303X8B)
    for (unsigned int i = 0; i < time; i++)
        for (volatile unsigned int j = 0; j < 575 ; j++);
}

void SPI_Setup () {
  // Setup GPIOA and SPI interface 
  // For Simplex comms .... Master to Slave comms only
  // APB2 Hight Speed Clock Prescale ( HSI is 8MHz , and I devide it by 8)
  //   SPI1 appears to be on this bus  and I want it run slower 
  // See documentation page 130 & 272

  //    Default HSI is 8MHz ... check
//    while ( ! HSI_READY  ) {}  // wait for High Speed Internal Clock ready (HSI)
//    CLRSET(RCC->CFGR, 0b111 << 11, 0b111 << 11) ; // division by 16

    GPIOA_CLKON ;
    /*  Assign Alternate function AF5 the all these SPI1 pins */
    ALT_FUNA(SCLK, AF5) ;    // PA5  (*A4)
    ALT_FUNA(MISO, AF5) ;    // PA6  (*A5)
    ALT_FUNA(MOSI, AF5) ;    // PA7  (*A6)
    // High Speed
    CLRSET(GPIOA->OSPEEDR, 0b11 << SCLK, 0b11) ;  
    CLRSET(GPIOA->OSPEEDR, 0b11 << MISO, 0b11) ;  
    CLRSET(GPIOA->OSPEEDR, 0b11 << MOSI, 0b11) ;  
   // No Pull
    CLRSET(GPIOA->PUPDR, 0b11 << SCLK, 0b00) ;
    CLRSET(GPIOA->PUPDR, 0b11 << MISO, 0b00) ;
    CLRSET(GPIOA->PUPDR, 0b11 << MOSI, 0b00) ;
  
  // Set Alternate mode (for SPI interface )
  // Note Alternate Function for all three pins is AF5
  // While there no table exists that sats AF5 is for
  // SPI1 .. web trawl seems to suggest this
  // Anyway how does it know which pin is MISO , MOSI, & SCLK
  // Is it always in the order of MISO, MOSI, SCLK ??
  // * symbols correspond to markings on the PCB

    SPI_CLKON   ;
  //  SPI_RESET  ;
    SPI_DISABLE ;
    PINA_TYPE(SCLK, AF)  ; // PA5 -- SCLK Send to OLED pin (*A4) 
    PINA_TYPE(MISO, AF)  ; // PA6 -- MISO From OLED (*A5)
    PINA_TYPE(MOSI, AF)  ; // PA7 -- MOSI to OLED  (*A6)
    PINA_TYPE(LED, OUT)  ; // PA8 -- (LED Indicator ... may change later)

    CLR(SPI->CR1, CPOL)  ;  // Clock Low
    CLR(SPI->CR1, CPHA)  ;  // Sample On Clock Rise
    SET(SPI->CR1, MSTR)  ;  // Set Me as as the Master
    SET(SPI->CR1, SSM)   ;  // Software Slave Mangement Enabled
    SET(SPI->CR1, SSI)   ;  // Internal Slect Slave on
    CLR(SPI->CR1, LSBFIRST) ;  // MSB first then LSB
    CLR(SPI->CR1, RXONLY)  ;  // Full Duplex Mode 
    SET(SPI->CR1, BIDIOE)  ;  // Output Enabled (Trasmit Only)
    CLR(SPI->CR1, BIDIMODE)  ;  // Two Line Bidirectional
    //
    //fsck = 8MHz
    //CLRSET(SPI->CR1, 0b111 << BR,  x << BR); // Set Baudrate (fsck/ 2^(x+1)))
    CLRSET(SPI->CR1, 0b111 << BR,  2  << BR); 

    CLRSET(SPI->CR2, 0b1111 << DS, 0b0111 << DS) ;  // 8bit Data Size for transfer
    SET(SPI->CR2, FRXTH) ;  // FIFO threshold 16bits for RXNE event

    SPI_ENABLE ;

} // end SPI Setup



void SPI_Tx (uint8_t *data, int size) { // Transmit Data

  for (int i=0 ; i < size ; i++) { 

     while ( !(TX_EMPTY) ) { } ; // wait for TX buffer to be empty
     // This casting might seem strange ... but is required (thx. to ChatGPT)
     // Got rid of the extra clocks that could appear beacuse that register write
     // needs to be told that we are using 8bit data
     *((volatile uint8_t*)&SPI->DR) = data [i];  // write to the Data Register
     while ( SPI_BUSY ) { } ; // wait for SPI to be ready

     // Clear the Overrun flag by reading DR and SR
     volatile uint8_t temp = SPI->DR ;  // read DR to clear RXNE
     (void) temp ;
  }
} // end SPI Transmit

void SPI_Rx (uint8_t *data, int size) { //Receive Data
  while (size) {
      while ( SPI_BUSY ) { } ; // wait for SPI to be ready
      SPI->DR = 0;  // send dummy data
      while ( RX_EMPTY ) { } ; // wait data in RX buffer
      *data ++ = SPI->DR ;
      size -- ;
    }
} // end SPI_Rx

void blinkLED (int n, int ms) { 
    for (int i=0 ; i < n ; i++) {
        PINA_LOW(LED)  ; delay (ms) ;
	PINA_HIGH(LED) ; delay (ms) ;
    }
} // end Blink
