#include "lcd.h"

void selSeg (uint8_t k) {
// Segment numbers 0 to 7 only
 SETSTATE(GPIOB, MUXA, ISSET (k, 0)) ;
 SETSTATE(GPIOB, MUXB, ISSET (k, 1)) ;
 SETSTATE(GPIOB, MUXC, ISSET (k, 2)) ;
}

void setupMux () {
  //  Setup Mux IO pins 
  RCC->AHBENR  |= RCC_AHBENR_GPIOBEN;
  (void)RCC->AHBENR ;  // wait for above to completeyy
  outPin (GPIOB, MUXA) ;
  outPin (GPIOB, MUXB) ;
  outPin (GPIOB, MUXC) ;
  outPin (GPIOB, MUXINH) ;
} // end setupMuxLED

void outPin (GPIO_TypeDef *gpio, uint8_t pin) {
// Configure a gpio pin for slow output
  gpio->MODER &= ~(3 << (2 * pin)); // clear
  gpio->MODER |= (1 << (2 * pin));  // output mode
  gpio->OSPEEDR |= (0 << ( 2 * pin));   // low speed
  gpio->OTYPER &= ~(1 << pin);      // Push-pull
  gpio->PUPDR  &= ~(3 << (2 * pin));    // No pull-up/down
  gpio->AFR[0] &= ~(0xF << (4 * pin)) ; // CLR AFRL bits  (insurence)
  gpio->AFR[1] &= ~(0xF << (4 * (pin - 8)));    // has effect only if pin >= 8
}

void resetTimers (void) {
  // Turn off timers
  TIM16->CR1 &= ~TIM_CR1_CEN;
  TIM2->CR1  &= ~TIM_CR1_CEN;

  // Reset counters
  TIM16->CNT = 0;
  TIM2->CNT  = 0;

  // Start both together
  TIM16->CR1 |= TIM_CR1_CEN;
  TIM2->CR1  |= TIM_CR1_CEN;

}
void delay (unsigned int time) {
  // Time in MilliSeconds (Caliberated on STM32F303X8B)
    for (volatile unsigned int i = 0; i < time; i++)
        for (volatile unsigned int j = 0; j < 575 ; j++);
}

void blink (int count) {
    for (int i = 0; i < 2*count ; i++)  {
        GPIOA->ODR ^= (1 << LED);  // Toggle PBx
        delay (1000) ;
    }
}

char * toBin (uint8_t k) {
   char *s ;
   s = (char *) malloc (8) ;
   for (int i=0 ; i<8 ; i++) {
      if (k & (1 << i)) s[7-i] = '1' ;
      else s[7-i] = '0' ;
   } 
   return (s);
}

void startUp() {

  init_TIM16_PWM() ;          // used for single SEG pin
  init_TIM2_PWM() ;           // used for common pins signals (4 off)

  // Add Mux
  setupMux() ; 
  SETSTATE(GPIOB, MUXINH, 0) ; // 0 Enable Mux, 1 disable 
  outPin (GPIOA, LED) ;
  SETSTATE(GPIOA, LED, 1) ;   // LED on

  // Enable Timers
  TIM16->CR1 |= TIM_CR1_CEN; // first slave (Seg line PWM clock)
  TIM2->CR1  |= TIM_CR1_CEN;  // then master (Cx lines PWM clock))

  // Check they are ticking
  if (!(TIM2->CR1 & TIM_CR1_CEN))  blink (2);   // TIM2 not  running!
  if (!(TIM16->CR1 & TIM_CR1_CEN)) blink (3);  // TIM16 not  running!

}
