#include "stm32f303x8.h"
// Assumes default system clock = 8 MHz from HSI
#define TIM2PSC 1
#define TIM2ARR 255  //  8000/(2 * 256) =  (15.6kHz -> freq) 
#define TIM3PSC 199 
#define TIM3ARR 799 // 8000/(200*800)  kHz = (50 Hz -> freq)
#define LED 4     // PB4 as LED indicator
#define NUM_PHASES   4
#define PWM_MODE1 6
#define PWM_MODE2 7
#define MIN(a, b) (((a) < (b)) ? ( a) : (b))

void setupLED(void) ;
void blink (int n) ;
void init_TIM2_PWM(void) ;
void init_TIM16_PWM(void);
void init_TIM3_IRQ(void) ;
void TIM3_IRQHandler(void) ;

volatile uint8_t phase = 0;
volatile uint8_t invert = 0;  // Com Table Inversion flag
volatile uint8_t segState = 0b1000 ; //LSB to MSB give Seg On State in each phase

//Duty cycles for to PWM Count (Period)  (slightly more than 1/3 bias)
// Ideally [1/3, 1/2, 2/3, 1/2] .... typical 1/3 bias
// But my LCD wants higher RMS ... 
// This pattern has symmetry ie.  COM - (inv)COM =  [-1/3, 0, 1/3, 0]
// In my case I scale this by 1.4 to get higher RMS
//
const float sf = 1.4 ;
const uint16_t pwmDuty[4] = {TIM2ARR*(sf * 1/3), TIM2ARR*(sf * 1/2),
                             TIM2ARR*(sf * 2/3), TIM2ARR} ;
const uint16_t comsTable[NUM_PHASES][4] = {
    { pwmDuty[0], pwmDuty[1], pwmDuty[2], pwmDuty[3] },
    { pwmDuty[1], pwmDuty[2], pwmDuty[3], pwmDuty[0] },
    { pwmDuty[2], pwmDuty[3], pwmDuty[0], pwmDuty[1] },
    { pwmDuty[3], pwmDuty[0], pwmDuty[1], pwmDuty[2] }
};
void TIM3_IRQHandler(void) {
   // Drive all com Lines setting voltage according to Mux phase
   // This is achieved with duty cycle that is proportional to voltage ratio

    if (TIM3->SR & TIM_SR_UIF) {
        TIM3->SR &= ~TIM_SR_UIF;


        uint16_t comDuty ;

           // Drive all COM lines for this phase
           for (uint8_t com = 0 ; com < 4 ; com++) { 
	      if (invert)  comDuty = pwmDuty[3] - comsTable[phase][com] ; 
	      else comDuty = comsTable[phase][com] ;
             
              switch (com) {  // set CCR value corresponding to COM
	 	case 0: TIM2->CCR1 = comDuty; break;  // COM0 
	        case 1: TIM2->CCR2 = comDuty; break;  // COM1
	        case 2: TIM2->CCR3 = comDuty; break;  // COM2
	        case 3: TIM2->CCR4 = comDuty; break;  // COM3 
              }
            }

            // Drive Segment Line that is connected to the active COM in this
            // phase. Note active COM index is same as phase
              uint16_t Cduty ;
	      if (invert)  Cduty = pwmDuty[3] - comsTable[phase][phase] ; 
	      else Cduty = comsTable[phase][phase] ;

	      if ( (1 << phase) & segState ) {    // SEG Pin Output 
		TIM16->CCR1 = pwmDuty[3] - Cduty ; // oppose comValue
                GPIOB->ODR = (1 << LED);  // LED ON
	      }   
	      else {  
		TIM16->CCR1 = Cduty; // follow com value 
                GPIOB->ODR = (0 << LED);  // LED Off
	      }

        phase = (phase + 1) % NUM_PHASES;
        if (phase == 0) invert = !invert ; // we flip coms at every segment update
    } 
} // End of TIM3_IRQ Handle

void init_TIM2_PWM(void) {
    RCC->AHBENR  |= RCC_AHBENR_GPIOAEN;
    (void)RCC->AHBENR ;  // wait for above to completeyy
    RCC->APB1ENR |= RCC_APB1ENR_TIM2EN;
    (void)RCC->APB1ENR ;  // wait for above to completeyy

    // PA0–PA3 → TIM2 CH1–CH4 (AF1) Used for Common Signals 
    //
    for (int i = 0 ; i < 4 ; i++) {
      GPIOA->MODER &= ~(0x3 << (i * 2));     // Clear MODER_i
      GPIOA->MODER |= (2 << (i * 2)) ;       // Set to AF mode
      GPIOA->AFR[0] &= ~(0xF << (i * 4));    // Clear AFRL0 of pin_i
      GPIOA->AFR[0] |=  (0x1 << (i * 4));    // set to AF1  function (TIM2)
      GPIOA->OTYPER &= ~(1 << i);            // Push-pull
      GPIOA->OSPEEDR |= (0x3 << (i * 2));    // High speed
      GPIOA->PUPDR &= ~(0x3 << (i * 2));     // No pull-up/down
    }

    TIM2->PSC = TIM2PSC ;
    TIM2->ARR = TIM2ARR ;

    // Channel_x  is active while  TIMx_ARR < TIMx_CCR1 else inactive
    // Channel_x  output preload enable (TIMx_OC1PE)
    // PWM_MODE2   center aligned pwm  (Pulse count is at the middle of the pulse)
    // Improves alighnment
    TIM2->CCMR1 = (PWM_MODE2 << 4) | (1 << 3) |  // CH1 PWM mode 2 + preload 
                  (PWM_MODE2 << 12) | (1 << 11); // CH2 PWM mode 2 + preload
    TIM2->CCMR2 = (PWM_MODE2 << 4) | (1 << 3) |  // CH3 PWM mode 2 + preload
                  (PWM_MODE2 << 12) | (1 << 11); // CH4 PWM mode 2 + preload

    TIM2->CCER |= TIM_CCER_CC1E | TIM_CCER_CC2E | TIM_CCER_CC3E | TIM_CCER_CC4E;
    TIM2->CR1  |= TIM_CR1_ARPE;
    TIM2->EGR   = TIM_EGR_UG;
    TIM2->CR1  |= TIM_CR1_CEN;
}

