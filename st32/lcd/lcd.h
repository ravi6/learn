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
#define TIM2PSC 0  //
#define TIM2ARR 499  //  8000/(1 * 512) =  (15.6kHz -> freq) 
#define TIM3PSC 799
#define TIM3ARR 124  // 8000/(200*800)  kHz = (50 Hz -> freq)
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

// Logical segment indices
enum {SEG_A, SEG_B, SEG_C, SEG_D,
      SEG_E, SEG_F, SEG_G, SEG_P}  ;

enum {LED=11, MUXA=4, MUXB=5, MUXC=0, MUXINH=7} ;
enum {PA0, PA1, PA2, PA3, PA4, PA5, PA6} ;
enum {PB0, PB1, PB2, PB3, PB4, PB5, PB6, PB7} ;

void delay (unsigned int time) ;
void blink (int n) ;
void init_TIM2_PWM(void) ;
void init_TIM16_PWM(void);
void init_TIM3_IRQ(void) ;
void TIM3_IRQHandler(void) ;
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
#endif
