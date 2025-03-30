// Author: Ravi Saripalli
// 24th March 2025

#include "oled.h"

int main (void) {
   char* data ;  
   blinkLED (6, 5) ;

while (1) {
	  
     // Send Some Data 
       data = "w" ;
       SPI_Tx ((uint8_t*) data, sizeof (data));
   } // infinite loop

   return (1) ;
} // end main
  //
// Board Marker   GPIO CODE 
//   D9            PA8
