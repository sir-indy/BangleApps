const storage = require('Storage');
const locale = require("locale");
require("FontDylex7x13").add(Graphics);
const nameFont= g.getFont();

const width = 175;
const height = 175;

var tap = 0;
var d = new Date();
var nowDate = d.getDate(); //today's date

var imgDay = {
  width : 175, height : 175, bpp : 8,
  transparent : 254,
  buffer : require("heatshrink").decompress(atob("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"))
};
var imgNt = {
  width : 175, height : 175, bpp : 4,
  transparent : 1,
  palette : new Uint16Array([4334,65535,6346,2155,44095,4333,13079,12982,65535,44671,6480,8658,10836,4399,6545,11097]),
  buffer : require("heatshrink").decompress(atob("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"))
};
var imgDsk = {
  width : 175, height : 175, bpp : 4,
  transparent : 1,
  palette : new Uint16Array([13269,65535,31702,25381,25401,42097,52019,15317,17365,37938,31670,29654,52428,40017,37907,19413]),
  buffer : require("heatshrink").decompress(atob("iIA/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4Aei93AAkAAwoA/AH4A/AHGHIH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4AdgAJIuEHJf4A/AH4A3w5A/ACt4xBYJxBM/ABWIK5JiBJn6uLAAJbBLQRfCAQRaDCQRwEN4YECEAQFCvANCvAUGEQY3ECAQfCAQRGEHgj/DIAY1DAHyPCABhjDAH4AX/BA/ACuPK/4AW/4ABLI+PBQJN/VxJXCAH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A0/e734KH3e7CxQVIBYQZBBRIwCA4QdKDRQDEJY5XDG4gwBAwRPFCoQMJBoQHCGQIEDAYIMCAgQCCSoyMHNwQMEGYoKDAH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4Am2UiAH4A/AH4A/AH4AflWqACeiGcgQIHpyT/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A9qtVBRElBYNWJ35WJqQKJAANmsRQ/UQ9WsxVJBYIABNBSu7JQRWOK+g1BVhkms1lfQIXFq1lKwYOBB4r1vK5YNCT4RNBBQUmBQYADMwRXxJAVWsS7LIgJWCCIZUFAAohKVlBFDA4QODTQL3DAASuDVQoQFK2TkCsQHCqRKHIw5WFK4pSq8zaCJwT0BGwY+CdIhWKMYR0DDwbPCAFAsERwJIGWYavJBQYUDKoyurIIQ9BIwo7LBRBuIV2A9CGYayBHgo7FJYdSMBIAGK9MuKwfmKwpXEKxNVZwwAKJj3uABpWCKgQABqw6DCI5nBBYRwDABVuHBwAdIgdWVgo6E8te9yuDMoQcFAAJeGK1ozFsqSGCARhCM4IDEEZRTG8tVVtQALM4llXoYCCFiBWBK85WOtwPEKQT3UKwNWCaAALDhRWTXZIANY4NWYSIAKqpXQAwwXCKxVeEAosHVgLCTKxYdc9yyHsp+EBoJWLVzXlG4RXcVw7zBIoZJGKoIOCKzaNEKzavGsoFEQBAUFR7QeD9OZAAueCQ60YtwoFKoodJ9IDCDIoRID4VpKwwAGCIQECChmWKooTHBwY0OABed7oABzx1BrIVNCIJWBHARqOIxh5EAGdWRx3mf4wAGVbQAdrJHNAGGd7oAB6tVAAVdBAQAPC4YABCRgrECRorUJ5QyFABIZJCLIA/AH4A/AH4Ai7oAO6ownFEAA/AH4A/AH4A/AH4A/AH4A/AH4A0rnMAH4A/AH4A/AAlEAH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4AppEzmdE/9DBIdPCAv0okz//0pASFAggYBCQP//80/H0AwIACmg1FAogeBE4OPFwI9Noc/HYISBoc85nMLIPDAQIABmAyCMYMzgc8Bok8AwQaB4lDpk0DQYOBCYYnBCgM8JwU0HAJfBmdACQgZB4fMCgJEDCQQ9CJYgOBAAw3DDgISBCgQTIAAxLCCiIvCJgYUQIgQAXDQZJPYIiSCGpgjEThYUFEhgcFZ4otOcwJWFLQgvKCgKAFIxI9EEgoKCXgYMC4YiBFIj1BngpFHQgMBCgRZDCYYdDF5QhBDASNFGYTODKIgYCBQSKIABYUCJwYTMFYRjEChhjFChwqDAH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4AGmAA="))
};

Bangle.on('touch', (n, e) => {
  // <88, top
  if (e.x > 120 && e.y < 165) {
    boxTap(120, 30, 0x001F);
    tap+=3;
  }
  else {
    encourage("RANDOM ENCOURAGEMENT");
  }
});

//visuals
function drawTap(x,y,c,b){ //blue box
  if (d.getDate() != nowDate){
    tap=0;
  }
  else {
    g.setColor(0x000).drawRect(x, y, b, b);
    g.setColor(c).fillRect(x, b - tap, b, b);
  }
}

function boxTap(x, y, color) { //progress
  let b = 165;
  if (tap>=120 && tap<=130) {
    g.setColor(0x000);
    milestone("Almost there~");
    drawTap(x, y, color, b);
  }  else if (tap>=65 && tap<=70) {
    g.setColor(0x000);
    milestone("OHHH YOU'RE HALFWAY THERE");
    drawTap(x, y, color, b);
  } else if (tap>=18 && tap<=20) {
    g.setColor(0x000);
    milestone("Great start!!");
    drawTap(x, y, color, b);
  } else if (tap <= 135) {
    g.clearRect(0,10,175,25); //textbox clear
    drawTap(x, y, color, b);
  } else {
    g.setColor(0x000);
    milestone("Hydration achieved!");
  }
}

function milestone(phrase){ //progress
  g.setFontAlign(1,0);
  g.setFont(nameFont).drawString(phrase, 170, 20);
}

function encourage(phrase){ //non-bar tap
  g.setFont(nameFont).drawString(phrase, 65, 20).setFontAlign(-1,0);
}

//time
function isDay(state){
  var d = new Date();
  var currentHr = d.getHours();
  if (currentHr>=19 && currentHr<=8){
    g.drawImage(imgNt,0,20);
  } else if (currentHr>=17){
    g.drawImage(imgDsk,0,20);
  } else {
    g.drawImage(imgDay,0,20);
  }
}

function time(state) {
  if (state==1){
    g.setColor(1,1,1);
  } else {
    g.setColor(0,0,0);
  }
  var day = d.getDate();
  var time = require("locale").time(d, 1);
  var date = require("locale").date(d);
  var mo = require("date_utils").month(d.getMonth() + 1, 1);
  g.setFontAlign(1, 0);
  g.setFont(nameFont, 5).drawString(time, 107, 80);
  g.setFont(nameFont, 3).drawString(mo + " " + day, 100, 110);
}

function go() {  
  //g.setColor(0xFF0).fillRect(0,0,175,175); //bg
  isDay();
  g.setColor(1,1,1).fillRect(120, 30, 165, 165); //meterwhite
  g.setColor(0x000).drawRect(120, 30, 165, 165); //meteroutline
  g.clearRect(0,10,175,25); //textbox  
  time();
}

//ready set go!
g.clear();
Bangle.loadWidgets();
Bangle.drawWidgets();
go();
