var slideTime = 3.5;
var transitionTime = 1.5;

var slideshow;
var slides = [];
var slideIndex = 0;

if (slideInterval) {
    clearInterval(slideInterval);
}
var slideInterval = null;




// INITIALISE SLIDESHOW //
function slideshowInit() {

    // get slideshow element //
    slideshow = document.getElementById('slideshow');

    if (slideshow) {
        // get slides //
        var l = slideshow.childNodes.length;
        for (var i=0; i<l; i++) {
            var child = slideshow.childNodes[i]
            if (child.nodeType===1) {
                child.className = 'slide hidden';
                child.style.transition = '' + transitionTime + 's';
                slides.push(child);
            }
        }

        // style slides //
        slides[0].className = 'slide focus';

        // start timer //
        slideInterval = setInterval(function(){rotate();}, slideTime*1000);
    }

}





// ROTATE SLIDES //
function rotate() {

    // advance slide index //
    var l = slides.length;
    var lastIndex = slideIndex;
    slideIndex++;
    if (slideIndex===l) {
        slideIndex = 0;
    }

    // style slides //
    for (var i=0; i<l; i++) {
        slides[i].className = 'slide hidden';
    }
    slides[slideIndex].className = 'slide focus';
    slides[lastIndex].className = 'slide focusLast';
}
