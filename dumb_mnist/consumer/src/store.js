import { proxy } from 'valtio'

const state = proxy({

  model: null,
  promptInProgress: false,
  serverReady: false,
  currentResponse: [1,1,1,1,1,1,1,1,1,1,],

})

export { state }
