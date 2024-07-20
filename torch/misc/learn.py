import os
import numpy as np 
import torch
import torch.nn as nn
import matplotlib.pyplot as plt
import pprint as pp
import importlib
#from importlib import reload

##############################################################
def test1():
    class MyModule (torch.nn.Module):

        def __init__(self, N, M):
            super(MyModule, self).__init__()
            #Generate some random weights
            self.weight = torch.nn.Parameter(torch.rand(N,M))

        # What is this function doing??
        def forward(self, input):
            if input.sum() > 0:
                output = self.weight.mv(input)
            else:
                output = self.weight + input
            return output

        # Compile model - static representation ??
    mymod = torch.jit.script(MyModule(3,4)) 
    mymod.save("myscript.pt") #save model and data for others to use
##############################################################
def  test2():
    # create a very simple nn
    #  just one input layer and one outputlayer
    #  

    inputL = nn.Linear (3, 1)  #  3 input nodes with one output
    pp.pprint (inputL)
    print (inputL.weight)
    print (inputL.bias)

    print ("intialise bias to zero value")
    print ("apparently it helps nn")
    nn.init.zeros_(inputL.bias)
    print("**  Bias Values", inputL.bias)

    print("Now initialize weights too")
    # sample frm -x to +x with uniform distribution where x = sqrt( 6 / (ni + no) )
    # inthis case ni = 3,  no = 1   .... this keeps std of weights and gradients in check
    # have to see how it does this.
    print(f"*** with xavier_uniform_ method x = {np.sqrt(6/(1 + 3)):.3f}")
    nn.init.xavier_uniform_(inputL.weight)
    print("*** xavier uniform weights: " , inputL.weight)

    print(f"*** with xavier_normalm_ method x = {np.sqrt(2/(1 + 3)):.3f}")
    nn.init.xavier_uniform_(inputL.weight)
    print("*** xavier normal weights: " , inputL.weight)


    # Let us create a calss for our nn
    class Net (nn.Module):
        def __init__(self):     # constructor
            super(Net, self).__init__()     # calling parent class
            self.layer1 = nn.Linear (10, 5)
            self.layer2 = nn.Linear (5, 2)

        def forward (self, x):      # we propagate inputs through layers
            x = F.relu (self.layer1 (x))   # F is equivalent to torch.nn.functional ... if seems 
            x = self.layer2 (x)            # pass result to next layewr
            return x

    # Instantiate Net 
    net = Net()
    model = nn.Flatten(net)  ## will flatten from dimension 1
    print("\nFlattened: \n", model, "\n As is: \n", net)
