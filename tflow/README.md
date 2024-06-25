*** Exploring neural networks with Tensorflow.js

* Usage Notes:

MNIST data sets are not included in the repository.
(nb. data directory is ignored by this git repository)

Please download fashion MNIST data set in csv format from
https://www.kaggle.com/datasets/zalando-research/fashionmnist
and rename files as "train.csv" and "test.csv" and place them
under "data" directory.

Use a simple local webserver of your choice to serve out the files
If "Trained" switch is selected, the porogram assumes that there is
a saved state of the model in the browser persitent database.

At this stage many of parameters like 
data set size to use,
names of the database files (saved state),
batch size,
epoch size are all in the fashion class constructor.

Summary button provides the details of the network model details in the
logger window.

Some observations on Tensorflow.js
   -  Once a dataSet is created with a certain batch size with ".batch(n)" method, 
      batch size is not altered with subsequent updates with .batch method.
      Had to reload the data from files again.
   -  Using .take(n)  method on dataSet takes n batches not n items
   -  Many of the methods are asynchronous ... so most methos endup as "async"
      with lots of "await" instructions to force synchronous execution.
   -  Unlike in "pytorch"  input data is not scaled. User should ensure scaling if
      proper convergence is desired. There are helper functions to ease that process
      but this was realised after the fact.
   -  Model training and prediction performance monitoring graphically was a breeze.

 
