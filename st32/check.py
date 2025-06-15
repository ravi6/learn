# With 10k,  and 70nF  ... I expected 
import numpy as np
T2PSC = 0
T2ARR = 1999
T2CLK = 8000 / (T2PSC+1) / (T2ARR+1) # kHz
T2Time = (1/T2CLK)  #ms

T3PSC = 199
T3ARR = 799
T3CLK = 8000 / (T3PSC+1) / (T3ARR+1) # kHz
T3Time = (1/T3CLK)  #ms

C = 70e-9  # Farads
R = 12e3   # Ohms
RCTime = R * C * 1000 # ms

s = "T2Clk (kHz) = %f T3Clk (kHz) = %f " \
        % (T2CLK, T3CLK)
print (s)
# Division by four is toget perPhase time
print ("Ratio (0.25*T3Time/RCTime) = ", 0.25*T3Time / RCTime)

CIdx = 3
print ("Voltages" , np.array([1/3, 1/2, 2/3])*3.3)
C=[0, 2.24, 1.72, 1.16, 0, 2.24, 1.72, 1.16]
S=[1.14,  0, 2.24, 1.7, 2.24, 3.24, 1.12, 1.7]
print ("C", C)
print ("S", S)
print ("diff", np.array(C)-np.array(S))
