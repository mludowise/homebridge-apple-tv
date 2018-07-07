const { assert } = require('chai')
const delayForDuration = require('../helpers/delayForDuration');

module.exports = ({ device, command, duration, log, name, debug }) => {
  assert(command, `\x1b[31m[CONFIG ERROR]: \x1b[0m${name} (\x1b[33mcommand\x1b[0m is missing)`);

  log(`${name} sendCommand (\x1b[33m${command}\x1b[0m)`);

  var usePage, usage;
  switch (command) {
    case "up":
      usePage = 1;
	  usage = 0x8C;
      break;
    case "down":
      usePage = 1;
	  usage = 0x8D;
      break;
    case "left":
      usePage = 1;
	  usage = 0x8B;
      break;
    case "right":
      usePage = 1;
	  usage = 0x8A;
      break;
    case "menu":
      usePage = 1;
	  usage = 0x86;
      break;
    case "play":
      usePage = 12;
	  usage = 0xB0;
      break;
    case "pause":
      usePage = 12;
	  usage = 0xB1;
      break;
    case "next":
      usePage = 12;
	  usage = 0xB5;
      break;
    case "previous":
      usePage = 12;
	  usage = 0xB6;
      break;
    case "sleep":
    case "suspend":
    case "wake":
      usePage = 1;
	  usage = 0x82;
      break;
    case "stop":
      usePage = 12;
	  usage = 0xB7;
      break;
    case "select":
      usePage = 1;
	  usage = 0x89;
      break;
    case "top_menu":
    case "tv":
      usePage = 12;
	  usage = 0x60;
      break;
    case "siri":
    case "mic":
      usePage = 12;
	  usage = 0x04;
      break;
    default: {
      log(`\x1b[31m[ERROR]: \x1b[0m${name} sendCommand (\x1b[33m${command}\x1b[0m is not a valid command)`);
    }
  }
  
  if (duration == undefined || duration <= 0) {
      return device.sendKeyPressAndRelease(usePage, usage);
  }
  
  return device.sendKeyPress(usePage, usage, true).then(() => {
      return delayForDuration(duration);
  }).then(() => {
      return device.sendKeyPress(usePage, usage, false)
  });
}
