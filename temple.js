Template.onRendered(function () {
  var node = this.firstNode;
  if (node && node.nodeType !== 3) { // get rid of text nodes
    $node = $(node);
    var template = this.view.name;
    $node.addClass('is-template').attr('data-template', template);

    // avoid giving position:relative to absolute elements
    if ($node.css('position') == 'static') {
      $node.css('position', 'relative');
    }
  }

  var instance = this;
  this.autorun(function () {
    var data = Template.currentData();
    var template = instance.view.name;
    if (template !== "Template.__dynamicWithDataContext" && template !== "Template.__dynamic") {
      var node = instance.firstNode;
      var redrawCount = parseInt($(node).attr('data-redraw') || 0);
      // console.log('-------------------------')
      // console.log('redrawing ' + template + '('+redrawCount+')')
      // console.log(instance)
      // console.log(node)
      var bgAlpha = redrawCount/20;
      var shadowAlpha = redrawCount/10;
      $(node)
        .attr('data-redraw', redrawCount+1)
        .attr('data-data', JSON.stringify(data, null, 4))
        .css('background', 'rgba(255,0,0,'+bgAlpha+')')
        .css('box-shadow', '0px 0px 5px rgba(255,0,0,'+ shadowAlpha +')');
    }
  })
});