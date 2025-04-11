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

int junk() {
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

uint16_t oled_rgb (uint16_t r, uint16_t g, uint16_t b) {
  uint16_t color ;
  color = 0 ;
  r = r & 0x001F ;   // truncate to 5bits 
  g = g & 0x003F ;   // truncate to 6bits 
  b = b & 0x001F ;   // truncate to 5bits 
  printf ("bbbbb %x   %x \n", b, b << 11  ) ;
  printf ("ggggg %x   %x \n", g, g << 5  ) ;
  printf ("rrrrr %x   %x \n", r ) ;
  color = color | b << 11 ;
  color = color | (g << 5) ;
  color = color | r  ;
  printf ("%16b \n", color);
  return (color) ;
}
int main () {
#define RED		0x1F00
#define GREEN		0xE007
#define BLUE		0x00F8
uint16_t ccc ;
//ccc = oled_rgb ((uint16_t) 0b00011111, (uint16_t)0b00101010, (uint16_t)0b0011011) ;
//ccc = oled_rgb ((uint16_t) 0b00011111, (uint16_t)0b000, (uint16_t)0b00) ;
uint8_t ndiv, mfreq, data ;

for (uint8_t i = 0 ; i < 10 ; i++) {
   for (uint8_t j = 0 ; j < 16 ; j++) {
      data = i | ( (j & 0x0F) << 4 );
      printf("divisor = %d ffact = %d  data= %b  data= %x \n", i, j, data, data) ;
  }
}

}
