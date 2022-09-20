/**

GB({"t":"notify","id":1575479849,"src":"Hangouts","title":"A Name","body":"Hello I am a long message wobble wobble wobble flamingo temperature diskette Hello I am a long message wobble wobble wobble flamingo temperature diskette"})

GB({"t":"notify","id":4876532554,"src":"Whatsapp","title":"A Name","body":"Short Message", "subject":"Short Subject"})

*/
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

const clampNumber = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));

var y_pos;
var id;
var img;
var hideCallback;
var max_scroll;
var timeout;

function onDrag(e) {
  //console.log(e, y_pos);
  y_pos += e.dy;
  y_pos = clampNumber(y_pos, 0, max_scroll);
  if (max_scroll > 0) {
    Bangle.setLCDOverlay(img, 0, y_pos);
  } else {
    console.log(e, y_pos);
    //img.scroll(0, e.dy);
    Bangle.setLCDOverlay(img, 0, y_pos);
  }
}

function onSwipe(lr, ud) {
  if (lr) {
    exports.hide({'id':id});
  }
}

exports.show = function(options) {
  if (timeout) { exports.hide(); } // clear any existing notification
  options = options || {};
  if (options.on===undefined) options.on = true;
  id = ("id" in options)?options.id:null;
  console.log(options);

  if (options.on) { Bangle.setLocked(false); }

  var bodyFont = 'Vector20'; // 12x20
  g.setFont(bodyFont);
  var x_pad = 10, y_pad = 10;

  var lines = [];
  lines = g.wrapString(options.title||'', g.getWidth()-x_pad);
  var titleCnt = lines.length;

  lines = lines.concat(
    g.wrapString(options.body, g.getWidth()-x_pad)
  );

  var max_height = lines.length * g.getFontHeight() + y_pad;
  max_scroll = g.getHeight() - max_height;
  console.log('MAX_HEIGHT', max_height);
  console.log('SCREEN HEIGHT', g.getHeight());
  console.log('MAX SCROLL', max_scroll);

  lines = lines.join('\n');

  img = Graphics.createArrayBuffer(g.getWidth(), max_height, 8)
    .setColor(g.theme.bg2)
    .fillRect(0, 0, g.getWidth(), g.getFontHeight() * titleCnt + y_pad/2 - 1)
    .setColor(g.theme.fg)
    .setFont(bodyFont)
    .setBgColor(g.theme.bg)
    .setFontAlign(0, -1)
    .drawString(lines, g.getWidth()/2, y_pad/2);

  //console.log('OVERLAY MESSAGE');
  y_pos = 0;
  Bangle.setLCDOverlay(img, 0, y_pos);
  timeout = setTimeout(exports.hide, 1000*60);

  Bangle.on('swipe', onSwipe);
  Bangle.on('drag', onDrag);

};

exports.hide = function(options) {
  options = options||{};
  if ("id" in options && options.id!==id) return;
  if (hideCallback) hideCallback({id:id});
  hideCallback = undefined;
  Bangle.setLCDOverlay();
  Bangle.removeListener('drag', onDrag);
  Bangle.removeListener('swipe', onSwipe);
  clearTimeout(timeout);
};
