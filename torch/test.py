import torch

def test (model, data, lossFn):
    #Test the model with given data and lossFunction

    device = "mps"
    size = len (data.dataset) 
    nb = len (data) 
    model.eval ()
    loss, correct = 0, 0

    with torch.no_grad() :  ## what is it ??
        for X, y in data:
            X, y = X.to (device), y.to (device)
            pred = model (X)
            loss +=  lossFn (pred, y).item()

            # What a cryptic coding
            correct += (pred.argmax(1) == y).type(torch.float).sum().item() 
        loss /= nb
        correct /= size
        print(f"Test Error: \n Accuracy: {(100*correct):>0.1f}%, Avg loss: {loss:>8f} \n")
