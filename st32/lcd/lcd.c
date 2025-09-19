#include "lcd.h"
int main(void) {

  #define NIL 15
  #define SS 3    
  enum {FE=0, GED=1, FGD=4, GD=5, FG=7, ED=9};
  enum {AC=0, BCP=1, CP=3, AB=4, BP=5, ACP=11, ABC=14};
  enum {LEFT, RIGHT} ;
  const uint8_t digState[10][2*SS] = {
       //{FE,  ED,  NIL,     ABC, NIL, NIL}, //0
       {FE,  NIL, NIL,     AB, AB, AB}, //0
       {FE,  NIL, NIL,     NIL, NIL, NIL}, //1
       {GED, NIL, NIL,     AB,  NIL, NIL}, //2
       {GD,  NIL, NIL,     ABC, NIL, NIL}, //3
       {FG,  NIL, NIL,     BCP,  NIL, NIL}, //4
       {FG,  ED,  NIL,     AC,  NIL, NIL}, //5
       {FE,  GD,  NIL,     AC,  NIL, NIL}, //6
       {NIL, NIL, NIL,     ABC, NIL, NIL}, //7
       {FE,  GD,  NIL,     ABC, NIL, NIL}, //8
       {FG,  NIL, NIL,     ABC, NIL, NIL}, //9
  };                  

  startUp () ;
  uint8_t digit = 0 ;
  uint8_t  m = 15 ;
  while (1) {
      selSeg (LEFT) ;
         setSegState (m) ;
    //  resetTimers () ;
      delay (5000) ;
      selSeg (RIGHT) ;
         setSegState (m) ;
     // resetTimers () ;
      delay (5000) ;
    //  m = m + 1 ;
     // if (m == 15) m = 0 ;
	   __WFI();  // Sleep until interrupt (use when timers exist)
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
