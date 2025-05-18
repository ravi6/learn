#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include "../font.h"
struct colors {
  uint8_t b :5 ;  
  uint8_t g :6 ;  
  uint8_t r :5 ;
}  ;

/*
typedef struct cData {
  uint8_t  lsb ;
  uint8_t  msb ;
} cData ;
*/

typedef union color_u {
  struct cData {
      uint8_t lsb ;
      uint8_t msb ;
  } bytes ;
  uint8_t  bs[2] ;
  uint16_t data ;
} color ; 

struct f {
  int * ip ;
  int j ;
} ;

void mmm (struct f g) {
   printf ("%d %d %d %d \n", g.j, *g.ip, *g.ip+1, *g.ip+2) ;
}

int main () {
#define RED		0x1F00
#define GREEN		0xE007
#define BLUE		0x00F8

uint16_t c[3] ;
c[0] = RED ; c[1] = GREEN ; c[2] = BLUE ;
uint8_t *p ;

p = (uint8_t *) (&c[0]) ;
for (int k = 0 ; k <6 ; k++)
printf (" %x ", p[k]) ; 

}
