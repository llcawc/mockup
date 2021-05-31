// gulpfile.js for Mockup Template Starter by pasmurno
// repositary: https://github.com/llcawc/mockup.git
'use strict';

let	baseDir = "app"; // Base directory path without «/» at the end
let distDir = "dist"; // Distribution folder for uploading to the site - use before "gulp build" command

const { src, dest, parallel, series, watch } = require("gulp");
const browserSync  = require("browser-sync").create();
const webpack      = require("webpack-stream");
const sass         = require("gulp-sass");
const sassglob     = require("gulp-sass-glob");
const plumber      = require("gulp-plumber");
const cleancss     = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const rename       = require("gulp-rename");
const imagemin     = require("gulp-imagemin");
const newer        = require("gulp-newer");
const rsync        = require("gulp-rsync");
const del          = require("del");
const notify       = require("gulp-notify");
const panini       = require("panini");

function browsersync() {
  browserSync.init({
    server: {
      baseDir: distDir + "/",
    },
    notify: false,
    online: true,
    // tunnel: 'yousutename', // Attempt to use the URL https://yousutename.loca.lt
  });
}

function html() {
  panini.refresh();
  return src(baseDir + "/*.html", { base: baseDir + "/" })
    .pipe(plumber())
    .pipe(panini({
      root:     baseDir + "/",
      layouts:  baseDir + "/layouts/",
      partials: baseDir + "/partials/",
      helpers:  baseDir + "/helpers/",
      data:     baseDir + "/data/",
    }))
    .pipe(dest(distDir + "/"))
    .pipe(browserSync.stream());
}

function scripts() {
  return src(
    [ `${baseDir}/assets/js/*.js`, `!${baseDir}/assets/js/*.min.js)` ],
    { base: baseDir + '/assets/js/' })
    .pipe(plumber({
      errorHandler: function (err) {
        notify.onError({
          title: "JS Error",
          message: "Error: <%= error.message %>",
        })(err);
        this.emit("end");
      },
    }))
    .pipe(webpack({
      mode: "production",
      performance: {
        hints: false,
      },
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            loader: "babel-loader",
            query: {
              presets: ["@babel/env"],
              plugins: ["babel-plugin-root-import"],
            },
          },
        ],
      },
    }))
    .pipe(rename("app.min.js"))
    .pipe(dest(distDir + "/assets/js"))
    .pipe(browserSync.stream());
}

function styles() {
  return src(baseDir + '/assets/sass/main.sass', { base: baseDir + '/assets/sass/' })
    .pipe(sassglob())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ overrideBrowserslist: ["last 10 versions"], grid: true }))
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } /*, format: 'beautify' */}))
    .pipe(rename({ suffix: ".min", extname: ".css" }))
    .pipe(dest(distDir + "/assets/css"))
    .pipe(browserSync.stream());
}

function css() {
  return src(baseDir + "/assets/sass/*.*", { base: baseDir + '/assets/sass/' })
    .pipe(
      plumber({
        errorHandler: function (err) {
          notify.onError({
            title: "SASS/SCSS Error",
            message: "Error: <%= error.message %>",
          })(err);
          this.emit("end");
        },
      })
    )
    .pipe(sassglob())
    .pipe(sass())
    .pipe(cleancss({ level: { 1: { specialComments: 0 } }, format: 'beautify' }))
    .pipe(rename({ suffix: ".min", extname: ".css" }))
    .pipe(dest(distDir + "/assets/css"))
    .pipe(browserSync.stream());
}

function images() {
  return src(baseDir + "/assets/src/**/*", { base: baseDir + "/assets/src/" })
    .pipe(newer(distDir + "/assets/images/"))
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 95, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({plugins: [{removeViewBox: true}, {cleanupIDs: false}]})
    ], {verbose: "true",}))
    .pipe(dest(distDir + "/assets/images/"))
    .pipe(browserSync.stream());
}

function assetscopy() {
  return src(
    [
      baseDir + "/assets/fonts/**/*",
      baseDir + "/assets/vendor/**/*",
    ],
    { base: baseDir + "/" }
  ).pipe(dest(distDir + "/"));
}

function cleandist() {
  return del(distDir + "/**/*", { force: true });
}

function deploy() {
  return src(distDir + "/").pipe(
    rsync({
      root: distDir + "/",
      hostname: "username@yousite.com",
      destination: "yousite/public_html/",
      // clean: true, // Mirror copy with file deletion
      include: [
        /* '*.htaccess' */
      ], // Included files to deploy,
      exclude: ["**/Thumbs.db", "**/*.DS_Store"],
      recursive: true,
      archive: true,
      silent: false,
      compress: true,
    })
  );
}

function startwatch() {
  watch( baseDir + '/**/*.html', { usePolling: true }, html );
  watch( baseDir + '/assets/sass/**/*', { usePolling: true }, css );
  watch( baseDir + '/assets/js/**/*.js', { usePolling: true	}, scripts );
  watch( baseDir + '/assets/src/**/*.{jpg,jpeg,png,webp,svg,gif}', { usePolling: true	}, images );
  watch( baseDir + '/**/*.{html,htm,php,txt,json,md,woff2}', { usePolling: true }).on("change", browserSync.reload );
}

exports.html = html;
exports.scripts = scripts;
exports.styles = styles;
exports.css = css;
exports.images = images;
exports.deploy = deploy;
exports.build = series(cleandist, html, scripts, styles, images, assetscopy);
exports.default = series(cleandist, html, scripts, css, images, assetscopy, parallel(browsersync, startwatch));
