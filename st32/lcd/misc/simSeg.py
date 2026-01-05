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

#Segment line signal (== segment litup status too )  
s = [1, 1, 0, 0]

diff = []   # c - s
for i in range (4):
  diff.append (np.array(c[i]) - np.array(s))
diff =  (np.array(diff)) 

rms = []
for i in range (4):
  rms.append (np.sqrt(np.mean(diff[i]**2)))      

rms = np.array(rms)
Code = ["G","F","E","D"]
rms = (rms*3.3 > 1.25)
onSegs = [] 
for i in range (4):
  if (rms[i]):
      onSegs.append(Code[i])

print (onSegs)


