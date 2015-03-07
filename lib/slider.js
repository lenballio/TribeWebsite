var d3 = require('d3');

exports.setUpSlideShow = function (slidesContainerID, slidesControlsID)
{

    var slidePrefix            = 'slide-';
    var slideControlPrefix     = 'slide-control-';
    var slideHighlightClass    = 'highlight';
    //var slidesContainerID      = 'slides';
    //var slidesControlsID       = 'slides-controls';
    var slideDelay             = 3000;
    var slideAnimationInterval = 20;
    var slideTransitionSteps   = 10;

    var slidesCollection;
    var slidesControllersCollection;
    var totalSlides;

    // initialize vars
    var slideTransStep= 0;
    var transTimeout  = 0;
    var crtSlideIndex = 1;

    var nextSlideIndex;
    var crtSlide;
    var nextSlide;

    // collect the slides and the controls
    slidesCollection = d3.select('#' + slidesContainerID).selectAll('.insight-wrapper-post');
    slidesControllersCollection = d3.select('#' + slidesControlsID).selectAll('a');
 
    totalSlides = slidesCollection.size();
 
    if (totalSlides < 2) { return; }
 
    //go through all slides
    for (var i=0; i < slidesCollection.size(); i++)
    {
        // give IDs to slides and controls
        slidesCollection[0][i].id = slidePrefix+(i+1);
        slidesControllersCollection[0][i].id = slideControlPrefix+(i+1);
 
        // attach onclick handlers to controls, highlight the first control
        slidesControllersCollection[0][i].onclick = function(){clickSlide(this);};
 
        //hide all slides except the first
        if (i > 0) {
            slidesCollection[0][i].style.display = 'none';
        }
        else {
            slidesControllersCollection[0][i].className = slideHighlightClass;
        }
    }
 
    // initialize vars
    slideTransStep= 0;
    transTimeout  = 0;
    crtSlideIndex = 1;
 
    // show the next slide
    showSlide(2);

    function showSlide(slideNo, immediate)
    {
        // don't do any action while a transition is in progress
        if (slideTransStep !== 0 || slideNo === crtSlideIndex) {
            return;
        }
     
        clearTimeout(transTimeout);

        // get references to the current slide and to the one to be shown next
        nextSlideIndex = slideNo;
        crtSlide = d3.select('#' + slidePrefix + crtSlideIndex)[0][0];
        nextSlide = d3.select('#' + slidePrefix + nextSlideIndex)[0][0];
        slideTransStep = 0;
     
        // start the transition now upon request or after a delay (default)
        if (immediate === true) {
            transSlide();
        }
        else {
            transTimeout = setTimeout(transSlide, slideDelay);
        }
    }

    function clickSlide(control)
    {
        showSlide(Number(control.id.substr(control.id.lastIndexOf('-')+1)),true);
    }

    function transSlide()
    {
        // make sure the next slide is visible (albeit transparent)
        //nextSlide.style.display = 'block';
        nextSlide.style.display = 'table-cell';
     
        // calculate opacity
        var opacity = slideTransStep / slideTransitionSteps;
     
        // fade out the current slide
        crtSlide.style.opacity = '' + (1 - opacity);
        crtSlide.style.filter = 'alpha(opacity=' + (100 - opacity*100) + ')';
     
        // fade in the next slide
        nextSlide.style.opacity = '' + opacity;
        nextSlide.style.filter = 'alpha(opacity=' + (opacity*100) + ')';
     
        // if not completed, do this step again after a short delay
        if (++slideTransStep <= slideTransitionSteps) {
            transTimeout = setTimeout(transSlide, slideAnimationInterval);
        }
        else
        {
            // complete
            crtSlide.style.display = 'none';
            transComplete();
        }
    }

    function transComplete()
    {
        slideTransStep = 0;
        crtSlideIndex = nextSlideIndex;
     
        // for IE filters, removing filters reenables cleartype
        if (nextSlide.style.removeAttribute) {
            nextSlide.style.removeAttribute('filter');
        }
     
        // show next slide
        showSlide((crtSlideIndex >= totalSlides) ? 1 : crtSlideIndex + 1);
     
        //unhighlight all controls
        for (var i=0; i < slidesControllersCollection.size(); i++) {
            slidesControllersCollection[0][i].className = '';
        }
     
        // highlight the control for the next slide
        d3.select('#slide-control-' + crtSlideIndex)[0][0].className = slideHighlightClass;
    }
};