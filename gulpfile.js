const { src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require ('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

function scssTask() {
    return src ('./styles/index.scss',{ sourcemaps: true })
    .pipe (sass())
    .pipe (postcss([cssnano()]))
    .pipe (dest('sass',{ sourcemaps: '.'}));
}

function browsersyncServe(cb){
    browsersync.init({
      server: {
        baseDir: '.'
      }    
    });
    cb();
}

function browsersyncReload(cb){
    browsersync.reload();
    cb();
}

function watchTask(){
    watch('*.html', browsersyncReload);
    watch(['styles/*.scss', 'js/*.js'], series(scssTask, browsersyncReload));
}

exports.default = series(
    scssTask,
    browsersyncServe,
    watchTask
);