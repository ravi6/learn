import numpy as np
import matplotlib.pyplot as plt

def FourPhaseTest ():
    # Control signal patterns
    # Each row is one control signal
    # Four phases of each signal
    # Note because of the way control signals
    # are configured, (control line index and phase index 
    # matched voltage is zero. Very convenient. This control
    #Signal pattern is also RMS optimized (as per ChatGPT)
    c = [] 
    #  The following two alternate patterns produce similar output
    c.append([0, 1/3, 2/3, 1])
    c.append([1/3, 0, 1, 2/3])
    c.append([2/3, 1, 0, 1/3])
    c.append([1, 2/3, 1/3, 0])

    def display (rms, k):
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
        
        SEGL = [G,F,E,D] 
        SEGR = [P,C,B,A]
        for i in range (4):
           SEGL[i].set_visible(False)
           if (rms[i]):
#               SEGL[i].set_visible(True)
               SEGR[i].set_visible(True)
           else:
#               SEGL[i].set_visible(False)
               SEGR[i].set_visible(False)
        
        plt.title("Pattern:%d" % k)
        plt.axis('off')
        plt.draw()
        plt.pause(10)

    def showSeg (s,j):

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
      rms = showSeg (s, i)
      display (rms, i)
###############################################################
#              End  FourPhase testFunction
###############################################################

FourPhaseTest()

