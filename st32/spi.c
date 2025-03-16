// Author: Ravi Saripalli
// 10th Sep. 2024

#include "mystm32.h"
#include <string.h>

// PIN names for use here
enum {MOSI=5, MISO, SCLK, LED} ;

static void delay (unsigned int time) {
    for (unsigned int i = 0; i < time; i++)
        for (volatile unsigned int j = 0; j < 2000; j++);
}

void SPI_setup () {
  // Setup GPIOA and SPI interface 
  // For Simplex comms .... Master to Slave comms only
  // APB2 Hight Speed Clock Prescale ( HSI is 8MHz , and I devide it by 8)
  //   SPI1 appears to be on this bus  and I want it run slower 
  // See documentation page 130 & 272

    while ( ! HSI_READY  ) {}  // wait for High Speed Internal Clock ready (HSI)
    CLRSET(RCC->CFGR, 0b111 << 11, 0b110 << 11) ; // division by 8


    GPIOA_CLKON ;
    ALT_FUNA(MOSI, AF5) ;    // PA5
    ALT_FUNA(MISO, AF5) ;    // PA6
    ALT_FUNA(SCLK, AF5) ;    // PA7

					   
  // Set Alternate mode (for SPI interface )
  // Note Alternate Function for all three pins is AF5
  // While there no table exists that sats AF5 is for
  // SPI1 .. web trawl seems to suggest this
  // Anyway how does it know which pin is MISO , MOSI, & SCLK
  // Is it always in the order of MISO, MOSI, SCLK
  // * symbols correspond to markings on the PCB

    SPI_CLKON   ;
    PINA_TYPE(MOSI, AF)  ; // PA5 -- MOSI to OLED  (*A5)
    PINA_TYPE(MISO, AF)  ; // PA6 -- MISO From OLED (*A6)
    PINA_TYPE(SCLK, AF)  ; // PA7 -- SCLK Send to OLED pin (*A7) 

    CLR(SPI->CR1, CPHA)  ;  // Clock Phase (0) First Clock transition
    CLR(SPI->CR1, CPOL)  ;  // Clock polarity to zero  (clock idle when 0)
    SET(SPI->CR1, MSTR)  ;  // Set Me as as the Master
    SET(SPI->CR1, SSM)   ;  // Software Slave Mangement Enabled
    SET(SPI->CR1, SSI)   ;  // Internal Slect Slave on
    SET(SPI->CR1, LSBFIRST) ;  // LSB first then MSB
    CLR(SPI->CR1, RXONLY)  ;  // Full Duplex Mode 
    SET(SPI->CR1, BIDIOE)  ;  // Output Enabled (Trasmit Only)
    CLR(SPI->CR1, BIDIMODE)  ;  // Two Line Bidirectional
    CLRSET(SPI->CR1, 0b111 << BR,  0b111 << BR); // Set Baudrate (fsck/256)
    CLRSET(SPI->CR2, 0b1111 << DS, 0b0111 << DS) ;  // 8bit Data Size for transfer
    SET(SPI->CR2, FRXTH) ;  // FIFO threshold 16bits for RXNE event

    SPI_ENABLE ;
//  SPI_RESET  ;

} // end SPI Setup

void SPI_Tx (uint8_t *data, int size) { // Transmit Data
  int i = 0;
  while (i < size) {// wait for TX buffer to be empty
     while ( !(TX_EMPTY) ) { };  
     SPI->DR = data [i];  // write to the Data Register
     i++;
  }

  /* In discont. comms., there is a 2 APB clock 
   * period delay between the writes to data 
   * register and BSY bit setting. 
   * So wait until Tx buffer is empty and SPI not busy */

  while ( !(TX_EMPTY) ) { } ; // wait for TX buffer to be empty
  while ( SPI_BUSY ) { } ; // wait for SPI to be ready
  // Clear the Overrun flag by reading DR and SR
  uint8_t temp = SPI->DR ;  
  temp = SPI->SR ;
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

void blink (int n, int rate) { // Blink PA8 
    for (int i=0 ; i < n ; i++) {
        PINA_LOW(LED)  ; delay (500/rate) ;
	PINA_HIGH(LED) ; delay (500/rate) ;
    }
} // end Blink

int main (void) {
   char* data ;  
   int dummy ;

     PINA_TYPE(LED, OUT)  ; // PA8 -- (LED Indicator ... may change later)
     dummy = 0 ;
     SPI_setup () ;
     dummy = 1  ;
     blink (6, 5) ;

while (1) {
	  
     // Send Some Data 

       data = "ABCD " ;
       for (int i = 0 ; i < 10 ; i++) 
	   SPI_Tx ((uint8_t*) (data), strlen (data));
   } // infinite loop

   return (1) ;
} // end main
//  from top (usbend) rght
//  board pin (bpin)
//  bpin6---> MOSI --> PA7
//  binp7---> MISO --> PA6
//  bpin8---> SCLK --> PA5
//  bpin9---> SSE --> PA4
//
// Board Marker   GPIO CODE 
//   D9            PA8
