(function(back) {
    var settingsFile = "messnot.settings.json";
  
    function settings() {
      let settings = require('Storage').readJSON(settingsFile, true) || {};
      if (settings.vibrate===undefined) settings.vibrate=":";
      return settings;
    }
    function updateSetting(setting, value) {
      let settings = require('Storage').readJSON(settingsFile, true) || {};
      settings[setting] = value;
      require('Storage').writeJSON(settingsFile, settings);
    }
  
    var mainmenu = {
      "" : { "title" : /*LANG*/"Messages Notify" },
      "< Back" : back,
      /*LANG*/'Vibrate': require("buzz_menu").pattern(settings().vibrate, v => updateSetting("vibrate", v))
    };
    E.showMenu(mainmenu);
  });
  