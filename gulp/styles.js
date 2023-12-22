// styles.js

// import modules
import { env } from 'process'
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import * as sassDark from 'sass'
import sassGulp from 'gulp-sass'
const sass = sassGulp(sassDark)
import purgecss from 'gulp-purgecss'
import postCss from 'gulp-postcss'
import csso from 'postcss-csso'
import autoprefixer from 'autoprefixer'
import rename from 'gulp-rename'

// variables & path
const baseDir = 'src'
const distDir = 'dist'
let paths = {
  src: [
    baseDir + '/assets/sass/main.*',
    baseDir + '/assets/sass/fonts.*',
  ],
  dest:   distDir + '/assets/css',
  reject: baseDir + '/assets/css',
  purge: {
    content: [
      baseDir + '/**/*.{html,htm,hbs}',
      baseDir + '/assets/scripts/**/*.js',
      baseDir + '/assets/sass/blocks/_pswp.scss',
      'node_modules/bootstrap/js/dist/dom/*.js',
      'node_modules/bootstrap/js/dist/{base-component,button,dropdown,collapse}.js',
    ],
    // css: [],
    safelist: {
      // standart: ["selectorname"],
      deep: [/scrolltotop$/, /:focus-visible$/, /dark-blur-body$/],
      greedy: [/on$/, /down$/, /is-hidden$/],
    },
    keyframes: true,
  },
}

// task
function styles() {
  if (env.BUILD === 'production') {
    return src(paths.src)
      .pipe(sass.sync())
      .pipe(purgecss(paths.purge))
      .pipe(postCss([ autoprefixer, csso({ comments: false }),]))
      .pipe(rename({suffix: '.min'}))
      .pipe(dest(paths.dest))
  } else {
    return src(paths.src, { sourcemaps: true })
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(rename({suffix: '.min'}))
      .pipe(dest(paths.dest, { sourcemaps: '.' }))
  }
}

// task view rejected styles
function reject() {
  paths.purge.rejected = true
  return src(paths.src)
    .pipe(sass.sync())
    .pipe(purgecss(paths.purge))
    .pipe(rename({suffix: '.rejected'}))
    .pipe(dest(paths.reject))
}

// export
export { styles, reject }
