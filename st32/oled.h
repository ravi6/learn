#ifndef OLED_H
#define OLED_H
/* Author: Ravi Saripalli
 * 29th March 2025
 */

#include "spi.h"

enum {RAM_WRITE_ENABLE = 0x5C, RAM_READ_ENABLE} ;
enum {DISP_BLACK = 0xA4, DISP_WHITE, DISP_NORMAL, DISP_INVERT} ;
enum {DISP_OFF = 0xAE, DISP_ON} ;
enum {SET_COL_RANGE = 0x15, SET_ROW_RANGE = 0x75} ;
enum {HSC_STOP = 0x9E, HSC_START = 0x9F} ;
enum {GPIO_HIZ = 0, GPIO_LOW = 2, GPIO_HIGH = 3} ;

enum {HORIZ, VERT} ;
enum {TEST, NORMAL, SLOW, SLOWEST} ;

typedef struct color_s {
  uint8_t  lsb ;
  uint8_t  msb ;
} color ; 

#define ROWS 128
#define COLS 128

/*
#define BLUE		0x00F8
#define RED		0x1F00
#define GREEN		0xE007
#define YELLOW		0xFF07
#define PURPLE		0x1FF8
#define AQUA		0xE0FF
#define BLACK		0x0000
#define WHITE		0xFFFF
*/

struct HScroll {
    uint8_t offset ; /* A --> 0 no scroll, 
			    1 to 63  another direction   64 to 255 */
    uint8_t stRow ;  /* B --> start row address  <= 128    */
    uint8_t rows ;   /* C --> to be scrolled   B+C <= 128  */ 
    uint8_t reset ;  /* D --> set to zero to reset         */
    uint8_t speed ;  /* 0 test mode, 1 normal, 2 slow, 3 slowest */
} ;


void oled_sendCMD (uint8_t cmd)  ;
void oled_sendDAT (uint8_t cmd)  ;
void oled_setRange (uint8_t cmd, uint8_t start, uint8_t end) ;
void oled_Hscroll (uint8_t cmd) ;
void oled_Hscroll_Conf () ;
void oled_init () ;
void oled_update () ;
void oled_draw (uint8_t x, uint8_t y, color color);
color  oled_rgb (uint8_t r, uint8_t g, uint8_t b);

#endif
