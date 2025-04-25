// Author: Ravi Saripalli
// 24th March 2025

#include "oled.h"

int main (void) {
   color color ;
   color = oled_rgb (00,32, 0) ;
   oled_init () ;
   blob blob ;
   blob.x = 10 ; blob.y = 10 ;
   blob.w = 45 ; blob.h = 100 ;
   blob.fill = true ;
   oled_draw (blob) ;

  while (1) {
    oled_sendCMD (DISP_OFF) ;  // Sleeping Mode
    delay (500) ;
    oled_sendCMD (DISP_ON) ;  // Sleeping Mode
    delay (500) ;
   } // infinite loop
   return (1) ;
} // end main
