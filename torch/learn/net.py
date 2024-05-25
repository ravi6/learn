# Author: Ravi Saripalli
# 25th May 2024
# Let us create a neural Network Object
# Some of this object methods are 
# in different files for ease of readability
#  .... Less Tabbing errors :)) ///


from getData import getData
from test import test
from train import train
from visTest import visTest

import torch.nn as nn

class Net (nn.Module):
    def __init__(self):     # constructor
        super(Net, self).__init__()     # calling parent class
        self.layer1 = nn.Linear (10, 5)
        self.layer2 = nn.Linear (5, 2)
        self.device = "mpu"

    def forward (self, x):      # we propagate inputs through layers
        x = F.relu (self.layer1 (x))   # F is equivalent to torch.nn.functional ... if seems 
        x = self.layer2 (x)            # pass result to next layewr
        return x
