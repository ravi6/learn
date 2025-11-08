#ifndef LCD_H
#define LCD_H

#include "stm32f303x8.h"
#include <stdint.h>
#include <stdbool.h>
#include <stdlib.h>
//
// LCD Driving with 4Mux and 1/3 bias
//    Four Common Lines .. 
// Assumes default system clock = 8 MHz from HSI
#define TIM2PSC 0  // prescaler
#define TIM2ARR 499
#define TIM2FRQ ((8E6 / (TIM2PSC + 1) / (TIM2ARR + 1))) // 16e3Hz
#define PHASEFRQ 40  //Hz
#define NPHASES   4
#define PWM_MODE1 6  // is active high for count < ARR
#define PWM_MODE2 7  // is active low  for count < ARR
//
// Unfortunately there is another TIM2_CCER register bits can
// alter the polarity (a real messs)
// Looks as though default active high is 0 and ac

#define MIN(a, b) (((a) < (b)) ? ( a) : (b))
#define ISSET(reg, n) ( ((reg) &  (1<<(n))) != 0 )
#define SETSTATE(gpio, pin, s) ( (gpio)->BSRR = (1 << (pin + (s ? 0 : 16))) )

// Digit Display related stuff
#define NUM_DIGITS 4
#define NSEGPINS 8
#define NCOMS 4
enum {OFF, ON} ;

// Logical segment indices
enum {SEG_A, SEG_B, SEG_C, SEG_D,
      SEG_E, SEG_F, SEG_G, SEG_P}  ;

enum {LED=11, MUXC=4, MUXB=5, MUXA=0, MUXINH=7} ;
enum {PA0=0, PA1, PA2, PA3, PA4, PA5, PA6} ;
enum {PB0=0, PB1, PB2, PB3, PB4, PB5, PB6, PB7} ;

void delay (unsigned int time) ;
void blink (int n) ;
void setup_TIM2_PWM(void) ;
void setup_TIM16_PWM(void);
void setup_TIM2_IRQHandler(void);
void configPWMpin (uint8_t i) ;
void clrSegStates(void) ;
void updateDigit(uint8_t digPos, uint8_t digVal) ;
void segDriver (void) ;
void resetTimers(void) ;
void setupMux(void) ;
void selSeg (uint8_t k) ;
void outPin (GPIO_TypeDef *gpio, uint8_t pin);
void startUp(void) ;
void setSegState (uint8_t s) ;
uint8_t  getSegState () ;
void toString (float x ) ;
void updateDigits (float num) ;
extern uint8_t segStates[NSEGPINS] ; //= {0}; // Will be applied in the interrupt
extern volatile uint8_t segState ;
#endif
