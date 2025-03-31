// Author: Ravi Saripalli
// 24th March 2025
/*
 *   SSD1331 oled display (128x128) color
 *   Display form FreeTronics
 *
*/

#include "oled.h"

// Display Memory allocation
union u_DRAM
{
      uint8_t bytes [2 * ROWS * COLS] ;
      uint16_t words [ROWS * COLS] ;
} DRAM   ;

void oled_sendCMD (uint8_t cmd) { /* Good for single byte CMD */
    PINA_LOW (DC) ;    // cmd mode
    SPI_Tx (&cmd, 1) ;
}

void oled_sendDAT (uint8_t data) {
    PINA_HIGH (DC) ;  // data mode
    SPI_Tx (&data , 1) ;
} 

void oled_setRange (uint8_t cmd, uint8_t start, uint8_t end) {
    oled_sendCMD (cmd) ;
    oled_sendDAT (start) ;
    oled_sendDAT (end) ;
}


void oled_Hscroll (uint8_t cmd) {
    oled_sendCMD (cmd) ;
}

void oled_Hscroll_Conf () {
    struct HScroll  hs ;
    hs.offset = 0 ;
    hs.stRow = 0  ;
    hs.rows = 2 ;
    hs.reset = 1  ; // set to zero to reset 
    hs.speed = NORMAL ;

    oled_sendCMD (0x96) ;  // Horizontal Scroll setup
    PINA_HIGH (DC) ;       // Send below data bytes
    SPI_Tx ((uint8_t *) (&hs) , sizeof (hs)) ;
}

void oled_init () {

   SPI_Setup () ;
   blinkLED (6, 5) ;
   PINA_TYPE(DC, OUT)   ; // Oled Data/Command (DC) control Pin
   
  // Unlock Commmands
    oled_sendCMD (0xFD) ; oled_sendDAT (0x12) ;
    oled_sendCMD (0xFD) ; oled_sendDAT (0x12) ;

    oled_sendCMD (DISP_OFF) ;  // wierdly shows GDDRAM contents 
    oled_sendCMD (SLEEP_OFF) ; // Turns on Displaying

   // Set Display Clock Div (factor 2)
   //   A complicated data struct
    oled_sendCMD (0xB3) ; oled_sendDAT (0xF1) ; 

   // Set Mux Ratio
    oled_sendCMD (0xCA) ; oled_sendDAT (127) ;

   // Display Area setup
   oled_setRange (SET_ROW_RANGE, 0, 127) ;
   oled_setRange (SET_COL_RANGE, 0, 127) ;

  // Set Start Line
    oled_sendCMD (0xA1) ; oled_sendDAT (0) ;

  // Set Display Offset
    oled_sendCMD (0xA2) ; oled_sendDAT (0) ;

 // Sets various display rersponse and contrast params

  oled_sendCMD(0xB5); // set GPIO
  oled_sendDAT(0x00);

  oled_sendCMD(0xAB); // func Select
  oled_sendDAT(0x01);

  oled_sendCMD(0xB1); // set PreCharge
  oled_sendDAT(0x32);

  oled_sendCMD(0xBE); // set VCOMH
  oled_sendDAT(0x05);

  oled_sendCMD(0xC1);  // Set Contrast
  oled_sendDAT(0x8A);  // Color A: Blue
  oled_sendDAT(0x51);  // Color B: Green
  oled_sendDAT(0x8A);  // Color C: Red

  oled_sendCMD(0xC7);  // Contrast Master
  oled_sendDAT(0x0F);

  oled_sendCMD(0xB4);  // set VSL
  oled_sendDAT(0xA0);
  oled_sendDAT(0xB5);
  oled_sendDAT(0x55);

  oled_sendCMD(0xB6); // set PreCharge Level

  /*  Set Scanning Parameters
   *  Data Byte 
   *  D[0] = 0   0: Horizonal  Address Inc  
      D[1] = 0   Column address 0 Mapped to  SEG 0
      D[2] = 0   Normal Color Sequence (not swapped)
      D[3] = 0   Reserved
      D[4] = 0   Scan from COM0 to COM[MUX - 1]
      D[5] = 0   Disable COM split (Odd/Even)
      D[6:7] = 0b00 or 0b01    65k Color Depth
   *  Will yield   data = 0 
   *
   */ 
    oled_sendCMD (0xA0) ;
    oled_sendDAT (0x00) ;
}

void oled_update () {
  // Updates the display, writing the contents of DRAM
  oled_sendCMD (RAM_WRITE_ENABLE) ;
  PINA_HIGH (DC) ;       // Send below data bytes
  SPI_Tx (&(DRAM.bytes[0]), sizeof (DRAM.bytes))  ;
}

void oled_draw (uint8_t x, uint8_t y, uint16_t color) {
  // view x,y as normal graph paper coordinates
  // with zero at bottom left, but pixels are stored 
  // from top left corner (hopefully rowwise)

    y = (ROWS - 1) - y ;  // Since row0 is at the top
    // Assuming RowWise storage
    DRAM.words [x * ROWS + y  ] = color ;
}

uint16_t oled_rgb (uint8_t r, uint8_t g, uint8_t b) {
  uint16_t color ;
  r = r & 0x1F ;   // truncate to 5bits 
  g = r & 0x3F ;   // truncate to 6bits 
  b = r & 0x1F ;   // truncate to 5bits 
  color = color | r ;
  color = color | (g << 5) ;
  color = color | (b << 11) ;
  return (color) ;
}
