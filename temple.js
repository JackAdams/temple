// First, plug in to Constellation UI if Constellation is available

if (!!Package["constellation:console"]) {
  
  var Constellation = Package["constellation:console"].API;
    
  Constellation.addTab({
    name: 'Temple',
    id: 'temple',
    mainContentTemplate: 'Constellation_temple_view',
    headerContentTemplate: 'Constellation_temple_header',
    menuContentTemplate: 'Constellation_temple_menu',
    active: true
  });
  
}

// Now do all the stuff specific to this package

Temple = {};

Temple.dict = new ReactiveDict('temple');

Temple.dict.setDefault('Temple_current_context', null);

Temple.instanceCount = new ReactiveDict();

Temple.excludedElements = [];

Temple.exclude = function (selector) {
  check(selector, Match.OneOf([String], String));
  if (_.isArray(selector)) {
	Temple.excludedElements.concat(selector);  
  }
  else {
	Temple.excludedElements.push(selector);  
  }
}

var excludedElement = function (elem) {
  return _.find(Temple.excludedElements, function (selector) {
	 return !!elem.is(selector); 
  });
}

Template.onRendered(function () {
  
  var self = this;
  
  // We're going to get the element that surrounds that template
  var node = $(self.firstNode).parent();
  
  if (node.closest('#Constellation').length || excludedElement(node)) {
    return;
  }
  
  if (node[0] && node[0].nodeType !== 3) { // get rid of text nodes
    
    var template = self.view.name;
    var currentCount = Temple.instanceCount.get('Temple_render_count_' + template) || 1;
    var $node = node;

    var fix = ($node.css('position') === 'fixed') ? true : false;
    
    $node.addClass('is-template').attr('data-template', (($node.attr('data-template')) ? $node.attr('data-template') + ' ' : '') + template + ' (' + currentCount + ')');
    
    // avoid giving position:relative to fixed elements
    if (fix) {
      $node.css('position', 'fixed');    
    }
    
    Temple.instanceCount.set('Temple_render_count_' + template, currentCount + 1);

  }
  
});

Temple.makeBreadcrumbs = function (target) {
  var currentView = Blaze.getView(target[0]);
  var getName = function (view, name) {
    var thisName = '';
    if (view && view.parentView && view.name.substr(0,9) !== 'Template.') {
      // #each iterators use #with internally -- dev doesn't want to see those, just the block elements s/he put in the template
      thisName = getName(view.parentView, (view.parentView.name === 'with' && view.parentView.parentView && view.parentView.parentView.name === 'each') ? '' : view.parentView.name);
    }
    return (thisName) ? thisName + ((name) ? ' > ' + name : '') : name;
  }
  var viewName = getName(currentView, ((currentView) ? ((currentView.name === 'with' && currentView.parentView && currentView.parentView.name === 'each') ? '' : currentView.name) : 'body'));
  Temple.dict.set('Temple_data_context', viewName);
}

Template.body.events({

  'click, mouseover' : function (evt) {
    
    if (Temple.dict.get('Temple_activated') || (!!Constellation && Constellation.isActive() && Constellation.tabVisible('temple','plugin'))) {
      
      var target = $(evt.target);

      if (target.length && !$(target).closest('#Constellation').length) {
        if (!Temple.dict.get('Temple_freeze_data') || evt.type === 'click') {
          Temple.dict.set('Temple_current_context', Blaze.getData(target[0]));
          if (!!Constellation && Constellation.tabVisible('temple','plugin')) {
            // Change the breadcrumbs
            Temple.makeBreadcrumbs(target);
          }
        }
        if (evt.type === 'click') {
          if (!!Constellation && Constellation.isActive() && Constellation.tabVisible('temple','plugin')) {
            // Freeze template viewer
			if (Temple.dict.get('Temple_activated') || Constellation.isCurrentTab('temple','plugin')) {
              Temple.dict.set('Temple_freeze_data', true);
			}
			if (Temple.dict.get('Temple_activated')) {
              Constellation.setCurrentTab('temple','plugin');
			}
          }
          else {
            Temple.makeBreadcrumbs(target);
            var json = JSON.stringify(Blaze.getData(target[0]), null, 2);
            alert(Temple.dict.get('Temple_data_context') + '\n\n' + json); 
          }
        }
      }
    
    }
  
  }

});

Meteor.startup(function () {

  $(document).keydown(function (e) {
    var charCode = e.which || e.keyCode;
    if (charCode == 84 && e.ctrlKey) {
      Temple.dict.set('Temple_activated', !Temple.dict.get('Temple_activated'));
    }
  });
  
  Tracker.autorun(function () {

    if (Temple.dict.get('Temple_activated')) {
      $('body').addClass('temple-activated');
    }
    else {
      $('body').removeClass('temple-activated');    
    }
    
  });

});

// Templates to use if Constellation is available

Template.Constellation_temple_header.helpers({
  templeActivated: function () {
    return Temple.dict.get('Temple_activated');
  }
});

Template.Constellation_temple_header.events({
  'click .Temple_activate' : function (evt) {
    evt.stopPropagation();
    Temple.dict.set('Temple_activated', !Temple.dict.get('Temple_activated'));
  }
});

Template.Constellation_temple_menu.helpers({
  frozen: function () {
    return Temple.dict.get('Temple_freeze_data');  
  },
  dataContext: function () {
    return Temple.dict.get('Temple_data_context');
  },
  templateName: function () {
    var viewName = Temple.dict.get('Temple_data_context');
    if (viewName) {
      var maxLength = (Temple.dict.get('Temple_freeze_data')) ? 36 : 46;
      if (viewName.length > maxLength) {
        viewName = viewName.substr(0, maxLength) + ' ...';    
      }
      return viewName;
    }
    return 'Data context' + ((Temple.dict.get('Temple_activated')) ? ' (hover to view, click to freeze)' : '');
  }
});

Template.Constellation_temple_menu.events({
  'click .Temple_unfreeze' : function () {
    Temple.dict.set('Temple_freeze_data', false);  
  }
});

Template.Temple_JSON.helpers({
  templeJSON : function () {
    var json = JSON.stringify(Temple.dict.get('Temple_current_context'), null, 2);
    return !!Constellation && Package["constellation:console"].Constellation.colorize(json) || json;
  }
});