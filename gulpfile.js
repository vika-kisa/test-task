const projectFolder = "dist";
const sourceFolder = "src";

const path = {
  build: {
    html: projectFolder + "/",
    css: projectFolder + "/css/",
    js: projectFolder + "/js/",
    img: projectFolder + "/assets/",
  },
  src: {
    html: sourceFolder + "/*.html",
    css: sourceFolder + "/styles/**.scss",
    js: sourceFolder + "/js/script.js", // если будешь использовать js, то в корне нужно создать папку js и в ней файл script.js. если нет, то удали эту и 8 и 22 строку
    img: sourceFolder + "/assets/**/*.+(png|jpg|svg)", //пришлось откорректировать регулярное выражение указывающее на пути к файлам img
  },
  watch: {
    html: sourceFolder + "/*.html",
    css: sourceFolder + "/styles/*.scss",
    js: sourceFolder + "/js/*.js",
    img: sourceFolder + "/assets/**/*.+(png|jpg|svg)",
  },
  clean: "./" + projectFolder + "/",
};

const { src, dest } = require("gulp"),
  gulp = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const del = require("del");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const groupMedia = require("gulp-group-css-media-queries");
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify-es").default;

function sync() {
  browserSync.init({
    server: {
      baseDir: "./" + projectFolder + "/",
    },
    port: 3000,
    notify: false,
  });
}

function html() {
  return src(path.src.html)
    .pipe(dest(path.build.html))
    .pipe(browserSync.stream());
}

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded",
      })
    )
    .pipe(groupMedia())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
        cascade: true,
      })
    )
    .pipe(dest(path.build.css))
    .pipe(cleanCss())
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream());
}

function js() {
  return src(path.src.js)
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browserSync.stream());
}

function images() {
  return src(path.src.img)
    .pipe(dest(path.build.img))
    .pipe(browserSync.stream());
}

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

function clean() {
  return del(path.clean);
}

const build = gulp.series(clean, gulp.parallel(js, css, html, images));
const watch = gulp.parallel(build, watchFiles, sync);

exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;