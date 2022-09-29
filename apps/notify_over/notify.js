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
  if (max_scroll > 0) { // image smaller than screen
    y_pos = E.clip(y_pos, 0, max_scroll);
    Bangle.setLCDOverlay(img, 0, y_pos);
  } else { // image larger than screen
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

  var pad = {'rect':6, 'lines':10};
  var r = {'outer':pad.lines, 'inner':pad.lines - pad.rect/2};
  g.setFont(settings.font);

  var title = g.wrapString(options.title||'', g.getWidth()-pad.lines);
  var lines = g.wrapString(options.body, g.getWidth()-pad.lines);

  // clip long titles to max 100 pixels
  var max_title_count = Math.floor(100 / g.getFontHeight());
  if (title.length > max_title_count) { title = title.slice(0, max_title_count); }
  var source_height = 8+4;
  var title_height = g.getFontHeight() * title.length + pad.lines/2 + source_height;

  //clip long message to total size 300 pixels
  var max_lines_count = Math.floor((300 - title_height) / g.getFontHeight());
  if (lines.length > max_lines_count) { lines = lines.slice(0, max_lines_count); }
  var lines_height = g.getFontHeight() * lines.length + pad.lines;

  var total_height = title_height + lines_height + pad.rect/2;
  max_scroll = g.getHeight() - total_height;

  // draw the notification on offscreen buffer
  img = Graphics.createArrayBuffer(g.getWidth(), total_height, 8, {msb:true})
    .setColor(g.theme.bgH)
    .fillRect({x:0, y:0, x2:g.getWidth()-1, y2:total_height-1, r:r.outer})
    .setColor(g.theme.bg)
    .fillRect({x:pad.rect/2, y:title_height, x2:g.getWidth() - pad.rect/2-1, y2:total_height - pad.rect/2-1, r:r.inner})
    .setColor(g.theme.fg)
    .setFont(settings.font)
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
