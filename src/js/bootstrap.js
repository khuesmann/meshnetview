require('handjs');

window.ENV = require('./env');

window.Vue = require('vue');
require('vue-resource');
window.$ = window.jQuery = require('jquery');

require('bootstrap-sass');
require('bootstrap-select');

Vue.http.headers['Access-Allow-Origin'] = "*";

window.dump = function dump (variable, pretext) {
  if ( pretext ) {
    console.log(pretext + ": " + variable);
  }
  else {
    console.log(variable);
  }
};

window.ddump = function ddump (text) {
  if(text) {
    console.log("--------------------- " + text +  " ---------------------")
  }
  else {
    console.log("----------------------------------------------")
  }
};

window.sdump = function sdump(linebreaks) {
  linebreaks = linebreaks || 1;
  for(var i = 0; i < linebreaks; i++) {
    console.log("")
  }
};

window.onerror = function myErrorHandler (errorMsg, url, lineNumber, col, error) {
  document.body.innerHTML = `<div class="alert alert-danger">${errorMsg} <br> ${url} ${lineNumber}</div>` + document.body.innerHTML;
};

window.getParameterByName = function(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

window.chroma = require('chroma-js');
window.math = require('mathjs');
window.moment = require('moment');

window.toastr = require('toastr')
window.toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": true,
  "progressBar": false,
  "positionClass": "toast-bottom-left",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}