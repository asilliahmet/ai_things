import keras
import tensorflow as tf
from keras import layers
import pickle

def main():
    mnist = keras.datasets.mnist.load_data()

    with open('./mnistFile.bin', 'wb') as f:
        pickle.dump(mnist, f)

main()



# all right is is challenging as you said. so now my approach will be: 
# load the mnist dataset using a seperate file. after running pip install tensorflow==2.14.0
# this is that seperate file. i need to write this mnist variable to a file called ./mnistFile
# then i switch back to an old tensorflow. old tensorflow versions does not have the datasets attribute
# so i just read the datasets from the file ./mnistFile and avoid having to use two different tf versions