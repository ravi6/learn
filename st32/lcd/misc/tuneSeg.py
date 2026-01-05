import numpy as np

# Example COM table (8 phases x 4 COMs)
C = np.array([
 [0, 1/3, 2/3, 1],
 [1/3, 0, 1, 2/3],
 [2/3, 1, 0, 1/3],
 [1, 2/3, 1/3, 0],
 [0, 2/3, 1/3, 1],
 [2/3, 0, 1, 1/3],
 [1/3, 1, 0, 2/3],
 [1, 1/3, 2/3, 0]
])

# Target subsegment state
b = [0, 1, 0, 0]   # Only subsegment F ON

# Weight for ON bits
k_on = 0.5

# Weight for OFF bits
k_off = 0

# Compute S waveform
S = np.zeros(8)
for i in range(4):
    S += b[i] * k_on * C[:, i] + (1-b[i]) * k_off * C[:, i]

# DC offset to keep S in [0,1]
S -= np.min(S)
S /= np.max(S)

print("SEG waveform for state", b, "=", S)

