## Author: Ravi Saripalli

import matplotlib.pyplot as plt
import torch

def visTest (model, data):
    # Visually test the nn
    device = "mps"
    n = len(data)
    fig = plt.figure(figsize=(8,8)) ## what this size represent? 
    fig.suptitle ("Visual Check of my Model Accuracy")

    labels_map = {
        0: "T-Shirt", 1: "Trouser", 2: "Pullover",
        3: "Dress", 4: "Coat", 5: "Sandal",
        6: "Shirt", 7: "Sneaker", 8: "Bag",
        9: "Ankle Boot"
    }

    ## Randomly check nine test cases to see how the
    #  the model behaves 
    for i in range(9):
        ## pick a random sample from entire dataset
        idx = torch.randint( len(data.dataset), size=(1,)).item()
        img, label = data.dataset[idx] # here img is X and label is y
        X = img.flatten(1).to(device) # Convert to one dimensional Tensor
        ypred = model (X)
        yp = torch.argmax(ypred, dim=1)[0].item()  # gets the category from logits
        print("Ypreditcte = ", yp) 
        fig.add_subplot(3, 3, i+1)
        plt.title(labels_map[yp] + "(" +  labels_map[label] + ")")
        plt.axis("off")
        plt.imshow(img.squeeze(), cmap="gray")
    plt.show()
