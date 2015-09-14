(function(window, document) {

    var DEFAULTS = { activeClass: 'active', action: openFirstLink };
    var settings = DEFAULTS;

    function openFirstLink(element) {
        var firstLink = element.querySelectorAll('a')[0];
        var href = firstLink.href;
        window.open(href);
    }

    // Create element class
    function Element(element) {
       this._el = element;
       this.position = { top: element.offsetTop,
                         bottom: element.offsetTop + element.offsetHeight
                       };
    }
    Element.prototype.addClass = function (className) {
        this._el.className += ' ' + className;
    };
    Element.prototype.removeClass = function (className) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        this._el.className = this._el.className.replace(reg,' ');
    };
    Element.prototype.isVisible = function() {
        var screenTop = window.scrollY;
        var screenBottom = window.scrollY + window.innerHeight;
        return (this.position.top>=screenTop) && (this.position.bottom<=screenBottom);
    };
    Element.prototype.show = function() {
        var windowHeight = window.innerHeight;
        window.scrollTo(0, this.position.bottom - windowHeight);
    };


    // Create jk module
    var jk = (function() {
        var elements = [];

        function getElements(cssSelector) {
            return document.querySelectorAll(cssSelector);
        }

        function stepThrough(step) {
            return ((settings.currentIndex + step) % elements.length + elements.length) % elements.length;
        }

        function navigationStarted() {
            return !(typeof settings.currentIndex === 'undefined');
        }

        function activate(index) {
            var element = elements[index];
            element.addClass(settings.activeClass);
            // Scroll to element if it's not visible
            if (!element.isVisible()) {
                element.show();
            }
        }

        function deactivateAll() {
            elements.forEach(function(el) {
                el.removeClass(settings.activeClass);
            });
        }

        function next() {
            deactivateAll();
            if (!navigationStarted()) {
                settings.currentIndex = 0;
            } else {
                settings.currentIndex = stepThrough(1);
            }
            activate(settings.currentIndex);
        }

        function previous() {
            deactivateAll();
            if (!navigationStarted()) {
                settings.currentIndex = elements.length-1;
            } else {
                settings.currentIndex = stepThrough(-1);
            }
            activate(settings.currentIndex);
        }

        // Don't run callback on input-type elements
        function stopCallback(element) {
            return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || element.isContentEditable;
        }


        function listenForKeys() {
            // Define necessary keyCodes
            var J = 74;
            var K = 75;
            var O = 79;
            var ENTER = 13;

            document.onkeydown = function(e) {
                if (stopCallback(e.target || e.srcElement)) {
                    return;
                }
                switch(e.keyCode) {
                    case J:
                        next();
                        break;
                    case K:
                        previous();
                        break;
                    case O:
                    case ENTER:
                        var el = elements[settings.currentIndex];
                        settings.action(el._el);
                        break;
                }
            };
        }

        function init(options) {
            // No options defined
            if (typeof options === 'undefined') {
                console.error('jk.js: You need to pass an options object to jk.init(). Try e.g. jk.init({elements: "div"});');
                return;
            }

            // options defined but missing CSS selector
            if (typeof options.elements === 'undefined') {
                var exampleOptions = options;
                exampleOptions.elements = 'div';
                var optionsString = JSON.stringify(exampleOptions);
                console.error('jk.js: No CSS selector specified in jk.init(). Try e.g. jk.init(' + optionsString + ');');
                return;
            }

            // Store options in settings object
            settings.cssSelector = options.elements;
            settings.activeClass = options.activeClass || DEFAULTS.activeClass;
            settings.action = options.action || DEFAULTS.action;

            var els = getElements(settings.cssSelector);
            if (els.length === 0) {
                console.error('jk.js: No elements found matching the CSS selector: "' + settings.cssSelector + '"');
                return;
            }

            // Store Elements in elements array
            [].forEach.call(els, function(el) {
                elements.push(new Element(el));
            });

            listenForKeys();
        }

        return {
            init: init,
        };
    })();


    window.jk = jk;

})(window, document);
