(function(back) {
  let settings = require('Storage').readJSON('smpltmr.json',1)||{};
  if (typeof settings.defaultTime !== "number") settings.defaultTime = 5; // default value
  function save(key, value) {
    settings[key] = value;
    require('Storage').write('smpltmr.json', settings);
  }
  const appMenu = {
    '': {'title': 'App Settings'},
    '< Back': back,
    'Default Minutes': {
      value: settings.defaultTime,
      onchange: (m) => {save('defaultTime', m)}
    }
  };
  E.showMenu(appMenu)
})