exports.pushMessage = function(event) {
  var settings = require('Storage').readJSON("messnot.settings.json", true) || {};
  settings.quiet = ((require('Storage').readJSON('setting.json',1)||{}).quiet);
  if (event.id == 'music') {
    Bangle.emit('music', event)
  } else if (event.id == 'call') {
    Bangle.emit('call', event)
  } else { // it's a message
    switch(event.t) {
      case "add":
        require('notify').show(event);
        if (settings.pattern === undefined) { settings.pattern = ":"; } // pattern may be "", so we can't use || ":" here
        if (!settings.quiet) require("buzz").pattern(settings.pattern);
        break;    
      case "remove":
        require('notify').hide(event);
        break;
      case "modify":
        // do nothing
        break;  
    }
  }
}