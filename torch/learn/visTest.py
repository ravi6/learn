def visTest (data):
    # Visually test the nn

    n = len(data)
    fig = plt.figure(figsize=(7,7)) ## what this size represent? 

    labels_map = {
        0: "T-Shirt", 1: "Trouser", 2: "Pullover",
        3: "Dress", 4: "Coat", 5: "Sandal",
        6: "Shirt", 7: "Sneaker", 8: "Bag",
        9: "Ankle Boot"
    }
    for i in range(9):
        idx = torch.randint( len(data), size=(1,)).item()
        img, label = data[idx]
        fig.add_subplot(3, 3, i+1)
        plt.title(labels_map[label])
        plt.axis("off")
        plt.imshow(img.squeeze(), cmap="gray")
    plt.show()
