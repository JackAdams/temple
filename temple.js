var Temple = {};

Temple.instanceCount = new ReactiveDict();

Template.onRendered(function () {
  
  var self = this;
  
    Meteor.defer(function () {    
    // We're going to get the element that surrounds that template
    var node = $(self.firstNode).parent();
    
    if (node.closest('#Mongol').length) {
      return;  
    }
    
    if (node && node.nodeType !== 3) { // get rid of text nodes
      
      var template = self.view.name;
      var currentCount = Temple.instanceCount.get('Temple_render_count_' + template) || 1;
      $node = node;
  
      var fix = ($node.css('position') === 'fixed') ? true : false;
      
      $node.addClass('is-template').attr('data-template', (($node.attr('data-template')) ? $node.attr('data-template') + ' ' : '') + template + ' (' + currentCount + ')');
      
      // avoid giving position:relative to fixed elements
      if (fix) {
        $node.css('position', 'fixed');    
      }
      
      Temple.instanceCount.set('Temple_render_count_' + template, currentCount + 1);
      
    }
  
  });
  
});

Meteor.startup(function () {

  $(document).keydown(function (e) {
    if (e.keyCode == 84 && e.ctrlKey) {
      Session.set('Temple_activated', !Session.get('Temple_activated'));
    }
  });
  
  Tracker.autorun(function () {

    if (Session.get('Temple_activated')) {
      $('body').addClass('temple-activated');
    }
    else {
      $('body').removeClass('temple-activated');    
    }
    
  });

});

if (!!Package["msavin:mongol"]) {
    
  // Replace default Mongol header
  Template.Mongol_temple_header.replaces("Mongol_header");
  
  Template.Mongol_header.helpers({

    templeActivated : function () {
      return (Session.get('Temple_activated')) ? 'Temple_activated' : '';    
    }
 
  });
  
  Template.Mongol_temple_header.inheritsHelpersFrom("Mongol_header");
  
  Template.Mongol_header.events({

    'click .Temple_activate' : function (evt) {
      evt.stopPropagation();
      Session.set('Temple_activated', !Session.get('Temple_activated'));
    }

  });
  
  Template.Mongol_temple_header.inheritsEventsFrom("Mongol_header");

}