var d3 = require('d3');
var util = require('./util.js');

// Global objects that are needed for the overlay.
exports.data = {};
exports.body_d3_obj = d3.select('body');
exports.container_d3_obj = d3.select('div#container');

// Constructor for the overlays.
// id - id of the div that contains the overlay.
exports.Overlay = function(id) {
  this.d3_obj = d3.select('div#'+id);
  this.opened = false;
  this.open = function(){
    if ( this.opened ) { return; }
    // Display the overlay.
    this.d3_obj.style('display', 'table');
    // Fade in the overlay.
    this.d3_obj
      .transition()
      .duration(500)
      .call(util.set_d3_opacity('1'))
      .each('end', function(){
        this.opened = true;
      }.bind(this));
    // Blur the container.
    exports.container_d3_obj
      .transition()
      .duration(500)
      .call(util.set_d3_blur('10px'));
    // Pevent scrolling in the container.
    // Also adjust the width so that the content doesn't shift due to
    // the dissapearing scrollbar.
    var body_width_with_scroll = this.body_d3_obj.style('width');
    exports.body_d3_obj
      .style('overflow', 'hidden')
      .style('width', body_width_with_scroll);
  }.bind(this);
  this.close = function(){
    if ( !this.opened ) { return; }
    // Fade out the overlay.
    this.d3_obj
      .transition()
      .duration(500)
      .call(util.set_d3_opacity('0'))
      .each('end', function(){
        this.opened = false;
        this.d3_obj.style('display', 'none');
      }.bind(this));
    // Deblur the container.
    exports.container_d3_obj
      .transition()
      .duration(500)
      .call(util.set_d3_blur('0px'));
    // Allow scrolling in the container.
    // Also readjust the width to be the size of the window.
    exports.body_d3_obj
      .style('overflow', 'visible')
      .style('width', 'auto');
  }.bind(this);
};
