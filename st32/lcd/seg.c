#include "lcd.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

// All code related to LCD segments handling
// It is illegal to initialize these vars as they are external 
#define NDIGITS 4   // We use just four digits
char buf [NDIGITS + 3];  // one for dot and extra 2 for fscanf
volatile uint8_t segState ;

// Digit encoding using logical segments (A-G, DP)
// Digit Segment Order  [GFED PCBA] ... 8 Bit State order
const uint8_t digit[10] = {0x77, 0x06, 0xBC, 0x9C, 0xC2, 
                           0xDA, 0xFA, 0x0E, 0xFE, 0xEE} ;

void toString (float x ) {
   // Convert a float to string (positive value only)
    x = fabsf (x) ;
    if (x < 10)        sprintf(buf, "%5.3f", x);
    else if (x < 100)  sprintf(buf, "%5.2f", x);
    else if (x < 1000) sprintf(buf, "%5.1f", x);
    else               sprintf(buf, "%5.0f", x);
}

void updateDigits  (float num) {
     toString (num) ;
     uint8_t iSeg = 0 ;
     for (uint8_t i = 0 ; i < NDIGITS ; i++) {
         selSeg (iSeg) ;
         uint8_t ss = digit [ buf [i] - '0' ];
         setSegState ( ss >> 4 ) ;  // left half digit
         if ( buf [i+1] == '.' ) ss = (ss || 0x1) ; // add dot
         setSegState ( ss & 0x0F ) ;  // right half digit
     }
} // end Update Digit

void setSegState (uint8_t s) {
   segState = s ;
}

uint8_t getSegState () {
   return (segState) ;
}

