var y_pos;
var id;
var img;
var hideCallback;
var max_scroll;
var timeout;
var settings;

exports.loadSettings = function() {
  settings = require('Storage').readJSON('notifyover.settings.json', true) || {font: '12x20'};
};
exports.loadSettings();

function onDrag(e) {
  y_pos += e.dy;
  if (max_scroll > 0) {
    y_pos = E.clip(y_pos, 0, max_scroll);
    Bangle.setLCDOverlay(img, 0, y_pos);
  } else {
    y_pos = E.clip(y_pos, max_scroll, 0);
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
  id = ('id' in options)?options.id:null;

  if (options.on) { 
    Bangle.setLocked(false);
    Bangle.setLCDBrightness(1);
  }
  
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
