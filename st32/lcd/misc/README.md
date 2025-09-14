     :q
;q!

# STM32 LCD Segment Driving — Project Summary

## 🧱 What You Started With

- STM32F303K8 (Nucleo) with no native LCD controller
- A 4-digit 7-segment LCD glass
- No pinout documentation for the LCD
- Target: Drive the LCD using **PWM-based analog voltages** (via GPIOs and timers)
- Initial COM waveform assumption: 1/4 duty, 1/3 bias

---

## 🔁 System Design Approach

### 1. Signal Generation via Timers
- **COM lines**: Driven using **TIM2** PWM channels
- **SEG lines**: Driven one at a time using **TIM16**
- PWM duty values generated from `comsTable` for analog voltage levels
- RC filters (10kΩ + 70nF) used to smooth PWM

### 2. Driving Strategy
- 4-phase time-multiplexed driving (for 4 COMs)
- PWM frequency: 4 kHz
- COM phase cycle rate: 50 Hz (via TIM3)
- AC drive ensured by toggling `invert` flag every full COM cycle

---

## 🧠 Key Technical Challenges (and Solutions)

### ⚠️ Challenge 1: Understanding COM–SEG Multiplexing
- Assumed 4MUX initially
- Discovery: Most segments responded only to 3 COM lines → LCD likely 3MUX
- ✅ Lesson: LCD segment count vs pin count must align with MUX depth

---

### ⚠️ Challenge 2: SEG–COM Voltage Not Lighting Segments
- Symptoms: Weak contrast, unlit segments, flickering
- Cause: PWM voltages not settling; `invert` applied too late
- ✅ Fix: 
  - Slowed TIM3 to 50 Hz
  - Ensured `invert = !invert` toggled **before** PWM update
  - Matched SEG and COM inversion logic

---

### ⚠️ Challenge 3: Misaligned COM Pin Mapping
- Segments responded incorrectly
- Root cause: COM physical pin order (C3 → C0) was reversed
- ✅ Fix: `comPinMap[]` introduced to remap logical to physical COM pins

---

### ⚠️ Challenge 4: AC Inversion Timing Off by One Cycle
- `invert` toggled **after** phase = 0 update
- Caused all PWM waveforms to use previous inversion state
- ✅ Fix: Moved `invert = !invert` **before** PWM duty computation

---

## ⚒️ Other Subsystems

- `segDriver()` function to drive a SEG line per phase
- `target_com` mechanism for scanning and mapping segments
- Efficient CCRx access via macro: `SET_CCR(timer, index, value)`
- Diagnostic routines for visual validation

---

## 📈 Results Achieved

### ✅ Hardware
- LCD segments controlled using PWM and RC filtering
- Successful 3-level analog waveform generation
- Visual confirmation of phase-driven segment switching

### ✅ Software
- Robust phase-driven PWM controller with inversion
- Dynamic segment control through `segState`
- Clear logic for MUX phase handling and duty calculation

---

## 💡 Lessons Learned

| Area             | Lesson |
|------------------|--------|
| LCD driving      | Requires AC-symmetric, RMS-balanced waveform |
| MUX depth        | Must be verified physically |
| Phase timing     | `invert` must toggle **before** waveform generation |
| PWM filtering    | Needs fine resolution (`ARR ≥ 1999`) and RC filtering |
| Debugging        | Trust scope + logic, not assumptions |
| Code design      | Abstract physical mappings (e.g., `comPinMap`) |
| Version control  | GIT saved the day — file recovery is not guaranteed |

---

## 🔚 Final Status

You now have:
- A functional PWM-driven LCD driver
- Controlled AC waveform generation
- Logic in place for accurate segment activation
- Deep understanding of SEG–COM phase control and RMS design

# Using STM32 debugger
- Step 1:
      /usr/bin/st-util &  (runs in background)  
      This will create a port for debugging 4242
      
-  Step 2:
     /usr/bin/arm-eabi-none-gdb  -x=gdbinit app.elf 

While eveyrthing can be done interactively, I use gdbinit
to do some basic chores  such as
   *conneting to the debugger port 
   * start logging session
   * executing other commands 
   * source cmds   


## Contents of gdbinit
```bash
target extended-remote localhost:4242
set logging on
```
