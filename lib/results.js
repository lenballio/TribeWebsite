var d3 = require('d3');
var util = require('./util.js');
var overlay = require('./overlay.js');
var tribe = {};


// Global objects that are needed for the overlay.
exports.data = [];
exports.cur_view_id = '';


tribe.overlays = {
    insight  : new overlay.Overlay('insight')
};

// This removes all current results data and then calls post_func after the 
// removal animations have completed.
exports.remove_data = function(post_func){
  // Start the removal animation.
  d3.select('div#results')
    .selectAll('div.result-cube')
    .transition()
    .delay(function(){ return 500*Math.random(); })
    .duration(function(){ return 500; })
    .call(util.set_d3_opacity('0'));
  // Set a timeout until the animation has completed at which stage all of the
  // result divs will be removed and the post_func called. We have to do this as
  // if we do it using d3's end function then the result cubes will start shifting
  // before they have reached 0 opacity. TODO: It may be possible to set the result's
  // positioning to absolute before removing them so that they do not shift...
  setTimeout(function(){
    d3.selectAll('div#results').selectAll('div.result-cube').remove();
    post_func();
  }.bind(this), 1000);
  // Make sure the actual data is removed.
  this.data = [];
}.bind(exports);

// Appends data to the results.
exports.add_data = function(data){
  this.data.push.apply(this.data, data);
}.bind(exports);

// This function updates the view based on new result data. 
exports.update_view = function(){
  // Create a new set of result cubes for any new result data.
  var result_objs = 
    d3.select('div#results')
      .selectAll('div.result-cube')
      .data(this.data)
      .enter()
      .append('div')
      .attr('class', 'result-cube')
      .attr('id', function(d){ return d.id; });

  // Add the result cube's background image.
  result_objs
    .append('img')
    .attr('src', function(d){ return './images/p-'+util.pad_number(d.pic,2)+'.jpg'; });

  // Add the result cube's name.
  result_objs
    .append('span')
    .attr('id', 'name').text(function(d){ return d.fname+' '+d.lname; });

  // Add the result cube's tribe score.
  result_objs
    .append('span')
    .attr('id', 'score').text(function(d){ return d.size; });

  // Create the info objects for each result cube.
  result_objs
    .append('div')
    .attr('id', 'info')
    .call(function(call_info_obj)
  {
    // Create the tribe score table in the info objects
    call_info_obj
      .append('div')
      .attr('id', 'tribe_score_container')
      .append('table')
      .append('tr')
      .append('td')
      .call(function(score_table_obj)
    {
      score_table_obj
        .append('span')
        .attr('id', 'tribe-score').text(function(d){ return d.score.toFixed(1); });
      score_table_obj
        .append('br');
      score_table_obj
        .append('span')
        .attr('id', 'label')
        .text('TRIBE SCORE');
    });

    // Create the name object in the info objects,
    call_info_obj
      .append('div')
      .attr('id', 'name')
      .call(function(info_name_obj)
    {
      info_name_obj
        .append('span')
        .text(function(d){ return d.fname; });
      info_name_obj
        .append('br');
      info_name_obj
        .append('span')
        .text(function(d){ return d.lname; });
    });

    // Create the bio object in the info objects.
    call_info_obj
      .append('div')
      .attr('id', 'bio')
      .append('p')
      .text(function(d){ return d.bio; });

    // Create the view insights object in the info objects.
    call_info_obj
      .append('button')
      .attr('id', 'view_insights')
      .append('span')
      .text('VIEW INSIGHTS');

    // Create the stats table in the info objects.
    call_info_obj
      .append('div')
      .attr('id', 'social_stats')
      .append('table')
      .call(function(stats_table_obj)
    {
      stats_table_obj.append('tr').call(function(trobj){
        trobj.append('td').append('img').attr('src', 'icons/instagram.png');
        trobj.append('td').append('img').attr('src', 'icons/facebook.png');
        trobj.append('td').append('img').attr('src', 'icons/twitter.png');
        trobj.append('td').append('img').attr('src', 'icons/youtube.png');
      });
      stats_table_obj.append('tr').call(function(trobj){
        trobj.append('td').append('span').text(function(d){ return d.stats.instagram+'K'; });
        trobj.append('td').append('span').text(function(d){ return d.stats.facebook+'K'; });
        trobj.append('td').append('span').text(function(d){ return d.stats.twitter+'K'; });
        trobj.append('td').append('span').text(function(d){ return d.stats.youtube+'K'; });
      });
    });
  });

 
  console.log(tribe); 
  result_objs.select('button#view_insights').on('click', tribe.overlays.insight.open); 
  console.log(d3.select('div.insight-overlay-content'));
  d3.select('div#insight').on('click', tribe.overlays.insight.close);
 
  result_objs.select('img').on('click', function(d){
    // Are we currently viewing any details? 
    if ( this.cur_view_id === '' ) {
      var info_div =
        d3.select('div#'+d.id)
          .select('div#info');
      info_div
        .style('display', 'block')
        .style('visibility', 'visible')
        .transition()
        .duration(500)
        .call(util.set_d3_opacity('1'));
      this.cur_view_id = d.id;
    } else {
      var info_div2 =
        d3.select('div#'+this.cur_view_id)
          .select('div#info');
      info_div2
        .transition()
        .duration(500)
        .call(util.set_d3_opacity('0'))
        .each('end', function(){
          info_div2.style('display', 'none')
                   .style('visibility', 'hidden');
        });
      this.cur_view_id = '';
    }
  }.bind(this));

  // Enter transition.
  result_objs.transition()
    .delay(function(){ return 500*Math.random(); })
    .duration(function(){ return 500; })
    .call(util.set_d3_opacity('1'));
}.bind(exports);
