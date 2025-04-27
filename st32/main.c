// Author: Ravi Saripalli
// 24th March 2025

#include "oled.h"

int main (void) {
   uint16_t color ;

   oled_init () ;
   oled_sendCMD (DISP_ON) ; 

   oled_sendCMD (DISP_ON) ; 

  while (1) {
   color = RED ;
   oled_clear (color) ;
   delay (500) ;
   color = GREEN ;
   oled_clear (color) ;
   } // infinite loop
   return (1) ;
} // end main
