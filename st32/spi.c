#include "mystm32.h"
#include <string.h>

// PIN names for use here
enum {SCLK=5, MISO, MOSI, LED} ;

static void preScale () { 
  // Clock Scaling 

  // HCLK prescaler AHB block  (sf = /512) 
  // Looks like you cant douch this unless you change 
  // FLASH prefetch buffer flag in FLASH_ACR register
  //
  // CLRSET(RCC->CFGR, 0b1111 << 4 , 0b1111 << 4) ;
  // APB1 Low Speed Clock Prescaler (PCLK) sf = /16
  // CLRSET(RCC->CFGR, 0b111 << 8, 16 >> 1) ;

  // Looks like I can set  with no issues
  // APB2 Hight Speed Clock Prescaler (PCLK) sf = /16
  while ( ! HSI_READY  ) {}  // wait for High Speed Internal Clock ready (HSI)
  CLRSET(RCC->CFGR, 0b111 << 11, 16 >> 1) ;
}

static void delay (unsigned int time) {
    for (unsigned int i = 0; i < time; i++)
        for (volatile unsigned int j = 0; j < 2000; j++);
}

void SPI_setup () {
  // Setup GPIOA and SPI interface 
  // For Simplex comms .... Master to Slave comms only

  //Set the MCO clok source .. without it we wont have clock signal
 //on CLK pin.  (LSI 40kHz as the source for MCO) (010)
 // Choosing System Clock (100)
  // This not working .... CFGR register does not change
 //    SET(RCC->CFGR, 26) ; CLR(RCC->CFGR, 25) ;  CLR(RCC->CFGR, 24) ;    
    
    preScale () ;   // slowdown everything
    SPI_RESET   ;
    GPIOA_CLKON ;
    SPI_CLKON   ;

					   
  // Set Alternate mode (for SPI interface )
    PINA_TYPE(SCLK, AF)  ; // PA5 -- SCLK Send to OLED pin (*A4) 
    ALT_FUNA(P5, AF4) ;
    PINA_TYPE(MISO, AF)  ; // PA6 -- MISO From OLED (*A5)
    ALT_FUNA(P6, AF5) ;
    PINA_TYPE(MOSI, AF)  ; // PA7 -- MOSI to OLED  (*A6)
    ALT_FUNA(P7, AF6) ; 

    PINA_TYPE(LED, OUT)  ; // PA8 -- (LED Indicator ... may change later)

    CLR(SPI->CR1, CPHA)  ;  // Clock Phase (0) First Clock transition
    CLR(SPI->CR1, CPOL)  ;  // Clock polarity to zero  (clock idle when 0)
    SET(SPI->CR1, MSTR)  ;  // Set Me as as the Master
    SET(SPI->CR1, LSBFIRST) ;  // LSB first then MSB
    CLR(SPI->CR1, RXONLY)  ;  // Duplex (Transmit & Rec)
    SET(SPI->CR1, BIDIOE)  ;  // Output Enabled (Trasmit Only)
    SET(SPI->CR1, BIDIMODE)  ;  // One Line Bidirectional
    CLRSET(SPI->CR1, 0b111 << BR,  0b111); // Set Baudrate (fsck/256)

    CLRSET(SPI->CR2, 16 << DS, 8) ;  // 8bit Data Size for transfer
    SET(SPI->CR2, 12) ;  // FIFO threshold 16bits for RXNE event

}

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

   while (1) {

     dummy = 0 ;
     SPI_setup () ;
     SPI_ENABLE  ;  // Peripheral Enabled (what does it mean)

     dummy = 1 ;	

     blink (6, 5) ;
	  
     // Send Some Data 

//while (1) {
//       data = "ABCD " ;
//       for (int i = 0 ; i < 10 ; i++) 
//	   SPI_Tx ((uint8_t*) (data), strlen (data));
//     }

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
