# Training method
def train (self, model, lossFn, optimiser) :

    model.train()

    #Loop through all batches of data
    xp = [] ; yp = []
    for batch, (X, y) in enumerate (self.trainData):
        X, y = X.to (self.device), y.to (self.device)  # transfer data to device

        # predict (calculate y from network)
        pred = model (X)
        loss = lossFn (pred, y)

        # backpropagate
        loss.backward ()   # back propagate all derivatives?
        optimiser.step ()
        optimiser.zero_grad ()  # what does this do

        # Print every 100 points ?
        size = len (data.dataset)

        if batch % 100 == 0:
            loss, current = loss.item(), (batch + 1) * len (X)
            print (f"loss: {loss:>7f} [{current:>5d} / {size:>5d}]")
            xp.append (current)
            yp.append (loss)

    return ({"xp": xp, "yp": yp})
