#ifndef GPIO_H
#define GPIO_H
//  GPIO and SPI pin assignments
// PIN names in SPI and OLED 
enum {SCLK=5, MISO, MOSI, LED} ;   // PA5,6,7,8
#define DC  0    // PA0 Oled Data/Command  selection pin (DNC)
#define CS  1    // PA1 Oled Chip Select pin (CS) 
#define RS  2    // PA2 Oled Reset pin (RS)
#endif
