var Temple = {};

Session.setDefault('Temple_current_context', null);

Temple.instanceCount = new ReactiveDict();

Template.onRendered(function () {
  
  var self = this;
  
  // We're going to get the element that surrounds that template
  var node = $(self.firstNode).parent();
  
  if (node.closest('#Mongol').length || node.closest('#temple-dialog').length) {
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

  'click, mouseover' : function (evt) {
    
    if (Session.get('Temple_activated')) {
      
      var target = $(evt.target)[0];
	  
      if (target && !($(target).closest('#Mongol').length || $(target).closest('.ui-dialog').find('#temple-dialog').length)) {
		Session.set('Temple_current_context', Blaze.getData(target));
		if (evt.type === 'click') {
		  // Blaze.renderWithData(Template.editableJSON, Blaze.getData(target), $('#temple-dialog')[0]);
		  var json = JSON.stringify(Blaze.getData(target), null, 2)
		  json = !!Package['msavin:mongol'] && Package['msavin:mongol'].MongolPackage.colorize(json) || json;
		  $('#temple-dialog').html('<pre>' + json + '</pre>');
		  $('#temple-dialog').dialog({
			title:'Data context',
			minWidth:800,
			/*buttons:[
			  {
				text:"Apply",
				click: function() {
				  var context = EditableJSON.retrieve();
				  // We now re-render the template with the new data context
				  var parent = $(evt.target).parent();
				  var view = Blaze.getView(target);
				  while (view.name.substr(0,9) !== 'Template.' && view.name !== 'body') {console.log("View:", view);
					view = view.parentView;	
				  }
				  var templateName = (view.name === 'body') ? 'body' : view.name.substr(9);
				  var tmpl = Template[templateName];
				  console.log("View:", view); console.log("Template:", tmpl);
				  parent.html(Blaze.toHTMLWithData(tmpl, context, parent[0]));
				  $('#temple-dialog').dialog('close');  
				}
			  }
			]*/
		  });
		}
      }
    
    }
  
  }

});

Meteor.startup(function () {

  $(document).keydown(function (e) {
	var charCode = e.which || e.keyCode;
    if (charCode == 84 && e.ctrlKey) {
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

Template.Temple_JSON.helpers({
  templeJSON : function () {
	var json = JSON.stringify(Session.get('Temple_current_context'), null, 2);
	return !!Package['msavin:mongol'] && Package['msavin:mongol'].MongolPackage.colorize(json) || json;
  }
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