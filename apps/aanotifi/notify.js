// GB({"t":"notify","id":1575479849,"src":"Hangouts","title":"A Name","body":"Hello I am a long message wobble wobble wobble flamingo temperature diskette Hello I am a long message wobble wobble wobble flamingo temperature diskette"})

/**
 options = {
   on : bool // turn screen on, default true
   size : int // height of notification, default 80 (max)
   title : string // optional title
   id // optional notification ID, used with hide()
   src : string // optional source name
   body : string // optional body text
   icon : string // optional icon (image string)
   render : function(y) // function callback to render
   bgColor : int/string // optional background color (default black)
   titleBgColor : int/string // optional background color for title (default black)
   onHide : function() // callback when notification is hidden
 }
*/

var y_pos = 0;
var id = null;
var img = null;
var hideCallback = undefined;

function onDrag(e) {
  //console.log(e, y_pos);
  y_pos += e.dy;
  Bangle.setLCDOverlay(img, 0, y_pos);
}

exports.show = function(options) {
  options = options || {};
  if (options.on===undefined) options.on = true;
  id = ("id" in options)?options.id:null;
  //console.log(options);

  var bodyFont = '12x20';
  g.setFont(bodyFont);
  var x_pad = 10, y_pad = 10;
  var timeout;

  var lines = [];
  lines = g.wrapString(options.title||'', g.getWidth()-x_pad);
  var titleCnt = lines.length;

  lines = lines.concat(
    g.wrapString(options.body, g.getWidth()-x_pad)
  );

  var max_height = lines.length * 20 + y_pad;
  //console.log('MAX_HEIGHT', max_height);

  lines = lines.join('\n');

  img = Graphics.createArrayBuffer(g.getWidth(), max_height, 8)
    .setColor(g.theme.bg2)
    .fillRect(0, 0, g.getWidth(), 20 * titleCnt)
    .setColor(g.theme.fg)
    .setFont(bodyFont)
    .setBgColor(g.theme.bg)
    .drawString(lines, x_pad/2, y_pad/2);

  //console.log('OVERLAY MESSAGE');
  Bangle.setLCDOverlay(img, 0, y_pos);
  timeout = setTimeout(exports.hide, 1000*60);
  
    //Bangle.on('tap', clearMessage);
  Bangle.on('drag', onDrag);
  
};

exports.hide = function(options) {
  options = options||{};
  if ("id" in options && options.id!==id) return;
  if (hideCallback) hideCallback({id:id});
  hideCallback = undefined;
  Bangle.setLCDOverlay();
  //Bangle.removeListener("tap", clearMessage);
  Bangle.removeListener("drag", onDrag);
  clearTimeout(timeout);
}