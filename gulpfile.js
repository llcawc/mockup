// gulpfile.js for Mockup Template Starter by pasmurno
// repositary: https://github.com/llcawc/mockup.git

// VARIABLES & PATHS

let fileswatch   = 'html,htm,php,txt,json,md,woff2', // List of files extensions for watching & hard reload (comma separated)
    imageswatch  = 'jpg,jpeg,png,webp,svg,gif', // List of images extensions for watching & compression (comma separated)
    baseDir      = 'app', // Base directory path without «/» at the end
    distDir      = 'dist', // Distribution folder for uploading to the site
    localhost    = 'mockup';  // If you run a local server

let paths = {

  scripts: {
    src:  baseDir + '/assets/js/app.js',
    dest: distDir + '/assets/js',
  },

  styles: {
    src:  baseDir + '/assets/sass/main.sass',
    dest: distDir + '/assets/css',
  },

  images: {
    src:  baseDir + '/assets/src/*',
    dest: baseDir + '/assets/images',
  },

  deploy: {
    hostname:    'username@yousite.com', // Deploy hostname
    destination: 'site/www/', // Deploy destination
    include:     [/* '*.htaccess' */], // Included files to deploy
    exclude:     [ '**/Thumbs.db', '**/*.DS_Store' ], // Excluded files from deploy
  },

  build: {
    src: [
      baseDir + '/assets/fonts/**/*',
      baseDir + '/assets/images/**/*',
      baseDir + '/assets/vendor/**/*',
      baseDir + '/php/**/*',
      baseDir + '/.htaccess',
    ],
  },

  cssOutputName: 'main.min.css',
  jsOutputName:  'app.min.js',

}

// LOGIC

const { src, dest, parallel, series, watch } = require("gulp");
const browserSync  = require("browser-sync").create();
const webpack      = require("webpack-stream");
const sass         = require("gulp-sass");
const sassglob     = require("gulp-sass-glob");
const plumber      = require("gulp-plumber");
const cleancss     = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps   = require('gulp-sourcemaps');
const imagemin     = require("gulp-imagemin");
const rename       = require("gulp-rename");
const notify       = require("gulp-notify");
const rsync        = require('gulp-rsync');
const newer        = require("gulp-newer");
const panini       = require("panini");
const del          = require('del');

function browsersync() {
  browserSync.init({
    server: { baseDir: distDir + "/", },
    // proxy: { target: `http://${localhost}`, }, // use only server or only proxy
    notify: false,
    online: true,   // If «false» - Browsersync will work offline without internet connection
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
  return src(paths.scripts.src)
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
        rules: [{
          test: /\.(js)$/,
          exclude: /(node_modules)/,
          loader: "babel-loader",
          query: {
            presets: ["@babel/env"],
            plugins: ["babel-plugin-root-import"],
          },
        }, ],
      },
    }))
    .pipe(rename(paths.jsOutputName))
    .pipe(dest(paths.scripts.dest))
    .pipe(browserSync.stream())
}

function css() {
  return src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(plumber({
      errorHandler: function (err) {
        notify.onError({
          title: "SASS/SCSS Error",
          message: "Error: <%= error.message %>",
        })(err);
        this.emit("end");
      },
    }))
    .pipe(sassglob())
    .pipe(sass())
    .pipe(cleancss({ level: {1: {specialComments: 0 }}, format: 'beautify' }))
    .pipe(rename(paths.cssOutputName))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream())
}

function styles() {
  return src(paths.styles.src)
    .pipe(sassglob())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ overrideBrowserslist: ["last 10 versions"], grid: true }))
    .pipe(cleancss({ level: {1: {specialComments: 0 }} /*, format: 'beautify' */ }))
    .pipe(rename(paths.cssOutputName))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream())
}

function images() {
  return src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(imagemin({verbose: "true" }))
    .pipe(dest(paths.images.dest))
    .pipe(browserSync.stream());
}

function deploy() {
  return src(baseDir + '/')
  .pipe(rsync({
    root: baseDir + '/',
    hostname: paths.deploy.hostname,
    destination: paths.deploy.destination,
    // clean: true, // Mirror copy with file deletion
    include: paths.deploy.include,
    exclude: paths.deploy.exclude,
    recursive: true,
    archive: true,
    silent: false,
    compress: true
  }))
}

function assetscopy() {
  return src(paths.build.src, { base: baseDir }) // "base" saves the project structure when copying
  .pipe(dest(distDir)) // Unload the assets folder
}

function cleandist() {
  return del([distDir + "/**/*", distDir + '/.htaccess'], { force: true }) // Удаляем всё содержимое папки "dist/"
}

function startwatch() {
  watch( baseDir + '/**/*.html', { usePolling: true }, html );
  watch( baseDir + '/assets/sass/**/*', { usePolling: true }, css );
  watch( baseDir + '/assets/js/app.js', { usePolling: true	}, scripts );
  watch( baseDir + '/assets/src/**/*.{' + imageswatch + '}', { usePolling: true	}, images );
  watch( baseDir + '/**/*.{' + fileswatch +'}', { usePolling: true }).on("change", browserSync.reload );
}

exports.html        = html;
exports.css         = css;
exports.styles      = styles;
exports.scripts     = scripts;
exports.images      = images;
exports.cleandist   = cleandist;
exports.deploy      = deploy;
exports.build       = series(cleandist, html, styles, scripts, images, assetscopy);
exports.default     = series(cleandist, html, css, scripts, images, assetscopy, parallel(browsersync, startwatch));
