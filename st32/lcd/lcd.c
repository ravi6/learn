#include "lcd.h"
int main(void) {
  uint8_t s[4] = {0b0001, 0b0010, 0b0100, 0b1000}; 
                  

  startUp () ;
  selSeg (0) ;
  while (1) {
       for (uint8_t i=0 ; i<8 ; i++) {
        selSeg (i) ; // push toseg0
        for (uint8_t k=0 ; k <4 ; k++) {
           setSegState (s[k]) ;
           resetTimers () ;
           delay (15450) ;
        }
        blink(1) ;
       } 
       __WFI();  // Sleep until interrupt (use when timers exist)
  } // end while
} // end main



/*
    clrSegStates() ;
    for (volatile uint8_t i=0 ; i < 10 ; i++) {
    blink(6) ;
    updateDigit(0, i) ;
    } 
// Not yet connected
    updateDigit(1, 1) ;
    updateDigit(2, 1) ;
    updateDigit(3, 1) ;
*/

