// Author: Ravi Saripalli
// 24th March 2025

#include "oled.h"

int main (void) {
   color color ;
   color = oled_rgb (0b11111, 0b111101, 0b11111) ;
   oled_init () ;
//   oled_draw (0, 0, color) ;

  oled_sendCMD(0xAA);  // GPIO Setting 
  while (1) {
    delay (10) ;
   } // infinite loop
   return (1) ;
} // end main
