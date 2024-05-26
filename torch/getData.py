def getData (bSize):

#  Gets bSize chunks of data for
#   for training and testing

    from torch.utils.data import DataLoader
    from torchvision import datasets
    from torchvision.transforms import ToTensor

    # Data will be downloaded form NIST if it wasn't already downloaded
    # Using FashionMNIST

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

    #  Divvy up data into bSize chunks and return as iterable set
    tstData = DataLoader (trainData, batch_size = bSize)
    trnData = DataLoader (testData, batch_size = bSize)
    return (trnData, tstData)

