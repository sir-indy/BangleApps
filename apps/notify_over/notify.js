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
var temp_img = Graphics.createArrayBuffer(g.getWidth(), g.getHeight(), 8, {msb:true});
var settings;

exports.loadSettings = function() {
  settings = require('Storage').readJSON('notifyover.settings.json', true) || {font: '12x20'};
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
  var pad = {'rect':6, 'lines':10};
  var r = {'outer':pad.lines, 'inner':pad.lines - pad.rect/2};
  //var lines = [];
  g.setFont(bodyFont);
  
  var title = g.wrapString(options.title||'', g.getWidth()-pad.lines);
  var lines = g.wrapString(options.body, g.getWidth()-pad.lines);
  
  var source_height = 8+4;
  var title_height = g.getFontHeight() * title.length + pad.lines/2 + source_height;
  var lines_height = g.getFontHeight() * lines.length + pad.lines;

  var max_height = title_height + lines_height + pad.rect/2;
  max_scroll = g.getHeight() - max_height;

  img = Graphics.createArrayBuffer(g.getWidth(), max_height, 8, {msb:true})
    .setColor(g.theme.bgH)
    .fillRect({x:0, y:0, x2:g.getWidth()-1, y2:max_height-1, r:r.outer})
    .setColor(g.theme.bg)
    .fillRect({x:pad.rect/2, y:title_height, x2:g.getWidth() - pad.rect/2-1, y2:max_height - pad.rect/2-1, r:r.inner})
    .setColor(g.theme.fg)
    .setFont(bodyFont)
    .setBgColor(g.theme.bg)
    .setFontAlign(0, -1)
    .drawString(title.join('\n'), g.getWidth()/2, source_height)
    .drawString(lines.join('\n'), g.getWidth()/2, title_height + pad.lines/2)
    .setFont('6x8')
    .drawString(options.src, g.getWidth()/2, 2);

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
