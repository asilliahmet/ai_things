import keras
import tensorflow as tf
import pickle
from keras import layers
import tensorflowjs as tfjs

def makeModel(layerLens = [0]):
    # input-> array of ints
    # first int will be treated as input length
    # last int will be treated as output length
    # other ints will be treated as hidden layers
    # output-> keras neural model
    inputs = None
    currentLayer = None
    for i in range(len(layerLens)):
        if (i == 0):
            currentLayer = keras.Input(shape=(layerLens[0],),dtype="float32")
            # create inputs from the first int
            # capture it in currentlayer to chain it to other layers

            inputs = currentLayer
            # capture the layer
            
            continue

        if (i == len(layerLens)-1):
            currentLayer = layers.Dense(layerLens[i])(currentLayer)
            # create outputs from the last int
            # currentLayer immidiately outside the loop is the output layer anyway
            break

        currentLayer = layers.Dense(layerLens[i], activation="relu")(currentLayer)
        # create hidden layer, capture it in currentlayer to chain it to other layers

    model = keras.Model(inputs=inputs, outputs=currentLayer, name="thingmabobbits")
    # make keras model using captured inputs and outputs

    model.summary()
    return model
    # post a summary and return


def main() -> None:
    # total MNIST size is 70000, these numbers were on the example
    dev_size = 60000
    test_size = 10000

    # MNIST is loaded as float32, divided by 255 (rgbsinglechannel -> 1-0 float)
    # (in_dev, out_dev), (in_test, out_test) = keras.datasets.mnist.load_data()

    with open('./mnistFile.bin', 'rb') as f:
        mnistDatabase = pickle.load(f)

    (in_dev, out_dev), (in_test, out_test) = mnistDatabase

    in_dev = in_dev.reshape(dev_size, 784).astype("float32") / 255 
    in_test = in_test.reshape(test_size, 784).astype("float32") / 255

    # keras model is created, this is just a personal syntactic sugar function
    myModel = makeModel([784, 64, 64, 10])

    # model is compiled using the parameters below.
    # official example used rmsprop, while debugging the tflite conversion process i stumbled upon nadam
    # increased the accuracy a bit so nadam is chosen 
    myModel.compile(
        loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True),
        optimizer=keras.optimizers.Nadam(),
        metrics=[keras.metrics.SparseCategoricalAccuracy()],
    )

    # model is trained, evaluated and the results are posted
    trainLogs = myModel.fit(in_dev, out_dev, batch_size=64, epochs=2, validation_split=0.2)
    test_scores = myModel.evaluate(in_test, out_test, verbose=2)
    print("loss:", test_scores[0], "\naccuracy:", test_scores[1], "\nversion:", tf.__version__)

    myModel.save("./myModel.keras")
    del myModel

main()