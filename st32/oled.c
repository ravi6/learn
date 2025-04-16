// Author: Ravi Saripalli
// 24th March 2025
/*
 *   SSD1331 oled display (128x128) color
 *   Display form FreeTronics
 *
*/

#include "oled.h"
#define  DELAY ( blinkLED (1, 500) ) 

// Display Memory allocation
/*
union u_DRAM
{
      uint8_t bytes [2 * ROWS * COLS] ;
      uint16_t words [ROWS * COLS] ;
} DRAM   ;
*/

void oled_sendCMD (uint8_t cmd) { /* Good for single byte CMD */
    PINA_LOW (DC) ;    // cmd mode
    PINA_LOW (CS) ; delay (50) ;
    SPI_Tx (&cmd, 1) ; delay (50) ;
    PINA_HIGH (CS) ;
}

void oled_sendDAT (uint8_t data) {
    PINA_HIGH (DC) ;  // data mode
    PINA_LOW (CS) ; delay (50) ;
    SPI_Tx (&data , 1) ;  delay (50) ;
    PINA_HIGH (CS) ; 
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
    PINA_LOW (CS) ;
    SPI_Tx ((uint8_t *) (&hs) , sizeof (hs)) ;
    PINA_HIGH (CS) ;
}

void oled_init () {

   SPI_Setup () ;
   blinkLED (6, 500) ;

   // These are inputs to the OLED device coming from STM32
   // Assign STM32 pins 
   PINA_TYPE(DC, OUT)   ; // Oled Data/Command (DC) Pin
   PINA_TYPE(CS, OUT)   ; // Chip Select  Pin
   PINA_TYPE(RS, OUT)   ; // Reset  Pin
   DELAY ;

   // Toggle Reset Pin to begin
    PINA_HIGH (RS) ;  delay (100)  ;  
    PINA_LOW (RS) ; delay (100) ; PINA_HIGH (RS) ;
    delay (100) ;
   
  // Unlock Commmands
   oled_sendCMD (0xFD) ; oled_sendDAT (0x12) ;  
    delay (100) ;
   oled_sendCMD (0xFD) ; oled_sendDAT (0xB1) ; 
    delay (100) ;

  oled_sendCMD(0xB5);  // GPIO Setting 
  oled_sendDAT(0x0A);  // D[3:0] 1010  (set both GPIOs to output LOW)
  delay (50) ;

   oled_sendCMD (DISP_OFF) ;  // Sleeping Mode
    delay (50) ;

   // Display clock speed should match SPI speed 
   // Display clock speed is set with B3 command
   // First four bits (MSByte) gives 16 levels of base frequency
   // (fosc) .. and from timing diagram it is (1/20ns) = 50MHz
   // But according to CHATGPT .. this does not represent
   // base frequency of SSD1351. It is 100MHz
   // When high byte is (11) ... then base Freq. = (11/16) * 100 =
   oled_sendCMD (0xB3) ; oled_sendDAT (0xF1) ;  // Display Clock
   delay (50) ;

   // Set Mux Ratio
   oled_sendCMD (0xCA) ; oled_sendDAT (ROWS) ;

  /*  Set Scanning Parameters
   *  Data Byte 
   *  D[0] = 0   0: Horizonal  Address Inc  
      D[1] = 0   Column address 0 Mapped to  SEG 0
      D[2] = 0   Normal Color Sequence (not swapped)
      D[3] = 0   Reserved
      D[4] = 0   Scan from COM0 to COM[MUX - 1]
      D[5] = 0   Disable COM split (Odd/Even)
      D[7:6] = 0b00 256 color,  0b01    65k Color Depth
   *  Will yield   data = 0x40  for 65k
   *
   */
    oled_sendCMD (0xA0) ;  // Set Scanning Params
    oled_sendDAT (0x70) ;  // Mapping, Color Order etc.
			   // 65k Colors (16bit packed RGB (5-6-5)

 // Sets various display rersponse and contrast params

  oled_sendCMD(0xAB); // func Select
  oled_sendDAT(0x01); // Select internal Vdd

  oled_sendCMD(0xC1);  // Set Contrast
  oled_sendDAT(0xE8);  // Color A: Blue
  oled_sendDAT(0xA0);  // Color B: Green
  oled_sendDAT(0xC8);  // Color C: Red

  oled_sendCMD(0xC7);  // Contrast Master
  oled_sendDAT(0x0F);  // highest

  oled_sendCMD(0xB1); // set PreCharge
  oled_sendDAT(0x62); // Phase 2 Period = 6DCLK, Phase 1 Period = 5DCLK

  oled_sendCMD(0xBB); // set PreCharge Voltage
  oled_sendDAT(0x17); // Default value (0.2 + 0.4 * 32 / (0x17) ) * Vcc

  oled_sendCMD(0xB4);  // set VSL (Segment Low)
  oled_sendDAT(0xA0);  // set to external (GND)
  oled_sendDAT(0xB5);  // This is second Byte (can't change)
  oled_sendDAT(0x55);  // This is third byte (can't change)


  oled_sendCMD(0xB6); // set PreCharge2 Level
  oled_sendDAT(0x08); // set to 8 DCLK

  oled_sendCMD(0xBE); // set High Voltage Level of Common Pin VCOMH
  oled_sendDAT(0x05); // Default Value

  oled_sendCMD (DISP_NORMAL) ;  // shows GDDRAM contents 
				//
   // Display Area setup
   oled_setRange (SET_ROW_RANGE, 0, ROWS) ;
   oled_setRange (SET_COL_RANGE, 0, COLS) ;

  // Set Start Line
    oled_sendCMD (0xA1) ; oled_sendDAT (0) ;

  // Set Display Offset
    oled_sendCMD (0xA2) ; oled_sendDAT (0) ;

  // We need GPIO0 to go High for it controls OLED VCC
  //
  oled_sendCMD(0xB5);  // GPIO Setting 
  oled_sendDAT(0x0F);  // D[3:0] 1111  (set both GPIOs to output HIGH)
  delay (500) ;
  oled_sendCMD (DISP_ON) ;
  delay (500) ;

}

