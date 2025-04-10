// Author: Ravi Saripalli
// 24th March 2025

#include "oled.h"

int main (void) {
   uint16_t color ;
   uint8_t i ;

   oled_init () ;
   color = oled_rgb (0b11111, 0b111111, 0b11111) ;
   oled_draw (10, 10, color) ;
   
   while (1) {
     delay (200) ;
   } // infinite loop

   return (1) ;
} // end main
  //
// Board Marker   GPIO CODE 
//   D9            PA8
