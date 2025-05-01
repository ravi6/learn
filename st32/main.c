// Author: Ravi Saripalli
// 24th March 2025

#include "oled.h"
#include <stdlib.h>

int main (void) {
   uint16_t color ;
   char  msg[]  = "RAMA RAMA" ;
   char * cp = &msg[0] ;
   blob blob ;
   uint16_t pix [600] ;
   uint32_t data [] = {
    0x000000,0x070000,0x07e000,0x03fc00,
    0x00ff80,0x007fe0,0x0063f8,0x00607c,
    0x00607c,0x0067f8,0x007fe0,0x00ff00,
    0x07fc00,0x07e000,0x070000,0x000000} ; 

   oled_init () ;
   color = BLACK ;
   oled_clear (color) ;
   oled_sendCMD (DISP_ON) ; 
  
  int k = 0 ;
  for (int row = 23 ; row >= 0 ; row --) {
  for (int col = 0 ; col < 16  ; col ++) {
       if (ISSET (data [col], row )) color = BLUE ;
       else color = BLACK ;
       pix [k] = color ;
       k = k + 1 ;
  }}
   // Vertical
   blob.x = 25 ; blob.y = 25 ;
   blob.h = 24 ; blob.w = 16 ;
   blob.pix = (uint8_t *) (&pix[0]) ;
   oled_draw (blob) ;
  while (1) {
/*
   for (int j = 0 ; j < 64 ; j ++) {
      oled_string (cp, 64,  j * 1 ,  WHITE, BLACK);
      delay (100) ;
      oled_string (cp, 64,  j * 1 ,  BLACK, BLACK);
      delay (100) ;
   }
*/
      delay (100) ;
   } // infinite loop
   return (1) ;
} // end main
