Bangle.on('notification', event=>{
  require('buzz').pattern('::');
  require('aanotifi').pushMessage(event);
});
