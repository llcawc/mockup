// styles.js

// import modules
import { env } from 'node:process'
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import sassDark from 'sass'
import sassGulp from 'gulp-sass'
const sass = sassGulp(sassDark)
import purgecss from 'gulp-purgecss'
import postCss from 'gulp-postcss'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'
import rename from 'gulp-rename'
import chalk from 'chalk'

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
let paths = {
  styles: {
    src: [
      baseDir + '/assets/sass/main.*',
      baseDir + '/assets/sass/fonts.*',
    ],
    dest: distDir + '/assets/css',
    reject: baseDir + '/assets/css',
  },
  purge: {
    content: [
      `${baseDir}/**/*.{html,htm,njk}`,
      `${baseDir}/assets/scripts/**/*.js`,
      `${baseDir}/assets/sass/blocks/_pswp.scss`,
      'node_modules/bootstrap/js/dist/dom/*.js',
      'node_modules/bootstrap/js/dist/{base-component,button,dropdown,collapse}.js',
    ],
    css: [
      'node_modules/bootstrap/scss/_reboot.scss',
    ],
    safelist: {
      // standart: ["selectorname"],
      deep: [/scrolltotop$/],
      greedy: [/on$/, /down$/, /is-hidden$/],
    },
    keyframes: true,
  },
}

// task
export function styles() {
  if (env.BUILD === 'production') {
    console.log(chalk.green('CSS build for production is running OK!'))
    return src(paths.styles.src)
      .pipe(sass.sync())
      .pipe(purgecss(paths.purge))
      .pipe(
        postCss([
          autoprefixer(),
          cssnano({
            preset: ['default', { discardComments: { removeAll: true } }],
          }),
        ])
      )
      .pipe(rename({suffix: '.min'}))
      .pipe(dest(paths.styles.dest))
  } else {
    console.log(chalk.magenta('CSS developments is running OK!'))
    return src(paths.styles.src, { sourcemaps: true })
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(rename({suffix: '.min'}))
      .pipe(dest(paths.styles.dest, { sourcemaps: '.' }))
  }
}


// task view rejected styles
export function reject() {
  paths.purge.rejected = true
  return src(paths.styles.src)
    .pipe(sass.sync())
    .pipe(purgecss(paths.purge))
    .pipe(rename({suffix: '.rejected'}))
    .pipe(dest(paths.styles.reject))
}
