
(function(){
  var d3 = require('d3');
  var util = require('./util.js');
  var overlay = require('./overlay.js');

  // Initialize the tribe structure.
  var tribe = {};

  // Setup the user control.
  tribe.user = require('./user.js');

  // Setup the header control.
  tribe.header = require('./header.js');
  // See scroll function below: Chrome & IE have issues with chaining these 
  // functions. TODO: Look into it.
  //d3.select(window).on('scroll', tribe.header.update);

  // Setup the overlays.
  tribe.overlays = {
    about           : new overlay.Overlay('about'),
    contact         : new overlay.Overlay('contact'),
    login           : new overlay.Overlay('login'),
    create_account  : new overlay.Overlay('create-account')
  };
  d3.select('button#about-bt').on('click', tribe.overlays.about.open);
  d3.select('div#about').on('click', tribe.overlays.about.close);
  d3.select('button#contact-bt').on('click', tribe.overlays.contact.open);
  d3.select('div#contact').on('click', tribe.overlays.contact.close);
  d3.select('button#login-bt').on('click', tribe.overlays.login.open);
  d3.select('span#login-close').on('click', tribe.overlays.login.close);
  d3.select('button#create-account-open').on('click', function(){
    tribe.overlays.login.close();
    tribe.overlays.create_account.open();
  });
  d3.select('span#create-account-close').on('click', tribe.overlays.create_account.close);

  // Setup the results control.
  tribe.results = require('./results.js');
  
   
  // Temporary function to create random results data.
  var rand_offset = 0;
  var get_random_data = function() {
    var data = [];
    for ( var n = rand_offset; n < rand_offset+50; ++n ) {
      data.push({
        'id': 'p' + util.pad_number(n, 4),
        'pic': Math.floor(2*Math.random()), 
        'fname': 'Name',
        'lname': '' + util.pad_number(n, 4),
        'size': Math.floor(1000*Math.random()),
        'score': 10*Math.random(),
        'stats': {
          'facebook': Math.floor(100*Math.random()),
          'instagram': Math.floor(100*Math.random()),
          'twitter': Math.floor(100*Math.random()),
          'youtube': Math.floor(100*Math.random()),
        },
        'bio': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      });
    }
    rand_offset += 50;
    return data;
  };

  // At the moment if the search button is pressure remove the current data and reload more random data.
  d3.select('button#search-bt').on('click', tribe.results.remove_data.bind(null, function(){
    setTimeout(function(){
      tribe.results.add_data(get_random_data());
      tribe.results.update_view();
    }, 1000);
  }));

  // If we scoll near to the bottom of the page add more elements.
  d3.select(window).on('scroll', function () {
    var scroll_pos = util.vertical_scroll_pos();
    var scroll_limit = util.max_vertical_scroll() - window.innerHeight;
    if ( scroll_limit-scroll_pos < 240 ) {
      tribe.results.add_data(get_random_data());
      tribe.results.update_view();
    }
    tribe.header.update();
  });

  // Setup initial values.
  tribe.header.update();
  tribe.results.add_data(get_random_data());
  tribe.results.update_view(); 
})();
