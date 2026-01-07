import numpy as np
import matplotlib.pyplot as plt

# Control signal patterns
# Each row is one control signal
# Four phases of each signal
# Note because of the way control signals
# are configured, (control line index and phase index 
# matched voltage is zero. Very convenient. This control
#Signal pattern is also RMS optimized (as per ChatGPT)
c = [] 
c.append([0, 1/3, 2/3, 1])
c.append([1/3, 0, 1, 2/3])
c.append([2/3, 1, 0, 1/3])
c.append([1, 2/3, 1/3, 0])

def display (sLeft, sRight, p, q):
    #Given Left and Right half of digit states
    # Display it
    plt.figure(figsize=(2, 4))
    a = 0.1
    d = 0.01
    plt.rcParams['lines.linewidth'] = 10.0
    plt.rcParams['lines.solid_capstyle']='round'
    c='green'
    F, = plt.plot([0,0],[0+d,a-d], color=c)
    B, = plt.plot([a,a],[0+d,a-d], color=c)

    E, = plt.plot([0,0],[0-d,-a+d], color=c)
    C, = plt.plot([a,a],[0-d,-a+d], color=c)

    A, = plt.plot([0+d,a-d],[a,a], color=c)
    G, = plt.plot([0+d,a-d],[0,0], color=c)
    D, = plt.plot([0+d,a-d],[-a,-a], color=c)
    P, = plt.plot(a+0.02, -a, marker='o', color=c, markersize=10)
    
    SEGL = [F,G,E,D] 
    SEGR = [A,B,C,P]
    for i in range (4):
       SEGL[i].set_visible(sLeft[i])
       SEGR[i].set_visible(sRight[i])
    
    maskL = sLeft[0] + 2 * sLeft[1] + 4 * sLeft[2] + 8 * sLeft[3]
    maskR = sRight[0] + 2 * sRight[1] + 4 * sRight[2] + 8 * sRight[3]
    #plt.title("MaskL: %d  MaskR: %d" % (maskL, maskR))
    plt.title("i: %d  j: %d" % (p, q))
    plt.axis('off')
    plt.draw()
    plt.pause(0.5)

def getRMS ():
    # Get all RMS arrays of all 16 states
    ALitStates = [] 
    for m in range (16):
        s = [(m&8)/8, (m&4)/4, (m&2)/2,(m & 1)]
        s = [round(num) for num in s]
        diff = []   # c - s
        for i in range (4):
          diff.append (np.array(c[i]) - np.array(s))
        diff =  (np.array(diff)) 

        rms = []
        for i in range (4):
          rms.append (np.sqrt(np.mean(diff[i]**2)))      

        rms = np.array(rms)
        ALitStates.append (rms*3.0 > 1.25)
    return (ALitStates)  # we can use it for actual display
###########################################################

ALit = getRMS () # Generate RMS values for all states

for i in range (16):
  for j in range (16):
      #print (i, j, ALit[i], ALit[j])
      display ( ALit[i], ALit[j] , i, j)