###############################################
def test3():

    from torch.utils.data import DataLoader

    # Vision Data sets will be used in this example
    from torchvision import datasets
    from torchvision.transforms import ToTensor

    #Let us get two sets of data, one for training
    # and other for testing
    # Data will be downloaded form NIST if it wasn't already downloaded

    trainData = datasets.FashionMNIST (
                root = "data",   # saves in ./data directory
                train = True,
                download = True,
                transform = ToTensor ()  
                )

    testData = datasets.FashionMNIST (
                root = "data",   # saves in ./data directory
                train = False,
                download = True,
                transform = ToTensor ()  
                )

    #  Take a subset of data for our runs (with each base containing 64 data)
    size = 64
    trainLoader = DataLoader (trainData, batch_size = size)
    testLoader = DataLoader (testData, batch_size = size)

    # Loop through testData (y is 1D vector, X is a tensor)
    # size of y is 64, and X (64, ., .,. .)
    for X, y in testLoader:
        print (f"Shape of X [N, C, H, W]: {X.shape}")
        print (f"Shape of y : {y.shape}")
        break


    #Setup the neural Network

    #  device used for nn
    #print("cuda: ",  torch.cuda.is_available())
    #print("mps: ", torch.backends.mps.is_available())
    # I see that on iMac I have mps
    device = "mps"

    # Define model
    class NeuralNetwork (nn.Module):
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


    # note that we dont pass any module to the nn class
    # Instantiate the model and print
    model = NeuralNetwork().to(device)  
    print(model)

    #With 

    lossFn = nn.CrossEntropyLoss()   # need to know what this is

    #Configure optimiser (using Steepest gradient 
    optimiser = torch.optim.SGD (model.parameters(), lr=1e-3)

    # Training method
    def train (dataLoader, model, lossFn, optimiser):

        print("trnSet From test3: ", len (dataLoader.dataset))
        model.train()

        #Loop through all batches of data
        xp = [] ; yp = []
        for batch, (X, y) in enumerate (dataLoader):
            X, y = X.to (device), y.to (device)  # transfer data to device

            # predict (calculate y from network)
            pred = model (X)
            loss = lossFn (pred, y)

            # backpropagate
            loss.backward ()   # back propagate all derivatives?
            optimiser.step ()
            optimiser.zero_grad ()  # what does this do

            # Print every 100 points ?
            size = len (dataLoader.dataset)

            if batch % 100 == 0:
                loss, current = loss.item(), (batch + 1) * len (X)
                print (f"loss: {loss:>7f} [{current:>5d} / {size:>5d}]")
                xp.append (current)
                yp.append (loss)

        return ({"xp": xp, "yp": yp})
    #   End of Train Method

    # Testing method 
    def test (dataLoader, model, lossFn):
        size = len (dataLoader.dataset) 
        nb = len (dataLoader) 
        model.eval ()
        loss, correct = 0, 0
        with torch.no_grad() :
            for X, y in dataLoader:
                X, y = X.to (device), y.to (device)
                pred = model (X)
                loss +=  lossFn (pred, y).item()
                # What a cryptic coding
                correct += (pred.argmax(1) == y).type(torch.float).sum().item() 
            loss /= nb
            correct /= size
            print(f"Test Error: \n Accuracy: {(100*correct):>0.1f}%, Avg loss: {loss:>8f} \n")

    plt.ion() 
    plt.xlabel("data count") ; plt.ylabel("loss")
    plt.grid() 
    fig = plt.figure() ;
    for t in range(5):
        print ("trnDataSize", len(trainLoader.dataset))
        data = train(trainLoader, model, lossFn, optimiser)
        test(testLoader, model, lossFn)
        plt.plot (data["xp"], data["yp"], '-o')  ; plt.grid()
        plt.draw ()
        plt.pause(3)
    #################    end test3 ##################################

def flatten():
    # How torch flattens array

    import torch
    from torch import nn
    from torch.utils.data import DataLoader

    data = torch.tensor([[[1, 2, 10], [3, 4, 12]], 
                         [[5, 6, 56], [7, 8, 78]],
                         [[15, 16, 56], [17, 18, 8]]
                        ])

    f = torch.flatten(data,1) ;
    ff = torch.flatten(data,0) ;
    print(f'- Original data - \n{data}\n')
    print(f'- Flatten \n{ff}')
#################   flatten  ##################################

def showData():
    # How to see the image data we pulled in

    from torch.utils.data import DataLoader

    # Vision Data sets will be used in this example
    from torchvision import datasets
    from torchvision.transforms import ToTensor

    #Let us get two sets of data, one for training
    # and other for testing
    # Data will be downloaded form NIST if it wasn't already downloaded

    trainData = datasets.FashionMNIST (
                root = "data",   # saves in ./data directory
                train = True,
                download = True,
                transform = ToTensor ()  
                )
    dataset = DataLoader (trainData, batch_size = 100).dataset
    n = len(dataset)
    fig = plt.figure(figsize=(7,7)) ## what this size represent? 

    labels_map = {
        0: "T-Shirt",
        1: "Trouser",
        2: "Pullover",
        3: "Dress",
        4: "Coat",
        5: "Sandal",
        6: "Shirt",
        7: "Sneaker",
        8: "Bag",
        9: "Ankle Boot"
    }
    for i in range(9):
        idx = torch.randint( len(dataset), size=(1,)).item()
        img, label = dataset[idx]
        fig.add_subplot(3, 3, i+1)
        plt.title(labels_map[label])
        plt.axis("off")
        plt.imshow(img.squeeze(), cmap="gray")
    plt.show()
    print(i)
