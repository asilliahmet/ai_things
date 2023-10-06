import './App.css';
import "./components/icons.css"

import { useEffect, useState } from 'react';

import TensorCanvas from './components/tensorCanvas';
import { useSnapshot } from 'valtio';
import { state } from './store';
import ActivityIndicator from './components/activityIndicator';
import { Spacer } from './components/utilComponents';
import SoftmaxVisualizer from './components/softMaxVisualizer';



{/* <script>window.kerasLocation = "http://localhost:5000/"</script> */}
// reminder this thing in index

const sendPropmt = async (ar = [])=>{
  state.promptInProgress = true;

  const jsondata = JSON.stringify(ar);

  const response = await fetch(window.kerasLocation + "predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({data: jsondata}),
  });

  let prediction = await response.json();

  prediction = JSON.parse(prediction[Object.keys(prediction)[0]]);

  console.log(softMax(prediction[0]));

  state.currentResponse = prediction[0];

  // console.log("result", JSON.parse(prediction["result"]));

  state.promptInProgress = false;
};

const makeReady = ()=>(new Promise(async (resolve, reject)=>{
  let response = await fetch(window.kerasLocation + "sessionready", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
  });
  response = await response.json();
  console.log(response, "makeready server response");
  state.serverReady = true;
  resolve();
}));

const softMax = (ar = [])=>{
  let posar = ar.map( x => x>0 ? x : 0  );

  let sum = posar.reduce((acc,curr)=>(acc+curr), 0);

  posar = posar.map(x => x/sum);

  return posar;
};

function App() {

  const snap = useSnapshot(state);

  useEffect(()=>{
    makeReady();
  }, []);

  return (
    <div className='arAppRoot'>   

    <div className="row aiStatus">
        <Spacer w={11} />
        <ActivityIndicator color='#ffffff' active={true} borderW={3} durationsec={1.2} className="activityIndicator" />
        <Spacer w={25} />
        <div className='aiStatusMsg'>Uyanıyor...</div>
    </div>

    <div className="toolbox row">
      <div className="btn">
        <i className="pencil"></i>
        <div>kalem</div>
      </div>
      <div className="btn">
        <i className="eraser"></i>
        <div>silgi</div>
      </div>
      <div className="btn">
        <i className="clear"></i>
        <div>temizle</div>
      </div>
    </div>


      <div className="row">
          <TensorCanvas
            onDraw={(tensorAr)=>{ 
              if (!state.promptInProgress && state.serverReady){
                sendPropmt(tensorAr)
              } 
            }} 
          />
      </div>
      
      <div className="row">
        <SoftmaxVisualizer 
          ar={snap.currentResponse} 
          color='#000000'
          space={0.8}
          w={300}
          h={60}
        />
      </div>



    </div>
  );
}

export default App;
