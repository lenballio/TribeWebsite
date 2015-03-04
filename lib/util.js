// Function to pad numbers.
// n     - The number to pad.
// width - The amount of padding.
// z     - The pad value.
exports.pad_number = function(n, width, z) {
  z = z || '0';
  n = n + '';
  var s = n.toString();
  return s.length >= width ? s : new Array(width - s.length + 1).join(z) + s;
};

// Returns the vertical scroll position in window coordinates.
// Taken from MDN example at https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY
exports.vertical_scroll_pos = function(){
  var supportPageOffset = window.pageXOffset !== undefined;
  var isCSS1Compat = ((window.document.compatMode || '') === 'CSS1Compat');
  return supportPageOffset ? window.pageYOffset
                           : isCSS1Compat ? window.document.documentElement.scrollTop
                                          : window.document.body.scrollTop;
};

// Returns the maximum vertical scroll size of the window.
exports.max_vertical_scroll = function(){
  return Math.max(window.document.body.scrollHeight,
                  window.document.body.offsetHeight, 
                  window.document.documentElement.clientHeight,
                  window.document.documentElement.scrollHeight,
                  window.document.documentElement.offsetHeight);
};

// Helper function to create a function that sets the opacity style of a d3 object.
// e.g. d3obj.call(set_opacity('0'))
exports.set_d3_opacity = function(opacity) {
  return function(d3obj){
    return d3obj.style('opacity', opacity).style('-webkit-opacity', opacity)
      .style('-moz-opacity', opacity);
  };
};

// Helper function to create a function that sets the blur style of a d3 object.
// e.g. d3obj.call(set_opacity('0'))
exports.set_d3_blur = function(blur) {
  return function(d3obj){
    var filter_style = 'blur('+blur+')';
    return d3obj.style('filter', filter_style).style('-ms-filter', filter_style)
      .style('-webkit-filter', filter_style).style('-moz-filter', filter_style);
  };
};

