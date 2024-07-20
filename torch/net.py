# Author: Ravi Saripalli
# 25th May 2024

import torch.nn as nn

class Net (nn.Module):
    def __init__(self):
        super().__init__()
        self.flatten = nn.Flatten()    # Convert to one dimensinmal  vector
        self.stack = nn.Sequential ( # Input, middle and output layers
        nn.Linear (in_features = 28 * 28, out_features = 512), nn.ReLU (),
        nn.Linear (512, 512), nn.ReLU (),
        nn.Linear (512, 10)
        )

    def forward (self, x):   # is this final output calc
        x = self.flatten (x)
        logits = self.stack (x)
        return logits
