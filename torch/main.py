import os
import numpy as np 
import matplotlib.pyplot as plt
import pprint as pp

import torch
from start import start
from getData import getData
from test import test
from visTest import visTest



fname = "mymodel.pt"
if (not os.path.exists (fname)):
    print ("Running initial Training\n")
    start (fname)  # Create model, train and test
                   # and save it in file

# Load the model from file
model = torch.load (fname)
model.eval()  # put it in evaluation mode
lossFn = torch.nn.CrossEntropyLoss()
for i in range(1):
    tstData = getData (64, trnFlag = False,  sflFlag = True)
    test(model, tstData, lossFn)

visTest (model, tstData)
