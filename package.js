Package.describe({
  name: 'babrahams:temple',
  version: '0.4.7',
  summary: 'Developer tool that provides visual information about templates',
  git: 'https://github.com/JackAdams/temple.git',
  documentation: 'README.md',
  debugOnly: true
});

Package.onUse(function(api) {

  api.versionsFrom('1.0');
  
  api.use(['templating','session','blaze','jquery','underscore','check','tracker'], 'client');
  api.use('reactive-dict', 'client');
  api.use('gwendall:body-events@0.1.6');

  api.use('constellation:console@1.4.7', {weak: true}),
  
  api.addFiles('temple.css','client');
  api.addFiles('temple.html', 'client');
  api.addFiles('temple.js','client');
  
  api.export('Temple');

});

Package.onTest(function(api) {
    
  api.use('tinytest');
  api.use('babrahams:temple');
  api.addFiles('temple-tests.js');

});
