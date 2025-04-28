// Author: Ravi Saripalli
// 24th March 2025
/*
 *   SSD1331 oled display (128x128) color
 *   Display form FreeTronics
*/

#include "oled.h"
#include "string.h"

//=========================================================
void oled_draw (blob b) {
  // Draw a blob of bitmap on to oled.
   
  oled_setRange (SET_COL_RANGE, b.x, b.x + b.w - 1) ;
  oled_setRange (SET_ROW_RANGE, b.y, b.y + b.h - 1) ;
  oled_sendCMD (RAM_WRITE_ENABLE) ;
  PINA_HIGH (DC) ;       // Send below data bytes
  PINA_LOW (CS) ;
  SPI_Tx (b.pix, b.w * b.h * 2) ; 
  PINA_HIGH (CS) ;
}

//=====================================================
void oled_clear (uint16_t  color) { 
// fill entire screen with a color
// One line at a time (due to memory limits)
  blob b ;
 
  uint8_t nL   ;  // Lines drawn per batch

  nL = 1 ;
  uint16_t  pix [128 * 16 * nL] ;
  for (int i = 0 ; i <  128 * 16 *  nL ; i++) pix [i] = color ;

  b.w = 128 ; b.h = nL ;
  for (uint8_t i = 0 ; i < 128 / nL ; i ++) {
       b.x = 0 ; b.y = i*nL ;
       b.pix = (uint8_t *) (&pix) ;    
       oled_draw (b) ;
  } 
}

//==================================================================
void oled_char (char c, uint8_t x, uint8_t y, uint16_t cfg, uint16_t cbg ) {
 // note: chars with codes from 32 to 127 are valid 

  uint16_t  pix [fontA.w * fontA.h] ; // pixels in each char
   
  // We draw pixels row wise of the char
  int idx =  ((uint8_t) c - ' ')  ;   // fonts offset removed
  int k = 0 ;
  for (int row = fontA.h - 1 ; row >= 0 ; row --) {
    for (int col = 0 ; col < fontA.w  ; col ++) {
       if (ISSET (fontA.glyph [idx * fontA.w  + col], row )) pix [k] = cfg ;
       else pix [k] = cbg ;
       k = k + 1 ;
    }
  }   
  blob blob ;
  blob.x = x ; blob.y = y ; blob.w = fontA.w ; blob.h = fontA.h ;
  blob.pix = (uint8_t*) (&pix[0]) ; 
  oled_draw (blob) ;
} // end drawChar 

//=====================================================
void oled_string (char* msg , uint8_t x, uint8_t y, uint16_t cfg, uint16_t cbg) {
    int nc = (int) (strlen (msg)) ;
    for (int i = 0 ; i < nc ; i++) {
        oled_char (msg[i], x + i * fontA.w, y , cfg, cbg) ;
    }
}
//=====================================================
void oled_setGPIO () {
   // These are inputs to the OLED device coming from STM32
   // Assign STM32 pins 
   PINA_TYPE(DC, OUT)   ; // Oled Data/Command (DC) Pin
   PINA_TYPE(CS, OUT)   ; // Chip Select  Pin
   PINA_TYPE(RS, OUT)   ; // Reset  Pin
   
   // All high speed
    CLRSET(GPIOA->OSPEEDR, 0b11 << DC, 0b11) ;  
    CLRSET(GPIOA->OSPEEDR, 0b11 << CS, 0b11) ;  
    CLRSET(GPIOA->OSPEEDR, 0b11 << RS, 0b11) ;  
   
   // No Pull
    CLRSET(GPIOA->PUPDR, 0b11 << DC, 0b00) ;
    CLRSET(GPIOA->PUPDR, 0b11 << CS, 0b00) ;
    CLRSET(GPIOA->PUPDR, 0b11 << RS, 0b00) ;
    
 // Initial states of output pin
   PINA_HIGH (DC) ;
   PINA_HIGH (CS) ;
   PINA_HIGH (RS) ;
}
//=====================================================
void oled_sendCMD (uint8_t cmd) { /* Good for single byte CMD */
    PINA_LOW (DC) ;    // cmd mode
    PINA_LOW (CS) ; 
    SPI_Tx (&cmd, 1) ; 
    PINA_HIGH (CS) ;
}

//=====================================================
void oled_sendDAT (uint8_t data) {
    PINA_HIGH (DC) ;  // data mode
    PINA_LOW (CS) ; 
    SPI_Tx (&data , 1) ;  
    PINA_HIGH (CS) ; 
} 

//=====================================================
void oled_setRange (uint8_t cmd, uint8_t start, uint8_t end) {
    oled_sendCMD (cmd) ;
    oled_sendDAT (start) ;
    oled_sendDAT (end) ;
}

