Package.describe({
  name: 'babrahams:temple',
  version: '0.5.4',
  summary: 'Developer tool that provides visual information about templates',
  git: 'https://github.com/JackAdams/temple.git',
  documentation: 'README.md',
  debugOnly: true
});

Package.onUse(function (api) {

  api.versionsFrom(['1.8.2', '2.3']);
  
  api.use(['templating@1.3.2', 'blaze@2.3.4', 'spacebars@1.0.15', 'jquery@1.11.11', 'underscore', 'check', 'tracker'], 'client');
  api.use('reactive-dict', 'client');
  api.use('gwendall:body-events@0.1.7');

  api.use('constellation:console@1.4.11', {weak: true}),
  
  api.addFiles('temple.css', 'client');
  api.addFiles('temple.html', 'client');
  api.addFiles('temple.js', 'client');
  
  api.export('Temple');

});

Package.onTest(function (api) {
    
  api.use('tinytest');
  api.use('babrahams:temple');
  api.addFiles('temple-tests.js');

});
