
/*
void SPI_Tx (uint8_t *data, int size) { // Transmit Data
  int i = 0;
  while (i < size) {// wait for TX buffer to be empty
     while ( !(TX_EMPTY) ) { };  
     SPI->DR = data [i];  // write to the Data Register
     i++;
  }

  /* In discont. comms., there is a 2 APB clock 
   * period delay between the writes to data 
   * register and BSY bit setting. 
   * So wait until Tx buffer is empty and SPI not busy */
*/

  while ( !(TX_EMPTY) ) { } ; // wait for TX buffer to be empty
  while ( SPI_BUSY ) { } ; // wait for SPI to be ready
  // Clear the Overrun flag by reading DR and SR
  uint8_t temp = SPI->DR ;  
  temp = SPI->SR ;
} // end SPI Transmit
*/
