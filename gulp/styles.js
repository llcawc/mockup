// styles.js

// import modules
import { env } from 'process'
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import sassDark from 'sass'
import sassGulp from 'gulp-sass'
const sass = sassGulp(sassDark)
import purgecss from 'gulp-purgecss'
import postCss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import csso from 'postcss-csso'
import rename from 'gulp-rename'
import chalk from 'chalk'

// variables & path
const baseDir = 'src'
const distDir = 'dist'
let paths = {
  src: [
    baseDir + '/assets/sass/main.*',
    baseDir + '/assets/sass/fonts.*',
  ],
  dest:   distDir + '/assets/css',
  reject: distDir + '/assets/css',
  purge: {
    content: [
      distDir + '/**/*.html',
      distDir + '/assets/js/**/*.js',
      baseDir + '/assets/sass/blocks/_pswp.scss',
      'node_modules/bootstrap/js/dist/dom/*.js',
      'node_modules/bootstrap/js/dist/{base-component,button,dropdown,collapse}.js',
    ],
    safelist: [/scrolltotop$/,/:focus-visible$/,/open-share/,/dark-blur-body$/,/on$/,/down$/,/is-hidden$/,],
    keyframes: true,
  },
}

// task
function cssbau() {
  if (env.BUILD === 'production') {
    console.log(chalk.green('Styles build OK!'))
    return src(paths.src)
      .pipe(sass.sync())
      .pipe(purgecss(paths.purge))
      .pipe(postCss([ autoprefixer, csso({ comments: false }), ]))
      .pipe(rename({suffix: '.min'}))
      .pipe(dest(paths.dest))
  } else {
    console.log(chalk.magenta('Styles build OK!'))
    return src(paths.src, { sourcemaps: true })
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(rename({suffix: '.min'}))
      .pipe(dest(paths.dest, { sourcemaps: '.' }))
  }
}

// task view rejected styles
function cssreject() {
  paths.purge.rejected = true
  return src(paths.src)
    .pipe(sass.sync())
    .pipe(purgecss(paths.purge))
    .pipe(rename({suffix: '.rejected'}))
    .pipe(dest(paths.reject))
}

// export
export let styles = env.BUILD === 'production' ? cssbau : series(cssbau, cssreject)
