def getData (bSize, trnFlag, sflFlag):

#  Gets bSize chunks of data for
#  if trnFlag is true we get training data
#  else test data is returned

    from torch.utils.data import DataLoader
    from torchvision import datasets
    from torchvision.transforms import ToTensor

    # Data will be downloaded form NIST if it wasn't already downloaded
    # Using FashionMNIST

    Loader = datasets.FashionMNIST (
                root = "data",   # saves in ./data directory
                train = trnFlag,
                download = True,
                transform = ToTensor ()  
                )

    #  Divvy up data into bSize chunks and return as iterable set
    data = DataLoader (Loader, batch_size = bSize, shuffle = sflFlag)
    print (f"Batch: {bSize}, DataSet: {len(data.dataset)} , Data: {len(data)}")
    return (data)

