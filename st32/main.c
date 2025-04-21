// Author: Ravi Saripalli
// 24th March 2025

#include "oled.h"

int main (void) {
   color color ;
   color = oled_rgb (31, 0, 0) ;
   oled_init () ;
   oled_draw (0, 0, color) ;

  while (1) {
    oled_sendCMD (DISP_OFF) ;  // Sleeping Mode
    delay (500) ;
    oled_sendCMD (DISP_ON) ;  // Sleeping Mode
    delay (500) ;
   } // infinite loop
   return (1) ;
} // end main
