#include "stdio.h"
#include "stdint.h"
#include "oled.h"
#include "gpio.h"

void drawChar (char c, uint8_t x, uint8_t y) {
 // note: chars with codes from 32 to 127 are valid 

  color pix [fontA.w * fontA.h] ; // pixels in each char
  color cFG = oled_rgb (0, 0, 0) ;
  color cBG = oled_rgb (31, 63, 31) ;
   
  // We draw pixels row wise of the char
  uint8_t idx = (uint8_t) c - ' ' ;   // fonts offset removed
  uint8_t k = 0 ;
  for (uint8_t row = 0 ; row < fontA.h ; row ++) {
    for (uint8_t col = 0 ; col < fontA.w ; col ++) {
       if (ISSET (fontA.glyph [idx + col], row)) pix [k] = cFG ;
       else pix [k] = cBG ;
    }
      
  }   

  // Now draw the Character
  oled_setRange (SET_ROW_RANGE, x, x+7) ; // 8 high
  oled_setRange (SET_COL_RANGE, y, y+5) ; // 6 wide
  oled_sendCMD (RAM_WRITE_ENABLE) ;

  PINA_HIGH (DC) ;       // Send below data bytes
  PINA_LOW (CS) ;
  for (int i = 0 ; i < fontA.w * fontA.h  ; i++) { 
       color color = pix[i] ;
       SPI_Tx (&color.msb , 1)  ;  // MSB of color
       SPI_Tx (&color.lsb, 1) ; // LSB of color
   }
  PINA_HIGH (CS) ;
} // end drawChar 

