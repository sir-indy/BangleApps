(function(back) {
    var FILE = "notifyover.settings.json";
    var font_options = ['6x15', '12x20', 'Vector19', 'Vector20'];
  
    var settings = Object.assign({
      font: 'Vector19',
    }, require('Storage').readJSON(FILE, true) || {});

    function writeSettings() {
      require('Storage').writeJSON(FILE, settings);
    }
  
    var mainmenu = {
      "" : { "title" : /*LANG*/"Messages" },
      "< Back" : back,
      /*LANG*/'Font': {
        value: 0 | font_options.indexOf(settings.font),
        min: 0, max: font_options.length - 1,
        format: v => font_options[v],
        onchange: v => {
          settings.font = font_options[v];
          writeSettings();
        }
      },
      /*LANG*/'Test': require('notify').show({})
    };
    E.showMenu(mainmenu);
  });
  