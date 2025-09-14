#include "lcd.h"
int main(void) {
  uint8_t s[8] = {
                  15, 15,
                  0, 0,
                  0, 0,
                  0, 0,
} ;
  startUp () ;
  selSeg (0) ;
  while (1) {
    for (uint8_t i=0 ; i<7 ; i++) {
        selSeg (i) ; // push toseg0
        setSegState (s[i]);
//        resetTimers () ;
        delay (4500) ;
//        blink(1) ;
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

