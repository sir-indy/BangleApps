(function(back) {
  const SETTINGS_FILE = "mosaic.settings.json";

  // initialize with default settings...
  let s = {'showWidgets': false, 'showDate': false, 'theme':'System'}

  // ...and overwrite them with any saved values
  // This way saved values are preserved if a new version adds more settings
  const storage = require('Storage')
  let settings = storage.readJSON(SETTINGS_FILE, 1) || s;
  const saved = settings || {}
  for (const key in saved) {
    s[key] = saved[key]
  }

  function save() {
    settings = s
    storage.write(SETTINGS_FILE, settings)
  }

  var theme_options = ['System', 'Light', 'Dark'];

  E.showMenu({
    '': { 'title': 'Mosaic Clock' },
    '< Back': back,
    'Show Widgets': {
      value: settings.showWidgets,
      format: () => (settings.showWidgets ? 'Yes' : 'No'),
      onchange: () => {
        settings.showWidgets = !settings.showWidgets;
        save();
      }
    },
    'Theme': {
      value: 0 | theme_options.indexOf(s.theme),
      min: 0, max: theme_options.length - 1,
      format: v => theme_options[v],
      onchange: v => {
        s.theme = theme_options[v];
        save();
      }
    },
    'Show Date': {
      value: settings.showDate,
      format: () => (settings.showDate ? 'Yes' : 'No'),
      onchange: () => {
        settings.showDate = !settings.showDate;
        save();
      }
    },
  });
})
