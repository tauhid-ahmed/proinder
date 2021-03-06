
	
var mainSlider = (function() {
	
	var app = {};

	// default properties
	var defaults = {
		delay: 5000,
		arrows: true,
		indicators: true,
		random: false,
		slideshow: true,
		animationSpeed: '1s'
	}

	// container divs
	var slideshowContainer = document.getElementById('slider-wrapper');
	var slideshow = document.getElementById('slider-slideshow');
	var slides = document.getElementById('slider-slideshow').getElementsByClassName('slider-slideshow__item');
	var arrowPrevious = 'slider-slideshow__previous';
	var arrowNext = 'slider-slideshow__next';
	var indicatorsContainer = 'vanilla-indicators';

	// check properties
	function _checkProperties() {

		var random = (defaults.random) ? _randomInt(0, slides.length - 1) : 0;

		for(var i=0; i<slides.length; i++) {
			
			if(slides[i].getAttribute('data-src') !== null) {
				slides[i].style.backgroundImage  = 'url( ' + slides[i].getAttribute('data-src') + ')';
			}

			if(i === random) { slides[i].className += ' vanilla-active'; }

			_setVendor(slides[i], 'Transition', defaults.animationSpeed);

		}

	};

	// slideshow function
	function _slideShow() {

		var active = document.querySelector('#' + slideshow.getAttribute('id') + ' .vanilla-active');
		var next = (_nextElement(active)) ? _nextElement(active) : slides[0];

		// classes
		active.className = 'slider-slideshow__item';
		next.className += ' vanilla-active';

		// indicators
		if(defaults.indicators) {
			var activePointer = document.querySelector('#' + indicatorsContainer + ' .vanilla-active');
			var nextPointer = (_nextElement(activePointer)) ? _nextElement(activePointer) : app.indicators[0];
			activePointer.className = activePointer.className.replace(/(?:^|\s)vanilla-active(?!\S)/g, '');
			nextPointer.className += ' vanilla-active';		
		}

	};

	// Previous slide
	function _previousSlide() {

		_stopSlideshow();

		var active = document.querySelector('#' + slideshow.getAttribute('id') + ' .vanilla-active');
		var previous = (_previousElement(active) ? _previousElement(active) : slides[slides.length - 1]);

		// classes
		active.className = 'slider-slideshow__item';
		previous.className += ' vanilla-active';

		// indicators
		if(defaults.indicators) {
			var activePointer = document.querySelector('#' + indicatorsContainer + ' .vanilla-active');
			var nextPointer = (_previousElement(activePointer)) ? _previousElement(activePointer) : app.indicators[app.indicators.length - 1];
			activePointer.className = activePointer.className.replace(/(?:^|\s)vanilla-active(?!\S)/g, '');
			nextPointer.className += ' vanilla-active';		
		}		
		
		if(defaults.slideshow) {
			_startSlideshow();
		}
	
	};

	// Next slide
	function _nextSlide() {
		
		_stopSlideshow();

		_slideShow();

		if(defaults.slideshow) {
			_startSlideshow();
		}

	};

	// create indicators and add event listeners
	function _createIndicators() {

		for(var i=0; i<slides.length; i++) {
			var node = document.createElement("div");
			var indicators = document.getElementById(indicatorsContainer).appendChild(node);
			indicators.addEventListener("click", function() {
				_indicatorsClick(this);
			});
			indicators.className = indicatorsContainer;
			if(_hasClass(slides[i], 'vanilla-active')) {
				indicators.className += ' vanilla-active';
			}
		}

		app.indicators = slideshowContainer.getElementsByClassName(indicatorsContainer);

	};

	// indicators click function
	function _indicatorsClick(self) {
			
		_stopSlideshow();
		
		// remove active classes
		for(var i=0; i<slides.length; i++) {
			if(_hasClass(app.indicators[i], 'vanilla-active')) {
				app.indicators[i].className = app.indicators[i].className.replace(/(?:^|\s)vanilla-active(?!\S)/g, '');
			}	
			if(_hasClass(slides[i], 'vanilla-active')) {
				slides[i].className = 'slider-slideshow__item';
			}	
		}

		// add active class 
		var i = Array.prototype.indexOf.call(app.indicators, self);
		app.indicators[i].className += ' vanilla-active';

		// add classes to slide
		slides[i].className += ' vanilla-active';

		if(defaults.slideshow) {
			_startSlideshow();
		}

	};

	// start slideshow
	function _startSlideshow() {

		app.intervalSliding = setInterval(function() {
			_slideShow();
		}, defaults.delay);
	};

	// stop slideshow
	function _stopSlideshow() {

		clearInterval(app.intervalSliding);
	};

	// set browser vendor properties
	function _setVendor(element, property, value) {
	  element.style["webkit" + property] = value + ' ease-in-out';
	  element.style["Moz" + property] = value + ' ease-in-out';
	  element.style["ms" + property] = value + ' ease-in-out';
	  element.style["o" + property] = value + ' ease-in-out';
	};

	// has class 
	function _hasClass(element, cls) {
    	return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
	};

	// Next element
	function _nextElement(element) {
	    do {
	        element = element.nextSibling;
	    } while (element && element.nodeType !== 1);

	    return element;        
	};

	// Previous element
	function _previousElement(element) {
	    do {
	        element = element.previousSibling;
	    } while (element && element.nodeType !== 1);

	    return element;  
	};

	// Random number
	function _randomInt(min, max) {

    	return Math.floor(Math.random() * (max - min + 1) + min);
	};

	// init function
	app.init = function(arguments) {

		if( ! slideshowContainer) { return false; }

		// check if options is present
	  	if(arguments && typeof arguments === "object") {
	    	defaults.arrows = (arguments.arrows !== '') ? arguments.arrows : defaults.arrows;
	    	defaults.indicators = (arguments.indicators !== '') ? arguments.indicators : defaults.indicators;
	    	defaults.random = (arguments.random !== '') ? arguments.random : defaults.random;
	    	defaults.slideshow = (arguments.slideshow !== '') ? arguments.slideshow : defaults.slideshow;
	    	defaults.delay = (arguments.delay) ? arguments.delay : defaults.delay;
	    	defaults.animationSpeed = (arguments.animationSpeed) ? arguments.animationSpeed : defaults.animationSpeed;
	    }

		_checkProperties();
		
		if(slides.length > 1) {
			
			if(defaults.arrows) {

				document.getElementById(arrowNext).addEventListener('click', function() {
					_nextSlide();
				});	
				document.getElementById(arrowPrevious).addEventListener('click', function() {
					_previousSlide();
				});
				document.getElementById(arrowPrevious).style.display = 'block';
				document.getElementById(arrowNext).style.display = 'block';
			}

			if(defaults.indicators) {
				_createIndicators();
			}
			if(defaults.slideshow) {
				_startSlideshow();
			}
		}
		
	};

	return app;

}(mainSlider));