/*
void oled_update () {
  // Updates the display, writing the contents of DRAM
  oled_sendCMD (RAM_WRITE_ENABLE) ;
  PINA_HIGH (DC) ;       // Send below data bytes
  PINA_LOW (CS) ;
  delay(10) ;
  SPI_Tx (&(DRAM.bytes[0]), sizeof (DRAM.bytes))  ;
  PINA_HIGH (CS) ;
}
*/

void oled_draw (uint8_t x, uint8_t y, uint16_t color) {
  // view x,y as normal graph paper coordinates
  // with zero at bottom left, but pixels are stored 
  // from top left corner (hopefully rowwise)

    //  x = (ROWS - 1) - x ;  // Since row0 is at the top
    // Assuming RowWise storage
    // DRAM.words [y * ROWS + x  ] = color ;
   
  oled_setRange (SET_ROW_RANGE, x, x+40) ;
  oled_setRange (SET_COL_RANGE, y, y+40) ;
  oled_sendCMD (RAM_WRITE_ENABLE) ;
  PINA_HIGH (DC) ;       // Send below data bytes
  PINA_LOW (CS) ;
  delay(10) ;
  
  for (int i = 0 ; i < 1500 ; i++) 
       SPI_Tx ((uint8_t *) (&color), sizeof (color))  ;
  PINA_HIGH (CS) ;
}

uint16_t oled_rgb (uint16_t r, uint16_t g, uint16_t b) {
  uint16_t color ;
  r = r & 0x001F ;   // truncate to 5bits 
  g = r & 0x003F ;   // truncate to 6bits 
  b = r & 0x001F ;   // truncate to 5bits 
  color = color | r ;
  color = color | (g << 5) ;
  color = color | (b << 11) ;
  return (color) ;
}

