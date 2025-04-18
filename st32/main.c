// Author: Ravi Saripalli
// 24th March 2025

#include "oled.h"

int main (void) {
   color color ;
   uint8_t i ;

   color = oled_rgb (0b11111, 0b111101, 0b11111) ;
   oled_draw (0, 0, color) ;
   
   oled_init () ;
   while (1) {
   delay (100) ;
   //oled_sendCMD(0xB5);  // GPIO Setting Leaving at reset value
   //oled_sendDAT(0x0A);  // D[3:0] 0010  (Disable GPIO1, Input GPIO0
   } // infinite loop

   return (1) ;
} // end main
