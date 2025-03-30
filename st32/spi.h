#ifndef SPI_H
#define SPI_H

#include "mystm32.h"
#include "gpio.h"

static void delay (unsigned int time) ;
void SPI_Setup () ;
void SPI_Tx (uint8_t *data, int size) ;
void SPI_Rx (uint8_t *data, int size) ;
void blinkLED (int n, int rate)      ;

#endif
