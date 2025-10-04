#include "lcd.h"

int main(void) {

  enum {LEFT=0, RIGHT} ;
// Digit encoding using logical segments (A-G, DP)
const uint8_t digit[10] = {0xBE, 0x06, 0x7C, 0x5E, 0xC2, 
                           0xDA, 0xFA, 0x0E, 0xFE, 0xEE} ;

  uint8_t k = 0 ;
    startUp () ;
    delay (1000) ;
  while (1) {
    for (int i=0 ; i < 1000 ;i++) {
    setSegState(digit[3]>>4) ;
    selSeg (LEFT) ;
    delay (11125) ;
    selSeg (RIGHT) ;
    setSegState(digit[3]) ;
    delay (11125) ;
    }
    k = k + 1 ;
    if (k==10) k = 0;
    delay (8000) ;
  } // endwhile  

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

//      for(int j=0 ; j<SS ; j++) {
//           m = digState[digit][j] ;  
//           if (m != NIL) setSegState (digState[digit][j]);
/*
      selSeg (RIGHT) ;
      for(int j=0 ; j<SS ; j++) {
             setSegState (digState[digit][j+SS]);
      resetTimers () ;
}
*/
