// ElectronFactory

const uniqid = require('uniqid');
const Electron = require('./Electron.js')

const ElectronFactory = (orbital) => {
    return  {
        _id: uniqid(),
        orbital: orbital
    }
}

module.exports = ElectronFactory 
