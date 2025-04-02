#include <stdio.h>
#include <stdint.h>
struct colors {
  uint8_t b :5 ;  
  uint8_t :0 ;
  uint8_t g :6 ;  
  uint8_t :0 ;
  uint8_t r :5 ;
  uint8_t :0 ;
}  ;

typedef union color_u {
  struct colors comp ; 
  uint16_t data  ;
} color ; 

int main() {
  color c ;
  c.comp.r = 0b10001 ; 
  c.comp.g = 0b101010 ;
  c.comp.b = 0b11011 ;
  printf ("%b\n", c.data) ;
  printf ("R%b\n", c.comp.r) ;
  printf ("G%b\n", c.comp.g) ;
  printf ("B%b\n", c.comp.b) ;

  uint16_t z ;
  z = z | c.comp.r ;
  z = z | (c.comp.g << 5) ;
  z = z | (c.comp.b << 11) ;
  printf("Z: %b\n", z) ;

  return (0) ;
}
