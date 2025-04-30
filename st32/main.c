// Author: Ravi Saripalli
// 24th March 2025

#include "oled.h"

int main (void) {
   uint16_t color ;
   char  msg[]  = "RAMA RAMA" ;
   char * cp = &msg[0] ;

   oled_init () ;
   color = BLACK ;
   oled_clear (color) ;
   oled_sendCMD (DISP_ON) ; 

  while (1) {
   for (int j = 0 ; j < 64 ; j ++) {
      oled_string (cp, 64,  j * 1 ,  WHITE, BLACK);
      delay (100) ;
      oled_string (cp, 64,  j * 1 ,  BLACK, BLACK);
      delay (100) ;
   }
      delay (100) ;
   } // infinite loop
   return (1) ;
} // end main
