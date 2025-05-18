
void oled_char_scaled_direct(char c, uint8_t x, uint8_t y, uint16_t cfg, uint16_t cbg, uint8_t scale_factor) {
    uint8_t idx = (uint8_t)(c - ' ');  // Calculate the index for the character
    uint8_t scaled_width = fontA.w * scale_factor;  // New scaled width
    uint8_t scaled_height = fontA.h * scale_factor;  // New scaled height

    // Generate the scaled character by rasterizing it dynamically
    for (int row = 0; row < fontA.h; row++) {
        for (int col = 0; col < fontA.w; col++) {
            // Check if the original character has a pixel set at (row, col)
            if (ISSET(fontA.glyph[idx * fontA.w + col], row)) {
                // Scale the pixel to the larger area
                for (int sy = 0; sy < scale_factor; sy++) {
                    for (int sx = 0; sx < scale_factor; sx++) {
                        // Compute the new pixel position in the scaled grid
                        int x_pos = x + (col * scale_factor) + sx;
                        int y_pos = y + (row * scale_factor) + sy;

                        // Ensure the pixel is within bounds of the display (128x128)
                        if (x_pos < 128 && y_pos < 128) {
                            oled_setPixel(x_pos, y_pos, cfg);  // Draw pixel directly on OLED
                        }
                    }
                }
            }
        }
    }
}

// Helper function to set individual pixels on the SSD1351 display
void oled_setPixel(uint8_t x, uint8_t y, uint16_t color) {
    oled_setRange(SET_ROW_RANGE, y, y);  // Set row range
    oled_setRange(SET_COL_RANGE, x, x);  // Set column range
    oled_sendCMD(RAM_WRITE_ENABLE);      // Enable RAM write
    PINA_HIGH(DC);                      // Data mode
    PINA_LOW(CS);                       // Chip select low
    SPI_Tx(&color, 2);                  // Send the color to the display (2 bytes)
    PINA_HIGH(CS);                      // Chip select high
}