// menu btn cross collapse


(function() {
	var menuBtn = document.querySelector(".page-header__menu-key");
	var menuP = menuBtn.parentElement;
	var iconO = menuBtn.querySelector(".page-header__menu-icon:nth-child(1)");
	var icon2 = menuBtn.querySelector(".page-header__menu-icon:nth-child(2)");
	var primaryNav = document.querySelector(".primary-nav");

	menuBtn.addEventListener("click", function() {
		
		if(primaryNav.classList.contains("active")) {
			primaryNav.classList.remove("active");
		} else {
			primaryNav.classList.add("active");
		}

		if(menuP.classList.contains("page-header--bg")) {
			menuP.classList.remove("page-header--bg");
		} else {
			menuP.classList.add("page-header--bg");
		}

		if(iconO.classList.contains("active")) {
			iconO.classList.remove("active");
			icon2.classList.add("active");
		} else {
			iconO.classList.add("active");
			icon2.classList.remove("active");
		}
	})
})();



// form popup 

(function() {

let formControl = document.querySelector(".form-control");
let formOverlay = document.querySelector(".form-control-overlay");
	
document.getElementById('user-button').addEventListener("click", function() {
	if(formControl.classList.contains("form-control--active")) {
		formControl.classList.remove("form-control--active");
	} else {
		formControl.classList.add("form-control--active");
	}
	if(formOverlay.classList.contains("active")) {
		formOverlay.classList.remove("active");
	} else {
		formOverlay.classList.add("active");
	}
});

// document.querySelector('.from-control__close').addEventListener("click", function() {
// 	if(formControl.classList.contains("form-control--active")) {
// 		formControl.classList.remove("form-control--active");
// 	}
// });


const signUpButton = document.getElementById('form-control-signUp');
    const signInButton = document.getElementById('form-control-signIn');
    const container = document.getElementById('form-control__contents');

    signUpButton.addEventListener('click', () => {
      container.classList.add("right-panel-active");
    });

    signInButton.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
    });

})();

