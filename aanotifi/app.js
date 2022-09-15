Bangle.loadWidgets();
Bangle.drawWidgets();

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
  var x_pad = 10, y_pad = 4;

  var lines = [];
  lines = g.wrapString(msg.title||'', g.getWidth()-10);
  var titleCnt = lines.length;

  lines = lines.concat(
    g.wrapString(msg.subject, g.getWidth()-x_pad),
    g.wrapString(msg.body, g.getWidth()-x_pad)
  );

  function onSwipe(dirLeftRight, _) {
    if (dirLeftRight == 1) {
      print('RIGHT');
    } else if (dirLeftRight == -1) {
      print('LEFT');
    }
  }

  Bangle.on('swipe', onSwipe);

  E.showScroller({
    h : g.getFontHeight() + y_pad, // height of each menu item in pixels
    c : lines.length, // number of menu items
    draw : function(idx, r) {
      g.setBgColor(idx<titleCnt ? g.theme.bg2 : g.theme.bg).
        setColor(idx<titleCnt ? g.theme.fg2 : g.theme.fg).
        clearRect(r);
      g.setFont(bodyFont).drawString(lines[idx], r.x + x_pad/2, r.y + y_pad/2);
    },
    select : function(idx) {
      print('TAPPED');
    },
    back : function() {
      Bangle.removeListener("swipe", onSwipe);
      print('BACK');
    }
  });
};
