#include "lcd.h"

// All code related to LCD segments handling

volatile uint8_t segState = 0b1010;

uint8_t segStates[NSEGPINS] = {0}; // Will be applied in the interrupt
// Digit encoding using logical segments (A-G, DP)
const uint8_t digEncode[10] = {0x3F, 0x06, 0x5B, 0x4F, 0x66, 
                               0x6D, 0x7D, 0x07, 0x7F, 0x6F} ;

// Example LCD Digit Mapper for SEG+COM paired segment layout
// Assumptions:
// - 4 digits
// - Each digit is driven by 2 SEG lines
// - SEG lines: P9-P16 (i.e., SEG[0] to SEG[7])
// - COM lines: COM0 to COM3
// - Segment pairs per digit: [F,G,E,D] and [A,B,C,DP]
// - segState is updated per phase (COM)


// Phase-to-segment mapping for each SEG line
// Format: seg_map[seg_line][phase] = logical segment ID 
// (SEG_A ... SEG_G, SEG_P, or 0xFF if unused)
const uint8_t seg_map[NSEGPINS][NCOMS] = {
    // COM0  COM1  COM2  COM3
    {SEG_D, SEG_G, SEG_D, SEG_G}, // SEG[0] - F/G/E/D (reuse pattern)
    {SEG_P, SEG_B, SEG_P, SEG_B}, // SEG[1] - A/B/C/DP (reuse pattern)
    {SEG_D, SEG_G, SEG_D, SEG_G}, // SEG[2]
    {SEG_P, SEG_B, SEG_P, SEG_B}, // SEG[3]
    {SEG_D, SEG_G, SEG_D, SEG_G}, // SEG[4]
    {SEG_P, SEG_B, SEG_P, SEG_B}, // SEG[5]
    {SEG_D, SEG_G, SEG_D, SEG_G}, // SEG[6]
    {SEG_B, SEG_P, SEG_B, SEG_P}, // SEG[7]
};

// Update SEG states for a given digit and its value
void updateDigit(uint8_t digPos, uint8_t digVal) {
    uint8_t enc = digEncode[digVal];  // digValue 0 to 9

    for (uint8_t phase = 0; phase < NCOMS; ++phase) {
        uint8_t sL = seg_map[digPos*2][phase];
        uint8_t sR = seg_map[digPos*2 + 1][phase];

       // Load segState bits for the digit we want
        segStates[digPos*2] |= ((enc >> sL) & 1) << phase;
        segStates[digPos*2+1] |= ((enc >> sR) & 1) << phase;
    }
} // end Update Digit

// Clear segment states
void clrSegStates(void) {
    for (int i = 0; i < NSEGPINS; ++i)
        segStates[i] = 0;
}

void setSegState (uint8_t s) {
   segState = s ;
}

uint8_t getSegState () {
   return (segState) ;
}

