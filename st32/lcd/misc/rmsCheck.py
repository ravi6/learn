# With 12k,  and 70nF  ... I expected 
import numpy as np

def filterCheck ():
    T2PSC = 0
    T2ARR = 499
    T2CLK = 8000 / (T2PSC+1) / (T2ARR+1) # kHz
    T2Time = (1/T2CLK)  #ms

    T3PSC = 399
    T3ARR = 499 
    T3CLK = 8000 / (T3PSC+1) / (T3ARR+1) # kHz
    T3Time = (1/T3CLK)  #ms

    C = 70e-9  # Farads
    R = 10e3   # Ohms
    RCTime = R * C * 1000 # ms
    filtCLK = 1 / (2 * np.pi * RCTime)     # in kHz

    s = "T2Clk (kHz) = %f T3Clk (kHz) = %f  filtCLK (kHz) = %f" \
            % (T2CLK, T3CLK, filtCLK)
    print (s)

    # Division by four is toget perPhase time
    atten = 1.0 / np.sqrt (1 + np.pow(( (T3CLK*4) / filtCLK),2) )
    print ("freqRatio: T3/FLTR", (T3CLK*4) / filtCLK,  "atten: ", atten)
    atten = 1.0 / np.sqrt (1 + np.pow(( (T2CLK*4) / filtCLK),2) )
    print ("freqRatio: T2/FLTR", (T2CLK) / filtCLK,  "atten: ", atten)

def showRMS():
    y = [0,0,0,0]
    y[0] = np.array([0, 0.5, 1, 0.5])
    y[1] = np.array([0, 1./3,  2./3, 1])

    '''
    y[0] = np.array([0, 1./3, 2./3, 1])
    y[1] = np.array([1./3, 1./2, 2./3, 1./2])
    y[2] = np.array([0.25, 0.5, 0.75, 0.5]) * 1.4
    y[3] = np.array([0, 31/32, 2/32, 31/32]) 
    '''
    for i in range (2):
        x = y[i]
        xm = np.mean(x)
    #    print ("Volt Pattern: ", x*3.3)
    #    print("Volt Diff from Mean: " , (x-xm)*3.3)
        rmsm =  ( (np.sum((x-xm) * (x-xm)) / len(x) ) ** 0.5)
        rms =  ( (np.sum((x) * (x)) / len(x) ) ** 0.5)
        print ("\t\t\t\t",x-xm)
        print ("Mean: %4.2f, RMS: %4.2f  RMSm: %4.2f " % (xm * 3.3, rms*3.3, rmsm * 3.3)) 

filterCheck()
#showRMS()
