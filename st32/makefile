# // https://freeelectron.ro/bare-metal-stm32-led-blink/
# Adapted from above
DEV = device/stm32f303x8
SYS = device/system_stm32f3xx
CC = arm-none-eabi-g++ -g3  -I device/
AS = arm-none-eabi-as
BIN = arm-none-eabi-objcopy
#STL = st-flash --connect-under-reset
STL = st-flash 

# Flags - C Language Options
CFLAGS += -ffreestanding

CPPFLAGS += -specs=nosys.specs # Flags - Overall Options
CPPFLAGS += -Wall              # Flags - Warning Options
CPPFLAGS += -Wextra
CPPFLAGS += -g
CPPFLAGS += -ffunction-sections # Flags - Optimization Options
CPPFLAGS += -fdata-sections
# this flag should not used (perhasp it requires HAL)
#CPPFLAGS += -Wa,--defsym,CALL_ARM_SYSTEM_INIT=1   #Flags - Assembler Options
CPPFLAGS += -Wl,-Ldevice/,-T$(DEV).ld             #Flags - Linker Options
#CPPFLAGS += -nostdlib
CPPFLAGS += -mcpu=cortex-m4     # Flags - Machine-dependant options
CPPFLAGS += -march=armv7e-m+fp
CPPFLAGS += -mlittle-endian
CPPFLAGS += -mthumb
CPPFLAGS += -masm-syntax-unified

CXXFLAGS += -fno-threadsafe-statics # Flags - C++ Language Options
CXXFLAGS += -fno-rtti
CXXFLAGS += -fno-exceptions
CXXFLAGS += -fno-unwind-tables

all: app.bin

main.o: main.c 
	$(CC) $(CPPFLAGS) $(CXXFLAGS) -c -o main.o  main.c

sys.o: $(SYS).c
	$(CC) $(CPPLAGS) $(CXXFLAGS) -c -o sys.o  $(SYS).c

startup.o: $(DEV).s
	$(CC) $(CPPFLAGS) $(CXXFLAGS)  -c -o startup.o  $(DEV).s

app.elf:  main.o startup.o sys.o
	$(CC) $(CPPFLAGS) $(CXXFLAGS)   -o app.elf startup.o sys.o  main.o

app.bin: app.elf
	$(BIN) -O binary app.elf app.bin

clean:
	rm -f *.o *.elf *.bin

flash: app.bin
	$(STL) write app.bin 0x08000000

erase:
	$(STL) erase