//=====================================================
void oled_Hscroll (uint8_t cmd) {
    oled_sendCMD (cmd) ;
}

//=====================================================
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

//=====================================================
void oled_init () {

   SPI_Setup () ;
   oled_setGPIO () ;
   blinkLED (3, 500) ;

 // Toggle Reset Pin to begin
    PINA_HIGH (RS) ;  delay (100)  ;  
    PINA_LOW (RS) ; delay (100) ; PINA_HIGH (RS) ;
    delay (100) ;

  // Unlock Commmands
   oled_sendCMD (0xFD) ; oled_sendDAT (0x12) ;  
   oled_sendCMD (0xFD) ; oled_sendDAT (0xB1) ; 

  oled_sendCMD(0xB5);  // GPIO Setting 
  oled_sendDAT(0x0F);  // D[3:0] 1111  (set both GPIOs to output High)
  delay (100) ; // we need this for GPIO0 to respond large 560K pull down resistor

  oled_sendCMD (DISP_OFF) ;  // Sleeping Mode

   // Display clock speed should match SPI speed 
   // Display clock speed is set with B3 command
   // First four bits (MSByte) gives 16 levels of base frequency
   // (fosc) .. and from timing diagram it is (1/20ns) = 50MHz
   // But according to CHATGPT .. this does not represent
   // base frequency of SSD1351. It is 100MHz
   // When high byte is (11) ... then base Freq. = (11/16) * 100 =
   oled_sendCMD (0xB3) ; oled_sendDAT (0xD1) ;  // Display Clock

   // Set Mux Ratio
   oled_sendCMD (0xCA) ; oled_sendDAT (ROWS-1) ;

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
    oled_sendDAT (0x40) ;  // Mapping, Color Order etc.
			   // 65k Colors (16bit packed RGB (5-6-5)
 // Sets various display rersponse and contrast params

  oled_sendCMD(0xAB); // func Select
  oled_sendDAT(0x01); // Select internal Vdd

  oled_sendCMD(0xC1);  // Set Contrast
  oled_sendDAT(0x8A);  // Color A: Blue
  oled_sendDAT(0xA1);  // Color B: Green
  oled_sendDAT(0x8A);  // Color C: Red

  oled_sendCMD(0xC7);  // Contrast Master
  oled_sendDAT(0x0F);  // highest

  oled_sendCMD(0xB1); // set PreCharge
  oled_sendDAT(0x62); // Phase 2 Period = 6DCLK, Phase 1 Period = 5DCLK

  oled_sendCMD(0xBB); // set PreCharge Voltage
  oled_sendDAT(0x1F); // Default value (0.6  * Vcc)

  oled_sendCMD(0xB4);  // set VSL (Segment Low)
  oled_sendDAT(0xA0);  // set to external (GND)
  oled_sendDAT(0xB5);  // This is second Byte (can't change)
  oled_sendDAT(0x55);  // This is third byte (can't change)

  oled_sendCMD(0xB6); // set PreCharge2 Level
  oled_sendDAT(0x08); // set to 8 DCLK (default)

  oled_sendCMD(0xBE); // set High Voltage Level of Common Pin VCOMH
  oled_sendDAT(0x05); // Default Value

   // Display Area setup
   oled_setRange (SET_ROW_RANGE, 0, ROWS-1) ;
   oled_setRange (SET_COL_RANGE, 0, COLS-1) ;

  // Set Start Line
    oled_sendCMD (0xA1) ; oled_sendDAT (0) ;

  // Set Display Offset
    oled_sendCMD (0xA2) ; oled_sendDAT (0) ;

  // We need GPIO0 to go High for it controls OLED VCC
  oled_sendCMD(0xB5);  // GPIO Setting 
  oled_sendDAT(0x0F);  // D[3:0] 1111  (set both GPIOs to output HIGH)
  delay (100) ;
  
  oled_sendCMD (DISP_NORMAL) ;  // shows GDDRAM contents 
  oled_sendCMD (DISP_ON) ;
}

//=====================================================
uint16_t  oled_rgb (uint8_t r, uint8_t g, uint8_t b) {
  // Return a pointer to color (two bytes)
  uint16_t  colorD ;
  r = r & 0x1F ;   // truncate to 5bits 
  g = g & 0x3F ;   // truncate to 6bits 
  b = b & 0x1F ;   // truncate to 5bits 
  colorD =  (uint16_t) r ;
  colorD = colorD | ((uint16_t) g << 5) ;
  colorD = colorD | ((uint16_t) b << 11) ;
  colorD = (colorD >> 8) | (colorD << 8) ;
  return (colorD) ;
}

