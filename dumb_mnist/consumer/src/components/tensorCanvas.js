import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
// import * as tf from "@tensorflow/tfjs-core"
import * as tf from "@tensorflow/tfjs"

const canvasConfig = {
    canvasBBox: new DOMRect(),
    nnBrush: "imagedata",
    brushDim: 20,
};

const tensorChk = (name = "example", ar = [])=>{
    let result = 0;

    for (let i=0; i<ar.length; i++) {
        if (typeof ar[i] == 'object') {
            result += tensorChk("r", ar[i]);
            continue;
        }
        if (+ar[i] == ar[i]) {
            result+= ar[i];
            continue;
        }
        console.warn("wtf");
    }

    if (name != "r") {
        console.log(name, result, "array sanity check");
    }

    return result;
};

const makeAr = (len,fill=0)=>{
    let retAr = [];
    for (let i=0; i<len; i++) retAr.push(fill);
    return ([...retAr]);
};

const TensorCanvas = forwardRef((props = {
    onDraw: (tensor = tf.ones(1))=>{console.log(tensor)},
}, ref) => {
    // drawable, tensor-generating canvas
    // default draw function is b&w

    // props.ondraw = (tensor)=>{};

    const canvasRef = useRef(null);
    let context;

    const saveBBox = ()=>{
        canvasConfig.canvasBBox = canvasRef.current.getBoundingClientRect();
    };

    const pencilMode = ()=>{
        let dim = canvasConfig.brushDim;
        const dataArray = new Uint8ClampedArray(dim*dim*4);
        for (let i = 0; i < dataArray.length; i += 4) {
            dataArray[i + 0] = 0; // R value
            dataArray[i + 1] = 0; // G value
            dataArray[i + 2] = 0; // B value
            dataArray[i + 3] = 255; // A value
          }
        canvasConfig.nnBrush = new ImageData(dataArray, dim, dim);
    };

    const eraserMode = ()=>{
        let dim = canvasConfig.brushDim;
        const dataArray = new Uint8ClampedArray(dim*dim*4);
        for (let i = 0; i < dataArray.length; i += 4) {
            dataArray[i + 0] = 255; // R value
            dataArray[i + 1] = 255; // G value
            dataArray[i + 2] = 255; // B value
            dataArray[i + 3] = 255; // A value
          }
        canvasConfig.nnBrush = new ImageData(dataArray, dim, dim);
    };

    const draw = async (event = new TouchEvent())=>{
        
        const touchLen = event.touches.length;
        const avgTouch = {
            x: 0,
            y:0,
        };
        [...event.touches].map((touch)=>{
            avgTouch.x += touch.clientX;
            avgTouch.y += touch.clientY;
        });
        avgTouch.x /= touchLen;
        avgTouch.y /= touchLen;

        avgTouch.x -= canvasConfig.canvasBBox.x;
        avgTouch.y -= canvasConfig.canvasBBox.y;
        //canvasConfig.canvasBBox stores the bounding box of the canvas. recalculates on load and resize

        if (!avgTouch.x || !avgTouch.y) return;
        context.putImageData(canvasConfig.nnBrush, avgTouch.x, avgTouch.y);
        //canvasConfig.nnBrush is a 10 by 10 black square. i know the above line works because i can paint on the canvas and see it working

        let scaler = new OffscreenCanvas(28,28);
        let scalerCtx = scaler.getContext("2d");
        scalerCtx.drawImage(canvasRef.current, 0,0,28,28);

        const flatSingle = []; //she got no titties and no boyfriend. very unfortunate
        // const shapedSingle = new Array(28).fill(...new Array(28).fill(0)); //for human readibility. no production
        // const shapedSingle = makeAr(28).map(x => makeAr(28));

        // console.log(shapedSingle);

        let scalerData = scalerCtx.getImageData(0,0,28,28).data;

        // console.log(scalerData.length); //why is this zero though

        /*scaler.convertToBlob().then((blob)=>{

            let reader = new FileReader();
            reader.onload = ()=>{
                console.log(reader.result);
            };
            reader.readAsDataURL(blob);
        }); */
        //i checked my offscreencanvas like this, pixels are fine.
        // i think i am making a mistake with data types    

        for (let i=0; i<scalerData.length; i+= 4) {
            // let pixelno = i/4;
            // shapedSingle[Math.floor(pixelno / 28)][pixelno % 28] = scalerData[i+3]/255;
            flatSingle.push(scalerData[i+3]/255);
        }

        // props.onDraw(shapedSingle);
        props.onDraw(flatSingle);
    };

    useEffect(()=>{
         saveBBox();
        // canvasConfig.nnBrush = makennBrush();
        pencilMode();

        context = canvasRef.current.getContext("2d", { willReadFrequently: true } );

        const touchEvent = (event)=>{draw(event)}

        canvasRef.current.addEventListener("touchend", touchEvent);
        canvasRef.current.addEventListener("touchstart", touchEvent);
        canvasRef.current.addEventListener("touchmove", touchEvent);

        window.addEventListener("resize", saveBBox);

        console.log(canvasConfig);

        return ()=>{
            canvasRef.current.removeEventListener("touchend", touchEvent);
            canvasRef.current.removeEventListener("touchstart", touchEvent);
            canvasRef.current.removeEventListener("touchmove", touchEvent);
            window.removeEventListener("resize", saveBBox);
        };


    },[]);


    useImperativeHandle(ref, () => {
        return {
            pencilMode: ()=>{pencilMode()},
            eraserMode: ()=>{eraserMode()},
            clearCanavs: ()=>{},
            
        };
    }, []);



  return <canvas id='mainThing' width={300} height={300}  ref={canvasRef}  />;
});





export default TensorCanvas;