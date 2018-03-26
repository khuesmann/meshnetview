const elixir = require('laravel-elixir');
var gulp = require('gulp');
var webserver = require('gulp-webserver');
var Task = elixir.Task;

require('laravel-elixir-vue-2');
require('laravel-elixir-livereload');


elixir.config.assetsPath = "src";
elixir.config.publicPath = "build";
elixir.config.viewPath = "src";

// Add Webserver task to elixir
elixir.extend('webserver', () => {new Task('webserver', () => {gulp.task('webserver', () => {gulp.src('./build').pipe(webserver({port:8080}))})})});

elixir(mix => {
  mix.copy('./src/index.html', './build/');
  mix.copy('./src/fonts', './build/fonts');
  mix.copy('./src/img', './build/img');
  mix.sass('style.scss', './build/css/');
  mix.webpack('bootstrap.js', './build/js/', './src/js/');
  mix.webpack('app.js', './build/js/', './src/js/');
  mix.webserver();

  mix.livereload([ 'build/**/*', 'build/**/*', 'build/**/*' ], {
    port: 8081,
    host: "127.0.0.1",
    basePath: "./",
    reloadPage: "index.html"
  });
});