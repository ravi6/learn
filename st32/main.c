// Author: Ravi Saripalli
// 24th March 2025

#include "oled.h"

int main (void) {
   uint16_t color ;
   char  msg[]  = "RAMA RAMA RAMA" ;
   char * cp = &msg[0] ;

   oled_init () ;
   color = BLACK ;
   oled_clear (color) ;
   oled_string (cp, 64, 64,  WHITE, BLACK);
   oled_sendCMD (DISP_ON) ; 
  while (1) {
    delay (500) ;
   } // infinite loop
   return (1) ;
} // end main
