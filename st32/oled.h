#ifndef OLED_H
#define OLED_H
/* Author: Ravi Saripalli
 * 29th March 2025
 */

#include "spi.h"

enum {RAM_WRITE_ENABLE = 0x5C, RAM_READ_ENABLE} ;
enum {DISP_ALLOFF = 0xA4, DISP_OFF, DISP_ON, DISP_INV} ;
enum {SLEEP_ON = 0xAE, SLEEP_OFF} ;
enum {SET_COL_RANGE = 0x15, SET_ROW_RANGE = 0x75} ;
enum {HSC_STOP=0x9E, HSC_START=0x9F} ;

enum {HORIZ, VERT} ;
enum {TEST, NORMAL, SLOW, SLOWEST} ;

struct HScroll {
    uint8_t offset ; /* A --> 0 no scroll, 
			    1 to 63  another direction   64 to 255 */
    uint8_t stRow ;  /* B --> start row address  <= 128 */
    uint8_t rows ;      /* C --> to be scrolled   B+C <= 128*/ 
    uint8_t reset ;      /* D --> set to zero to reset */
    uint8_t speed ; /* 0 test mode, 1 normal, 2 slow, 3 slowest */
} ;


void oled_sendCMD (uint8_t cmd)  ;
void oled_setRange (uint8_t cmd, uint8_t start, uint8_t end) ;
void oled_Hscroll (uint8_t cmd) ;
void oled_Hscroll_Conf () ;
void oled_Address_Inc (uint8_t dir) ;
void oled_init () ;

#endif
