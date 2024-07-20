import torch
from torch import nn
from net import Net
from getData import getData 
from train import train
from test import test

import matplotlib.pyplot as plt

device = "mps"

def start (fname):

# Trains a model from scratch and tests it
# Saves scripted model in fname
#for subsequent inferences

    # Instantiate model (neural network)
    # and pass the object to device ???
    model = Net().to(device)

    # read in training and test data 
    trnData = getData (64, trnFlag = True, sflFlag = False)
    tstData = getData (64, trnFlag = False, sflFlag = True)

    # Configure Loss Function
    lossFn = nn.CrossEntropyLoss()   

    #Configure optimiser (using Steepest gradient) 
    optimiser = torch.optim.SGD (model.parameters(), lr=1e-3)

    plt.ion() 
    plt.xlabel("data count") ; plt.ylabel("loss")
    plt.grid() 
    fig = plt.figure() ;

    for epoch in range(5):
        predData = train(model, trnData, lossFn, optimiser)
        test(model, tstData, lossFn)

        plt.plot (predData["xp"], predData["yp"], '-o')  ; plt.grid()
        plt.draw ()
        plt.pause(3)

    # Save  model for subsequent inference
    torch.save(model, fname)
