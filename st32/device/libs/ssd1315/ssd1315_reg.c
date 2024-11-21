#include "ssd1315_reg.h"

/**
  * @brief  Read generic device register
  *
  * @param  ssd1315_ctx_t* ctx: read / write interface definitions
  * @param  uint8_t reg: register to read
  * @param  uint8_t* data: pointer to buffer that store the data read
  * @param  uint16_t len: number of consecutive register to read
  *
  */
int32_t ssd1315_read_reg(ssd1315_ctx_t *ctx, uint16_t reg, uint8_t* data, uint16_t length)
{
  return ctx->ReadReg(ctx->handle, reg, data, length);
}

/**
  * @brief  Write generic device register
  *
  * @param  ssd1315_ctx_t *ctx: read / write interface definitions
  * @param  uint8_t reg: register to write
  * @param  uint8_t* data: pointer to data to write in register reg
  *
*/
int32_t ssd1315_write_reg(ssd1315_ctx_t *ctx, uint16_t reg, uint8_t *data, uint16_t length)
{
  return ctx->WriteReg(ctx->handle, reg, data, length);
}
