const { assert } = require('chai')

module.exports = ({ device, command, duration, log, name, debug }) => {
  assert(command, `\x1b[31m[CONFIG ERROR]: \x1b[0m${name} (\x1b[33mcommand\x1b[0m is missing)`);

  log(`${name} sendCommand (\x1b[33m${command}\x1b[0m)`);

  var usePage, usage;
  switch (command) {
    case "up":
      usePage = 1;
	  usage = 0x8C;
    case "down":
      usePage = 1;
	  usage = 0x8D;
    case "left":
      usePage = 1;
	  usage = 0x8B;
    case "right":
      usePage = 1;
	  usage = 0x8A;
    case "menu":
      usePage = 1;
	  usage = 0x86;
    case "play":
      usePage = 12;
	  usage = 0xB0;
    case "pause":
      usePage = 12;
	  usage = 0xB1;
    case "next":
      usePage = 12;
	  usage = 0xB5;
    case "previous":
      usePage = 12;
	  usage = 0xB6;
    case "sleep":
    case "suspend":
    case "wake":
      usePage = 1;
	  usage = 0x82;
    case "stop":
      usePage = 12;
	  usage = 0xB7;
    case "select":
      usePage = 1;
	  usage = 0x89;
    case "top_menu":
    case "tv":
      usePage = 12;
	  usage = 0x60;
    case "siri":
    case "mic":
      usePage = 12;
	  usage = 0x04;
    default: {
      log(`\x1b[31m[ERROR]: \x1b[0m${name} sendCommand (\x1b[33m${command}\x1b[0m is not a valid command)`);
    }
  }
  
  if (duration == undefined || duration <= 0) {
      return sendKeyPressAndRelease(usePage, usage);
  }
  
  return sendKeyPress(usePage, usage, true).then((resolve, reject) => {
      return sendKeyPress(usePage, usage, false)
  });
}
