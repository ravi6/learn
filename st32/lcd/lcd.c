#include "lcd.h"
int main(void) {

  #define NIL 15
  #define SS 3    
  enum {FE=0, GED=1, FGD=4, GD=5, FG=7, ED=9};
  enum {AC=0, BCP=1, CP=3, AB=4, BP=5, ACP=11, ABC=14};
  enum {LEFT=0, RIGHT} ;

  uint8_t digit = 0 ;
  uint8_t  k = 1 ;
  startUp () ;
  while (1) {
    selSeg (k) ;
    setSegState(0b1000) ;
    //delay(100);
    if (k==7) k = 1;
    k = k + 2 ;
   // __WFI();  // Sleep until interrupt (use when timers exist)
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
