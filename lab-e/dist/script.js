/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


var styles = ['styles/responsive.css', 'styles/alternative.css', 'styles/empty.css'];
var footer = document.getElementById('links');
var style = document.getElementById('currentStyle');
function addStyles() {
  var _loop = function _loop() {
    var link = document.createElement('a');
    link.textContent = "Styl nr ".concat(i + 1);
    link.href = styles[i];
    link.addEventListener("click", function (event) {
      event.preventDefault();
      style.setAttribute("href", link.href);
      console.log("Style: ", link.href);
    });
    footer.appendChild(link);
    if (i < styles.length - 1) {
      var space = document.createElement('span');
      space.innerHTML = '&emsp;';
      footer.appendChild(space);
    }
  };
  for (var i = 0; i < styles.length; i++) {
    _loop();
  }
}
addStyles();
/******/ })()
;