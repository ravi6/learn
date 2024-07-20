def train (model, data, lossFn, optimiser) :
# Training the model with given data
# returns prediction samples (every 100th test data point)

    device = "mps"
    model.train()   ## puts model in train state (does not train)
                    # what a confusing naming convention

    #Loop through all batches of data
    xp = [] ; yp = []
    for batch, (X, y) in enumerate (data):
        X, y = X.to (device), y.to (device)  # transfer data to device

        # predict (calculate y from network)
        pred = model (X)
        loss = lossFn (pred, y)

        # backpropagate
        loss.backward ()   # back propagate all derivatives?
        optimiser.step ()
        optimiser.zero_grad ()  # what does this do

        Tsize = len (data.dataset)  # Weirdly this is all of the data
        nb   = len (data)   #  this is =  Tsize / bSize (rounded to nint)

        if batch % 100 == 0:
            loss, current = loss.item(), (batch + 1) * len (X)
            print (f"loss: {loss:>7f} [{current:>5d} / {Tsize:>5d}]")
            xp.append (current)
            yp.append (loss)
        
    return ({"xp": xp, "yp": yp})
