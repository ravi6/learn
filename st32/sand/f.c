// Author: Ravi Saripalli
// 24th March 2025

#include <stdlib.h>
#include <stdio.h>

#define ISSET(reg, n) ( ((reg) &  (1<<(n))) != 0 )
int main (void) {

static uint32_t data[] = {
    // 0x000000,0x070000,0x07e000,0x03fc00,0x00ff80,0x007fe0,0x0063f8,0x00607c,0x00607c,0x0067f8,0x007fe0,0x00ff00,0x07fc00,0x07e000,0x070000,0x000000,  // A
    //0x000000,0x000000,0x000000,0x000000,0x07fffc,0x07fffc,0x07fffc,0x00060c,0x00060c,0x00060c,0x00060c,0x00060c,0x00060c,0x00000c,0x000000,0x000000,  // F
//    0x000000,0x000000,0x000000,0x07fffe,0x07fffe,0x060606,0x060606,0x060606,0x060606,0x060606,0x060006,0x060006,0x060006,0x060006,0x000000,0x000000,  // E
    0x000000,0x000000,0x000000,0x07fffe,0x07fffe,0x000186,0x000186,0x000186,0x000186,0x000186,0x000186,0x000186,0x000006,0x000006,0x000000,0x000000,  // F
};

/*
 for (int i = 0 ; i < 96 ; i++) {
 for (int j = 0 ; j < 16 ; j++) {
    uint8_t * bytes = (uint8_t*) (&data [i*16 + j]) ;
    printf ("0x%02x, 0x%02x, 0x%02x,", bytes [2], bytes[1] , bytes[0]) ; 
  }
 printf ("// ..  %c ", (char)(i + 32)) ;
    printf ("\n");
}
*/

 uint8_t * bytes = (uint8_t*) (&data) ;
 for (int j = 0 ; j < 16 ; j++) {
    uint8_t x[3] ;
    x[0] = bytes[j*4+2]  ;
    x[1] = bytes[j*4+1]  ;
    x[2] = bytes[j*4]  ;
//    printf ("%x, %x, %x \n", x[0], x[1], x[2]);
    for (int k = 0 ; k < 3 ; k ++) {
        for (int m = 7 ; m >=0 ; m--){
           if (ISSET (x[k], m)) printf ("%s", "x") ;
           else printf ("%s", ".") ;
        }
    }
    printf ("\n") ;
 }

}