void init_TIM3_IRQ(void) {
    RCC->APB1ENR |= RCC_APB1ENR_TIM3EN;
    (void)RCC->APB1ENR ;  // wait for above to completeyy

    TIM3->PSC = TIM3PSC ;
    TIM3->ARR = TIM3ARR ;

    // Fire TIM3_IRQHandler every time Counter Overflow
    TIM3->EGR = TIM_EGR_UG ;    // Force update Event for reload register ARR
    TIM3->SR = 0 ;              // Clear Pending Flags (from status Register)
    TIM3->DIER |= TIM_DIER_UIE; // Enable Update Interrupt
    NVIC_ClearPendingIRQ (TIM3_IRQn) ;
    NVIC_EnableIRQ (TIM3_IRQn);
    TIM3->CR1  |= TIM_CR1_CEN; // Start Timer
}

void setupLED() {
    RCC->AHBENR |= RCC_AHBENR_GPIOBEN; // 1. Enable GPIOB clock
    (void)RCC->AHBENR ;  // wait for above to completeyy

    GPIOB->MODER &= ~(3 << (LED * 2));    // Clear MODERx bits
    GPIOB->MODER |=  (1 << (LED * 2));    // Set MODERx = 0b01 (output mode)

    GPIOB->OTYPER &= ~(1 << LED);         // Push-pull
    GPIOB->OSPEEDR |= (1 << (LED * 2));   // Medium speed
    GPIOB->PUPDR   &= ~(3 << (LED * 2));    // No pull-up/down
    GPIOB->ODR |= (1 << LED);             // PBx = 1 (LED ON, if active high)
}

void delay (unsigned int time) {
  // Time in MilliSeconds (Caliberated on STM32F303X8B)
    for (unsigned int i = 0; i < time; i++)
        for (volatile unsigned int j = 0; j < 575 ; j++);
}

void blink (int count) {
    for (int i = 0; i < count ; i++)  {
        GPIOB->ODR ^= (3 << LED);  // Toggle PAx
        delay (500) ;
    }
}

void init_TIM16_PWM(void) {
 // This timer is tied to PA6 ... can't move this
 // Using CH1 of TIM16 as SIG pin  

    RCC->AHBENR  |= RCC_AHBENR_GPIOAEN;
    (void)RCC->AHBENR ;  // wait for above to completeyy
    RCC->APB2ENR |= RCC_APB2ENR_TIM16EN;
    (void)RCC->APB2ENR ;  // wait for above to completeyy

    // TIM16 as PWM with output on  GPIOA PA6 as segment output 
    // with AF1 alternate function
      int i ;
      i = 6 ;   // (PA6) as  segment pin
      GPIOA->MODER &= ~(0x3 << (i * 2));     // Clear MODER_i
      GPIOA->MODER |= (2 << (i * 2)) ;       // Set to AF mode
      GPIOA->AFR[0] &= ~(0xF << (i * 4));    // Clear AFRL0 of pin_i
      GPIOA->AFR[0] |=  (0x1 << (i * 4));    // set to AF1  function (TIM16)
      GPIOA->OTYPER &= ~(1 << i);            // Push-pull
      GPIOA->OSPEEDR |= (0x3 << (i * 2));    // High speed
      GPIOA->PUPDR &= ~(0x3 << (i * 2));     // No pull-up/down

    // Using same frequency settings as TIM2 that control Commons
    TIM16->PSC = TIM2PSC  ;
    TIM16->ARR = TIM2ARR  ;

    // Channel_x  is active while  TIMx_ARR < TIMx_CCR1 else inactive
    // Channel_x  output preload enable (TIMx_OC1PE)
    TIM16->CCMR1 = (PWM_MODE2 << 4) | (1 << 3) ;  // CH1 PWM mode 2 + preload 
    TIM16->CCER |= TIM_CCER_CC1E ;
    TIM16->CR1  |= TIM_CR1_ARPE;
    TIM16->EGR   = TIM_EGR_UG;
    // This is a must as TIM16 has complementary outputs
    TIM16->BDTR |= TIM_BDTR_MOE ;   //Master output Enable
    TIM16->CR1  |= TIM_CR1_CEN;
}
int main(void) {

  setupLED() ; // Debug indicator
  GPIOB->ODR = (0 << LED);  // LED off

  init_TIM2_PWM() ; // used for common pins signals (4 off)
  init_TIM16_PWM() ; // used for single SEG pin

  init_TIM3_IRQ() ;

   if (!(TIM2->CR1 & TIM_CR1_CEN))  // Timer is not  running!
        blink(3) ;
   if (!(TIM16->CR1 & TIM_CR1_CEN))  // Timer is not  running!
        blink(100) ;
   if (!(TIM3->CR1 & TIM_CR1_CEN))  //  Timer not running
        blink(10) ;

    while (1) {
       __WFI();  // Sleep until interrupt
    }
}

