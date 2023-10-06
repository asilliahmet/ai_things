import * as tflite from "@tensorflow/tfjs-tflite"
import * as tf from "@tensorflow/tfjs-core"

const loadMyShit = async (path)=>{

    const loadedModel = await tflite.loadTFLiteModel("/myChild.tflite");

    console.log(loadedModel);
};

export default loadMyShit;