import numpy as np
import matplotlib.pyplot as plt

def display (state):
# Draw pretty 8 segment digit given segment states
#
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
    
    SEG = [G,F,E,D, P,C,B,A]
    for i in range (8):
           SEG[i].set_visible(states[i])
    
    plt.axis('off')
    plt.draw()
    plt.pause(10)
############################################################

def EightPhaseTest ():
    # With eight phases and using AN14.. chip wave pattern
    # We no longer have on/off state and voltage correspondence
    # So we need to faithfully mimic what we have in our segDriver
    # to get proper RMS values

    c = [] 
    c.append ([0.0, 1.0/3.0, 2.0/3.0, 1.0]) 
    c.append ([1.0/3.0, 2.0/3.0, 1.0, 2.0/3.0])
    c.append ([2.0/3.0, 1.0, 2.0/3.0, 1.0/3.0])
    c.append ([1.0, 2.0/3.0, 1.0/3.0, 0.0]) 
    c.append ([2.0/3.0, 1.0/3.0, 0.0, 1.0/3.0]) 
    c.append ([1.0/3.0, 0.0, 1.0/3.0, 2.0/3.0])
    c.append ([0.0, 1.0/3.0, 2.0/3.0, 1.0])
    c.append ([1.0/3.0, 2.0/3.0, 1.0, 2.0/3.0])

    def getRMS (s,j):    
    #  Calculate RMS signal strength of all possible
    #  (16) bit patterns driving half a digit.
    #  The inversion logic is used s

    #   s ->  digit segments state (8 bits)
    #   Order of bits  [G,F,E,P,C,B,A]

    

        diff = []   # c - s
        for i in range (4):
          diff.append (np.array(c[i]) - np.array(s))
        diff =  (np.array(diff)) 

        rms = []
        for i in range (4):
          rms.append (np.sqrt(np.mean(diff[i]**2)))      

        rms = np.array(rms)
        CodeR = ["P","C","B","A"]
        CodeL = ["G","F","E","D"]
        rms = (rms*3.3 > 1.25)
        onSegsL = [] 
        onSegsR = [] 
        for i in range (4):
          if (rms[i]):
              onSegsL.append(CodeL[i])
              onSegsR.append(CodeR[i])

        print (j, onSegsL, "\t", onSegsR)
        return (rms)  # we can use it for actual display

    for i in range (16):
      s = [(i&8)/8, (i&4)/4, (i&2)/2,(i & 1)]
      s = [round(num) for num in s]
      rms = getRMS (s, i)
      display (rms, i)
###############################################################
#              End  FourPhase testFunction
###############################################################

FourPhaseTest()

