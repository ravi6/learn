// Author: Ravi Saripalli
// 24th March 2025

#include "oled.h"

int main (void) {
   uint16_t color ;
   uint8_t i ;

   oled_init () ;
   color = RED ;
   while (1) {
     oled_draw (i, i, color) ;
     if ( color == RED ) {
        color = BLUE ; i = 20 ; 
     } else  {
        color = RED ; i = 10 ; 
     } 
   } // infinite loop

   return (1) ;
} // end main
  //
// Board Marker   GPIO CODE 
//   D9            PA8
