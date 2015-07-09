Package.describe({
  name: 'babrahams:temple',
  version: '0.1.0',
  // Brief, one-line summary of the package.
  summary: 'Developer tool that provides visual information about templates',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/JackAdams/temple.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
  debugOnly: true
});

Package.onUse(function(api) {

  api.versionsFrom('1.1');
  
  api.use(['templating','session','blaze','jquery'], 'client');
  api.use('reactive-dict', 'client');
  
  api.use('gwendall:body-events@0.1.6', 'client');
  api.use('constellation:console@1.0.0', {weak: true}),
  
  api.addFiles('temple.css','client');
  api.addFiles('temple.html', 'client');
  api.addFiles('temple.js','client');

});

Package.onTest(function(api) {
    
  api.use('tinytest');
  api.use('babrahams:temple');
  api.addFiles('temple-tests.js');

});
