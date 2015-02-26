var d3 = require('d3');
var util = require('./util.js');

// Get the relevent objects and variables.
exports.d3_obj = d3.select('div#header');
exports.min_height = parseInt(exports.d3_obj.style('min-height'));
exports.max_height = parseInt(exports.d3_obj.style('max-height'));
exports.bg_max_height = d3.select('div#bgspace').node().getBoundingClientRect().height;
exports.scroll_lock_pos = exports.max_height - exports.min_height;
exports.is_fixed = false;
exports.placeholder_d3_obj = d3.select('div#header_placeholder');
exports.last_scroll_pos = -1;

exports.logo = {};
exports.logo.d3_obj = d3.select('img#logo');
exports.logo.min_width = parseInt(exports.logo.d3_obj.style('min-width'));
exports.logo.max_width = parseInt(exports.logo.d3_obj.style('max-width'));
exports.logo.delta_width = exports.logo.max_width - exports.logo.min_width;
exports.logo.bounding_rect = exports.logo.d3_obj.node().getBoundingClientRect(); 
exports.logo.aspect = exports.logo.bounding_rect.width / exports.logo.bounding_rect.height;

exports.search = {};
exports.search.d3_obj = d3.select('div#search');
exports.search.height = exports.search.d3_obj.node().getBoundingClientRect().height;

// Function to update the header elements based on the current scroll
// position.
exports.update = function() {
  var scroll_pos = util.vertical_scroll_pos();

  // Check to see if we actually have to modify anything.
  if ( this.last_scroll_pos > this.scroll_lock_pos &&
       scroll_pos > this.scroll_lock_pos ) {
    return;
  }

  if ( this.is_fixed && scroll_pos < this.scroll_lock_pos ) {
    this.d3_obj.style('position', 'relative');
    this.d3_obj.style('top', '0px');
    this.placeholder_d3_obj.style('height', '0px');
    this.is_fixed = false;
  } else if ( !this.is_fixed && scroll_pos >= this.scroll_lock_pos ) {
    this.d3_obj.style('position', 'fixed');
    this.d3_obj.style('top', -this.scroll_lock_pos+'px');
    this.placeholder_d3_obj.style('height', this.max_height+'px');
    this.is_fixed = true;
  }

  // Calcualte Paralax Percentage.
  var paralax_pct = scroll_pos/this.scroll_lock_pos;
  if ( paralax_pct > 1.0 ) { paralax_pct = 1.0; }

  var bg_height = this.bg_max_height-paralax_pct*this.scroll_lock_pos;
  // Modify background position.
  this.d3_obj.style('background-position', 'center '+(paralax_pct*this.scroll_lock_pos)+'px');
  // Update logo size.
  var logo_width = this.logo.max_width-paralax_pct*this.logo.delta_width;
  this.logo.d3_obj.style('width', logo_width+'px');
  // Update the logo and search box position.
  var logo_height = logo_width/this.logo.aspect;
  var logo_position = (bg_height-this.search.height-logo_height)/2;
  this.logo.d3_obj.style('margin-top', logo_position+'px');
  this.search.d3_obj.style('margin-top', (logo_position+logo_height)+'px');
  // Set the last scroll pos.
  this.last_scroll_pos = scroll_pos;
}.bind(exports);
