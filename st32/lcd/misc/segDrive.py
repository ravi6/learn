import numpy as np
import matplotlib.pyplot as plt

#    c = np.array([0, 0, 1, 1, 2/3, 2/3, 1/3, 1/3])
#    c = np.array([1/3, 1/3, 1/2, 1/2, 2/3, 2/3, 1/2, 1/2]) * 1.5
#v = [0.25, 0.5, 0.75, 0.5]
v = [0, 1/3, 2/3, 1]
LCD = []
for i in range (4):
   LCD.append (v[i])
   LCD.append (v[i])

LCD = np.array(LCD)
#LCD_str = "[0.25, 0.25, 0.5, 0.5, 0.75, 0.75, 0.5, 0.5]"
comSel = 2
    
def getCsig(com):
    c = np.roll(LCD, -com*2)
    cInv = 1 - c 
    t  = np.array([0, 1, 1, 2, 2, 3, 3, 4])
    x = np.concatenate((t, t+4))
    y = np.concatenate((c, cInv)) 
    return (x, y)

def getSsig(com):
        x, yc = getCsig (com)
        ys = np.array(yc)
        for phase in range (4):
            if ( phase == com ):   # We target specific com
                x, yc = getCsig (com)
                ys[phase*2] = 1 - yc[phase*2]
                ys[phase*2+1] = 1 - yc[phase*2+1]
                ys[phase*2+8] = 1 - yc[phase*2+8]
                ys[phase*2+1+8] = 1 - yc[phase*2+8]
            else:
                x, yc = getCsig (phase)
                ys[phase*2] =  yc[phase*2]
                ys[phase*2+1] = yc[phase*2+1]
                ys[phase*2+8] =  yc[phase*2+8]
                ys[phase*2+1+8] = yc[phase*2+8]

        return (x, ys)

def subPlot(ax, x, y, c, tag):
    ax.plot(x,y, '-', lw=2, ms=9, color=c, label=tag)
    ax.xaxis.set_ticklabels([])
    ax.legend(loc="upper right")
    ax.grid("on")

def signals ():
    #plt.plot(xn,yn,'.', mfc='red', ms = 24)
    fig, axs  = plt.subplots (9)
    #s = "%s ActCom: %d" % (LCD_str, comSel)
    #plt.suptitle(s)
    tags = ["C0", "C1", "C2", "C3"]
    c = ["blue", "red", "green", "brown"]

    for com in range (4):
       x, y = getCsig (com)
       subPlot (axs[com], x, y, c[com], tags[com])

    x, ys = getSsig (com=comSel)
    subPlot (axs[4], x, ys, "green", "S1") 

    for i in range (4):
        x, yc = getCsig (com=i)
        s = "S1 - C%d" % (i)
        subPlot (axs[5+i], x, ys-yc, c[i], s) 
    plt.show()

def performance():
    # This function is due to CHATGPT
    VDD = 3.3         # Supply voltage
    fPWM = 20000      # PWM frequency in Hz
    phaseTime = 5     # COM phase duration in (ms)
    RCtau = 70        # RC time constant in (us)

    # Derived parameters
    pwmPeriod = 1e6 / fPWM   # in (us)
    pwmCycles = int(phaseTime * 1000 / pwmPeriod)

    # SEG duty pattern per COM phase (in percent)
    comLevel = [0.25, 0.5, 0.75, 0.5]

    # RC low-pass filter function (first-order)
    def rc_filter(signal, tau, dt):
        out = np.zeros_like(signal)
        alpha = dt / (tau + dt)
        for i in range(1, len(signal)):
            out[i] = out[i-1] + alpha * (signal[i] - out[i-1])
        return out

    # Generate PWM signal and COM for one full 4-phase cycle
    time = []
    segPWM = []
    Vcom = []

    for phase in range(4):
        segDuty = 1 - comLevel[phase] # Turn On
        com_level = comLevel[phase] * VDD
        for i in range(pwmCycles):
            t_start = (len(time)) * pwmPeriod
            t_end = t_start + pwmPeriod
            time.append(t_start)
            if (i * pwmPeriod) % (pwmPeriod) < segDuty * pwmPeriod:
                segPWM.append(VDD)
            else:
                segPWM.append(0)
            Vcom.append(com_level)

    time = np.array(time) /1000 # milli seconds
    segPWM = np.array(segPWM)
    Vcom = np.array(Vcom)

    # Apply RC filter to SEG
    VsegSmooth = rc_filter(segPWM, RCtau, pwmPeriod)

    # Compute SEG-COM difference
    Vdiff = VsegSmooth - Vcom
    Vrms = np.sqrt(np.mean(Vdiff**2))

    # Plot
    plt.figure(figsize=(12, 6))
    plt.plot(time, VsegSmooth, label="SEG (filtered)", linewidth=2)
    plt.plot(time, Vcom, label="COM", linestyle='--', linewidth=2)
    plt.plot(time, Vdiff, label="SEG - COM", linestyle=':', linewidth=2)
    plt.title(f"SEG/COM Waveform @ {fPWM}Hz PWM, τ={RCtau}μs, RMS diff = {Vrms:.2f}V")
    plt.xlabel("Time (ms)")
    plt.ylabel("Voltage (V)")
    plt.grid(True)
    plt.legend()
    plt.tight_layout()
    plt.show()

#performance()
signals()
