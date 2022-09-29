exports.pushMessage = function(event) {
  var settings = require('Storage').readJSON("messnot.settings.json", true) || {};
  if (settings.vibrate === undefined) { settings.vibrate = ":"; } // pattern may be "", so we can't use || ":" here
  settings.quiet = ((require('Storage').readJSON('setting.json',1)||{}).quiet);
  if (event.id == 'music') { 
    Bangle.emit('music', event); 
    return;
  } 
  if (event.id == 'call') {
    Bangle.emit('call', event);
    return;
  }
  // it's a message
  if (event.t == 'remove') {
    require('notify').hide(event);
  } else { // add or modify
    require('notify').show(event);
    if (!settings.quiet) require("buzz").pattern(settings.vibrate);
  }
};
