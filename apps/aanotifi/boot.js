Bangle.on('notification', event=>{
  require('buzz').pattern('::');
  require('aanotifi.app.js').pushMessage(event);
});
