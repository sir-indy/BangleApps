/**

GB({'t':'notify','id':1575479849,'src':'Hangouts','title':'A Name','body':'Hello I am a long message wobble wobble wobble flamingo temperature diskette Hello I am a long message wobble wobble wobble flamingo temperature diskette'})

GB({'t':'notify','id':4876532554,'src':'Whatsapp','title':'A Name','body':'Short Message', 'subject':'Short Subject'})

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

var y_pos;
var id;
var img;
var hideCallback;
var max_scroll;
var timeout;
var temp_img = Graphics.createArrayBuffer(g.getWidth(), g.getHeight(), 8);
var settings;

exports.loadSettings = function() {
  settings = require('Storage').readJSON('notifyover.settings.json', true) || {font: 'Vector19'};
}
exports.loadSettings();

function onDrag(e) {
  y_pos += e.dy;
  if (max_scroll > 0) {
    y_pos = E.clip(y_pos, 0, max_scroll);
    Bangle.setLCDOverlay(img, 0, y_pos);
  } else {
    //TODO: Replace this when setLCDOverlay negative position fixed
    y_pos = E.clip(y_pos, max_scroll, 0);
    temp_img.drawImage(img, 0, y_pos);
    Bangle.setLCDOverlay(temp_img, 0, 0);
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
  id = ('id' in options)?options.id:null;

  if (options.on) { Bangle.setLocked(false); }
  
  var bodyFont = settings.font;
  var pad_rect = 8, pad_lines = 12;
  var lines = [];
  g.setFont(bodyFont);

  lines = g.wrapString(options.title||'', g.getWidth()-pad_lines);
  var titleCnt = lines.length;

  lines = lines.concat(
    g.wrapString(options.body, g.getWidth()-pad_lines)
  );

  var max_height = lines.length * g.getFontHeight() + pad_lines;
  max_scroll = g.getHeight() - max_height;

  lines = lines.join('\n');
  var title_height = g.getFontHeight() * titleCnt;
  
  img = Graphics.createArrayBuffer(g.getWidth(), max_height, 8)
    .setColor(g.theme.bgH)
    .fillRect({x:0, y:0, x2:g.getWidth(), y2:max_height, r:pad_rect/2})
    .setColor(g.theme.bg)
    .fillRect({x:pad_rect/2, y:title_height + pad_rect/2, x2:g.getWidth() - pad_rect/2, y2:max_height - pad_rect/2, r:pad_rect/2})
    .setColor(g.theme.fg)
    .setFont(bodyFont)
    .setBgColor(g.theme.bg)
    .setFontAlign(0, -1)
    .drawString(lines, g.getWidth()/2, pad_lines/2);

  y_pos = 0;
  Bangle.setLCDOverlay(img, 0, y_pos);
  timeout = setTimeout(exports.hide, 1000*60);

  Bangle.on('swipe', onSwipe);
  Bangle.on('drag', onDrag);

};

exports.hide = function(options) {
  options = options||{};
  if ('id' in options && options.id!==id) return;
  if (hideCallback) hideCallback({id:id});
  hideCallback = undefined;
  Bangle.setLCDOverlay();
  Bangle.removeListener('drag', onDrag);
  Bangle.removeListener('swipe', onSwipe);
  clearTimeout(timeout);
};
