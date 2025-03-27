#include <stdio.h>
#include <stdint.h>

int main () {
 uint16_t r, g, b, z ;

 r =31 ; g = 63 ; b = 31 ;
 printf ("%d, %d, %d \n", r, g, b) ;
 printf ("%x, %x, %x \n", r, g, b) ;
 r = r & 0x1F ; g = g & 0x3F ; b = b & 0x1F ;
 printf ("%x, %x, %x \n", r, g, b) ;
 printf ("%d, %d, %d \n", r, g, b) ;
 r = r << 11 ; g = g << 6 ;
 printf ("%x, %x, %x \n", r, g, b) ;
 z = r | g | b ;
 printf ("%x \n", z ) ;
}
