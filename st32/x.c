#include <stdio.h>
#include <stdint.h>
struct colors {
  uint8_t b :5 ;  
  uint8_t g :6 ;  
  uint8_t r :5 ;
}  ;

typedef struct cData {
  uint8_t  msb ;
  uint8_t  lsb ;
} cData ;

typedef union color_u {
  cData bytes  ;
  uint16_t data ;
} color ; 


int main () {
#define RED		0x1F00
#define GREEN		0xE007
#define BLUE		0x00F8

color myc ;

myc.data = 0xABCD ;
printf ("%x   %x  %x \n", myc.data, myc.bytes.msb, myc.bytes.lsb) ;
}
