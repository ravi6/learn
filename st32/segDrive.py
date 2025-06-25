import numpy as np
import matplotlib.pyplot as plt

#    c = np.array([0, 0, 1, 1, 2/3, 2/3, 1/3, 1/3])
#    c = np.array([1/3, 1/3, 1/2, 1/2, 2/3, 2/3, 1/2, 1/2]) * 1.5
LCD = np.array([0, 0, 1/3, 1/3, 2/3, 2/3, 1, 1])
LCD_str = "[0, 0, 1/3, 1/3, 2/3, 2/3, 1, 1]"
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

def subPlot(idx, x, y, c, tag):
    ax = axs[idx]
    ax.plot(x,y, '-', lw=2, ms=9, color=c, label=tag)
    ax.xaxis.set_ticklabels([])
    ax.legend(loc="upper right")
    ax.grid("on")


#plt.plot(xn,yn,'.', mfc='red', ms = 24)
fig, axs  = plt.subplots (9)
tags = ["C0", "C1", "C2", "C3"]
c = ["blue", "red", "green", "brown"]

for com in range (4):
   x, y = getCsig (com)
   subPlot (com, x, y, c[com], tags[com])

x, ys = getSsig (com=comSel)
subPlot (4, x, ys, "green", "S1") 

for i in range (4):
    x, yc = getCsig (com=i)
    s = "S1 - C%d" % (i)
    subPlot (5+i, x, ys-yc, c[i], s) 
s = "%s ActCom: %d" % (LCD_str, comSel)
plt.title(s)
plt.show()


