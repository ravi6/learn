
void spi1_init(void) {
    RCC->APB2ENR |= RCC_APB2ENR_SPI1EN;

    SPI1->CR1 = SPI_CR1_MSTR     // Master mode
              | SPI_CR1_SSI
              | SPI_CR1_SSM
              | SPI_CR1_BR_1     // Clock div 8 (adjust)
              | SPI_CR1_SPE;     // Enable SPI

    SPI1->CR2 = SPI_CR2_TXDMAEN; // Enable DMA TX requests
}
void gpio_init_spi1(void) {
    RCC->AHBENR |= RCC_AHBENR_GPIOAEN;

    // PA5 = SCK, PA7 = MOSI (AF5)
    GPIOA->MODER &= ~((3 << (5 * 2)) | (3 << (7 * 2)));
    GPIOA->MODER |=  (2 << (5 * 2)) | (2 << (7 * 2));  // AF mode

    GPIOA->AFR[0] |= (5 << (5 * 4)) | (5 << (7 * 4));  // AF5 for SPI1

    GPIOA->OSPEEDR |= (3 << (5 * 2)) | (3 << (7 * 2)); // High speed
}
void spi1_init(void) {
    RCC->APB2ENR |= RCC_APB2ENR_SPI1EN;

    SPI1->CR1 = SPI_CR1_MSTR     // Master mode
              | SPI_CR1_SSI
              | SPI_CR1_SSM
              | SPI_CR1_BR_1     // Clock div 8 (adjust)
              | SPI_CR1_SPE;     // Enable SPI

    SPI1->CR2 = SPI_CR2_TXDMAEN; // Enable DMA TX requests
}
void dma1_channel3_init(uint8_t *data, uint32_t size) {
    RCC->AHBENR |= RCC_AHBENR_DMA1EN;

    DMA1_Channel3->CCR &= ~DMA_CCR_EN;  // Disable before config

    DMA1_Channel3->CPAR = (uint32_t)&SPI1->DR;
    DMA1_Channel3->CMAR = (uint32_t)data;
    DMA1_Channel3->CNDTR = size;

    DMA1_Channel3->CCR = DMA_CCR_MINC     // Memory increment
                       | DMA_CCR_DIR      // Read from memory
                       | DMA_CCR_TCIE     // Transfer complete IRQ
                       | DMA_CCR_PL_1;    // High priority (optional)

    // Connect DMA1 Channel 3 to SPI1_TX (Request 1) if needed via DMAMUX (not required on F303)
}
volatile uint8_t dma_done = 0;

void DMA1_Channel3_IRQHandler(void) {
    if (DMA1->ISR & DMA_ISR_TCIF3) {
        DMA1->IFCR |= DMA_IFCR_CTCIF3;   // Clear flag
        DMA1_Channel3->CCR &= ~DMA_CCR_EN;
        SPI1->CR2 &= ~SPI_CR2_TXDMAEN;

        dma_done = 1;
    }
}

void dma_irq_init(void) {
    NVIC_EnableIRQ(DMA1_Channel3_IRQn);
    NVIC_SetPriority(DMA1_Channel3_IRQn, 1);
}
void send_framebuffer_dma(uint8_t *framebuffer, uint32_t size) {
    dma_done = 0;
    dma1_channel3_init(framebuffer, size);
    dma_irq_init();

    // Start DMA
    DMA1_Channel3->CCR |= DMA_CCR_EN;

    // Wait for it (optional)
    while (!dma_done);
}
uint8_t framebuffer[128 * 128 * 2];  // RGB565 data

int main(void) {
    gpio_init_spi1();
    spi1_init();

    // fill framebuffer[] here...

    send_framebuffer_dma(framebuffer, sizeof(framebuffer));

    while (1);
}
#define SCREEN_WIDTH   128
#define SCREEN_HEIGHT  128
#define PIXEL_SIZE     2  // RGB565 = 2 bytes

#define FRAME_SIZE     (SCREEN_WIDTH * SCREEN_HEIGHT * PIXEL_SIZE)

uint8_t framebuffer1[FRAME_SIZE];
uint8_t framebuffer2[FRAME_SIZE];

uint8_t *front_buffer = framebuffer1;
uint8_t *back_buffer  = framebuffer2;
void send_rect_dma(uint8_t *buf, uint16_t x, uint16_t y, uint16_t w, uint16_t h) {
    // Set SSD1351 window (you must implement this)
    ssd1351_set_window(x, y, x + w - 1, y + h - 1);

    // Compute buffer offset
    uint8_t *region_start = buf + ((y * SCREEN_WIDTH + x) * PIXEL_SIZE);
    uint32_t region_size  = w * h * PIXEL_SIZE;

    dma_done = 0;
    dma1_channel3_init(region_start, region_size);
    DMA1_Channel3->CCR |= DMA_CCR_EN;

    while (!dma_done);
}
void swap_buffers(void) {
    uint8_t *temp = front_buffer;
    front_buffer = back_buffer;
    back_buffer = temp;
}
int main(void) {
    gpio_init_spi1();
    spi1_init();

    // Clear both buffers
    memset(framebuffer1, 0x00, FRAME_SIZE);
    memset(framebuffer2, 0x00, FRAME_SIZE);

    // Draw something to back buffer (example)
    draw_rectangle(back_buffer, 20, 20, 40, 40, 0xF800);  // Red square

    // Send only the red square
    send_rect_dma(back_buffer, 20, 20, 40, 40);
    swap_buffers();

    while (1) {
        // Animate or update parts of back_buffer
        draw_rectangle(back_buffer, 30, 30, 20, 20, 0x07E0);  // Green square

        // Send only updated region
        send_rect_dma(back_buffer, 30, 30, 20, 20);
        swap_buffers();
    }
}
void draw_rectangle(uint8_t *buf, uint16_t x, uint16_t y, uint16_t w, uint16_t h, uint16_t color) {
    for (uint16_t row = 0; row < h; row++) {
        for (uint16_t col = 0; col < w; col++) {
            uint32_t pixel_index = ((y + row) * SCREEN_WIDTH + (x + col)) * 2;
            buf[pixel_index] = color >> 8;
            buf[pixel_index + 1] = color & 0xFF;
        }
    }
}

