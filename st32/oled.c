// Author: Ravi Saripalli
// 24th March 2025
/*
 *   SSD1331 oled display (128x128) color
 *   Display form FreeTronics
 *
*/

#include "oled.h"

void oled_sendCMD (uint8_t cmd) { /* Good for single byte CMD */
    PINA_LOW (CS) ;    // Chip Select
    SPI_Tx (&cmd, 1) ;
}

void oled_setRange (uint8_t cmd, uint8_t start, uint8_t end) {
    uint8_t data [2] = {start, end} ;

    PINA_LOW (CS) ;
    SPI_Tx (&cmd, 1) ;

    PINA_HIGH (CS) ;
    SPI_Tx (&data[0] , sizeof (data)) ;
}

void oled_Hscroll (uint8_t cmd) {
    PINA_LOW (CS) ;
    SPI_Tx (&cmd, 1) ;
}

void oled_Hscroll_Conf () {
    struct HScroll  hs ;
    hs.offset = 0 ;
    hs.stRow = 0  ;
    hs.rows = 2 ;
    hs.reset = 1  ; // set to zero to reset 
    hs.speed = NORMAL ;

    uint8_t cmd = 0x96 ;   // Horizontal Scroll Setup
    PINA_LOW (CS) ;
    SPI_Tx (&cmd, 1) ;
    PINA_HIGH (CS) ;
    SPI_Tx ((uint8_t *) (&hs) , sizeof (hs)) ;
}

void oled_Address_Inc (uint8_t dir) {
    uint8_t cmd = 0xA0   ; 
    uint8_t data = dir ;

    PINA_LOW (CS) ;
    SPI_Tx (&cmd, 1) ;

    PINA_HIGH (CS) ;
    SPI_Tx (&data , sizeof (data)) ;
}


void oled_init () {
   static uint8_t data [4] = { \
            DISP_ALLOFF,     /* Black Screen */
            DISP_ON,         /* White Screen */
	    DISP_OFF,         /* Show contents of GDDRAM */
	    SLEEP_OFF
   }; 

   SPI_Setup () ;
   PINA_TYPE(CS, OUT)   ; //  Chip Select to OLED
   PINA_LOW (CS) ;  
   SPI_Tx (&data[0], sizeof (data));
}
