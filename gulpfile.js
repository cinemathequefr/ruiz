// Installation des plugins: npm install gulp gulp-rename gulp-uglify gulp-concat gulp-minify-css gulp-watch --save-dev
// Pour exécuter : gulp watch

var gulp = require("gulp");
var rename = require("gulp-rename");				// https://github.com/hparra/gulp-rename
var uglify = require("gulp-uglify");				// https://github.com/terinjokes/gulp-uglify
var concat = require("gulp-concat");				// https://github.com/wearefractal/gulp-concat
var minifycss = require("gulp-minify-css");	// https://github.com/jonathanepollack/gulp-minify-css
var watch = require("gulp-watch");				// https://github.com/floatdrop/gulp-watch

gulp.task("watch", function () {
	watch(["src/js/**/*.js", "src/css/**/*.css"], function () {
		gulp.start("build");
	});
});

gulp.task("build", function () {
	gulp.src([
    "src/js/vendor/jquery.min.js",
    "src/js/vendor/lodash.js",
    "src/js/vendor/ba-tiny-pubsub.min.js",
    "src/js/vendor/d3.min.js",
    "src/js/vendor/topojson.min.js",
    "src/js/vendor/d3.geo.projection.min.js",
    "src/js/vendor/d3-queue.min.js",
    "src/js/vendor/d3.geo.zoom.js",
    "src/js/vendor/jquery.animate-enhanced.min.js",
    "src/js/vendor/perfect-scrollbar.jquery.min.js",
    "src/js/vendor/path.js",
    "src/js/vendor/imagesloaded.pkgd.min.js",
    "src/js/vendor/jquery.vide.min.js"
	])
	.pipe(concat("pre.js"))
	.pipe(uglify())
	.pipe(gulp.dest("js"));

  gulp.src([
    "src/js/intro.js",
    "src/js/map.js",
    "src/js/card.js",
    "src/js/viewer.js",
    "src/js/main.js"
  ])
  .pipe(concat("post.js"))
  .pipe(uglify())
  .pipe(gulp.dest("js"));

	gulp.src([
    "src/css/vendor/perfect-scrollbar.min.css",
    "src/css/main.css"
	])
	.pipe(concat("main.css"))
	.pipe(minifycss())
	.pipe(gulp.dest("css"));

});


