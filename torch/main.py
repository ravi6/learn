import os
import numpy as np 
import torch
import torch.nn as nn
import matplotlib.pyplot as plt
import pprint as pp

from net import Net
from getData import getData 
from train import train
from test import test

device = "mps"

# Instantiate model (neural network)
# and pass the object to device ???

model = Net().to(device)

# read in training and test data 
trnData, tstData = getData (64)

# Configure Loss Function
lossFn = nn.CrossEntropyLoss()   

#Configure optimiser (using Steepest gradient) 
optimiser = torch.optim.SGD (model.parameters(), lr=1e-3)

x = Net()
plt.ion() 
plt.xlabel("data count") ; plt.ylabel("loss")
plt.grid() 
fig = plt.figure() ;

for t in range(5):
    predData = train(model, trnData, lossFn, optimiser)
    test(tstData, model, lossFn)
    plt.plot (predData["xp"], predData["yp"], '-o')  ; plt.grid()
    plt.draw ()
    plt.pause(3)
