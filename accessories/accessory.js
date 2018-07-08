const uuid = require('uuid');

const { HomebridgeAccessory } = require('homebridge-platform-helper');

const sendCommand = require('../helpers/sendCommand');
const delayForDuration = require('../helpers/delayForDuration');
const catchDelayCancelError = require('../helpers/catchDelayCancelError');

class AppleTVAccessory extends HomebridgeAccessory {

  constructor (log, config = {}, serviceManagerType) {
    if (!config.name) config.name = "Unknown Accessory"

    super(log, config, serviceManagerType);
    if (config.debug) this.debug = true

    this.manufacturer = 'Apple';
    this.model = 'Apple TV';
    this.serialNumber = uuid.v4();
  }

  reset () {
    // Clear Multi-command timeouts
    if (this.intervalTimeoutPromise) {
      this.intervalTimeoutPromise.cancel();
      this.intervalTimeoutPromise = null;
    }

    if (this.pauseTimeoutPromise) {
      this.pauseTimeoutPromise.cancel();
      this.pauseTimeoutPromise = null;
    }
  }
  
  performSend (command, hold) {
    const { debug, device, config, log, name } = this;

    if (typeof command === 'string') {
      return sendCommand({ device, command, duration: hold, log, name, debug });
    }
    
    const that = this;
    
    var promise = Promise.resolve();
    
    // Iterate through each command config in the array
    for (let index = 0; index < command.length; index++) {
      const currentCommand = command[index];
      let pause = 0.5;
      
      if (typeof currentCommand === 'string') {
        promise = promise.then(() => {
          return sendCommand({ device, command: currentCommand, duration: hold, log, name, debug });  
        });
      } else {
        promise = promise.then(() => {
          return that.performRepeatSend(currentCommand);
        });
        
        if (currentCommand.pause) {
          pause = currentCommand.pause;
        }
      }
      
      // Add a pause if this isn't the last command
      if (index < command.length - 1) {
        promise = promise.then(() => {
          return delayForDuration(pause);
        });
      }      
    }
    
    return promise;
  }

  performRepeatSend (parentData) {
    const { host, log, name, debug } = this;
    let { command, interval, repeat, hold } = parentData;

    repeat = repeat || 1
    if (repeat > 1) interval = interval || 0.5;

    var promise =  Promise.resolve();
    
    // Iterate through each command config in the array
    for (let index = 0; index < repeat; index++) {
      promise = promise.then(() => {
        this.performSend(command, hold);
      });

      if (interval && index < repeat - 1) {
        promise = promise.then(() => {
          return delayForDuration(interval);
        });
      }
    }
    
    return promise;
  }
}

module.exports = AppleTVAccessory;
