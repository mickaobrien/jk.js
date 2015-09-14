# jk.js
jk.js is a JavaScript library to add Vim-style navigation to your site. It allows users to navigate through  selected DOM elements on your page using `j` to move down, `k` to move up and `o` or `Enter` to "open".

[Demo](http://www.mick.mx/).

## Getting started

1. Include jk.js on your page before the closing `</body>` tag:
  ```html
  <script src="jk.min.js"></script>
  ```

2. Initialise it with an `options` object:
  ```html
  <script>
    jk.init({elements: '.article', 
             activeClass: 'current', 
             action: function(element) { element.click(); }
            });
  </script> 
  ```
The `options` object has three keys:
  * `elements`: a CSS selector passed to `querySelectorAll` to list the elements you want to scroll through e.g. `'div.article'`.
  * `activeClass`: the class name added to the currently selected element. This allows you to style the selected element. 
  **Defaults to**: `'active'`.
  * `action`: a function that's called when `o` or `Enter` are pressed. The currently selected DOM element is passed as a parameter. **Defaults to:** 
  ```javascript
  // opening the first link in the element
  function openFirstLink(element) {
      var firstLink = element.querySelector('a').href;
      window.open(firstLink);
  }
  ```
