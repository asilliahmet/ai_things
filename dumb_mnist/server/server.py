from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import keras
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/sessionready', methods=['POST'])
def session_ready():
    global model
    model = keras.models.load_model("./myModel.keras")
    print("load succesful", model)
    # it turns out saving it as a keras file removes the need to compile or anything, you just load and use it
    return jsonify({"message": "ai model Ready"})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json["data"]  # Assuming data is sent as JSON
    # print("data received", request, data["data"])

    # print(type(data), type(json.loads(data)))

    dataList = json.loads(data)

    numpyBoi = np.array(dataList, dtype=np.float32).reshape((1,784))

    
    # above line gives the below error:
    # ValueError: could not convert string to float: 
    # print(numpyBoi.shape)  # all right this things shape prints (784,) how do i make it work with my ai
    numpyResult = model.predict(numpyBoi)

    sendString = json.dumps(numpyResult.tolist())
    

    return jsonify({"result:": sendString})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  