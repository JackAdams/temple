var Temple = {};

Temple.instanceCount = new ReactiveDict();

Template.onRendered(function () {
  
  var self = this;
  
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

Template.body.events({

  'click' : function (evt) {
    
    if (Session.get('Temple_activated')) {
      
      var target = $(evt.target)[0];

      if (target && !($(target).closest('#Mongol').length || $(target).closest('.ui-dialog').find('#temple-dialog').length)) {
        $('#temple-dialog').html('<pre>' + JSON.stringify(Blaze.getData(target), null, 2) + '</pre>');
        $('#temple-dialog').dialog({
          title:'Data context',
          minWidth:800
        });
      }
    
    }
  
  }

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