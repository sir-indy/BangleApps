// GB({"t":"notify","id":1575479849,"src":"Hangouts","title":"A Name","body":"Hello I am a long message wobble wobble wobble flamingo temperature diskette Hello I am a long message wobble wobble wobble flamingo temperature diskette"})

exports.pushMessage = function(msg) {
  console.log(msg);

  //var msg = {
  //  id:123456,
  //  src:'',
  //  title:'Message Title', 
  //  subject:'Subject',
  //  body:'Hello I am a long message wobble wobble wobble flamingo temperature diskette',
  //  sender:'Sender',
  //  tel:'0123456789',
  //  new:true // not read yet
  //};

  var bodyFont = '12x20';
  g.setFont(bodyFont);
  var x_pad = 0, y_pad = 0;
  var timeout;

  var lines = [];
  lines = g.wrapString(msg.title||'', g.getWidth()-x_pad);
  var titleCnt = lines.length;

  lines = lines.concat(
    g.wrapString(msg.subject, g.getWidth()-x_pad),
    g.wrapString(msg.body, g.getWidth()-x_pad)
  );

  var max_height = lines.length * 20;
  print('MAX_HEIGHT', max_height);

  lines = lines.join('\n');

  var img = Graphics.createArrayBuffer(g.getWidth(), max_height, 8)
    .setColor(g.theme.bg2)
    .fillRect(0, 0, g.getWidth(), 20 * titleCnt)
    .setColor(g.theme.fg)
    .setFont('12x20')
    .setBgColor(g.theme.bg)
    .drawString(lines);

  var y_pos = 0;

  console.log('OVERLAY MESSAGE');
  Bangle.setLCDOverlay(img, 0, y_pos);
  Bangle.setLocked(0);
  timeout = setTimeout(function() {clearMessage('timeout');}, 1000*60);

  function clearMessage(trigger) {
    console.log('CLEAR', trigger);
    Bangle.setLCDOverlay();
    //Bangle.removeListener("tap", clearMessage);
    Bangle.removeListener("drag", onDrag);
    clearTimeout(timeout);
  }
  
  function onDrag(e) {
    console.log(e, y_pos);
    y_pos += e.dy;
    Bangle.setLCDOverlay(img, 0, y_pos);
  }

  //Bangle.on('tap', function(data) {clearMessage('tap');});
  //Bangle.on('tap', clearMessage);
  Bangle.on('drag', onDrag);
  
};
