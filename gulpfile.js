// gulpfile.js • mockup • pasmurno by llcawc • https://github.com/llcawc

// import modules
import { env } from 'node:process'
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import panini from 'panini' // panini documentation: https://get.foundation/sites/docs/panini.html
import htmlmin from 'gulp-htmlmin'
import * as sassDark from 'sass'
import sassGulp from 'gulp-sass'
const sass = sassGulp(sassDark)
import purgecss from 'gulp-purgecss'
import postCss from 'gulp-postcss'
import csso from 'postcss-csso'
import autoprefixer from 'autoprefixer'
import { rollup } from 'rollup'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import { minify } from 'terser'
import gulpTerser from 'gulp-terser'
import imagemin from 'gulp-imagemin'
import changed from 'gulp-changed'
import rename from 'gulp-rename'
import { deleteAsync as del } from 'del'
import server from 'passerve'

// variables & path
const baseDir = 'src' // Base source files path without the "/" at the end
const distDir = 'dist' // Distribution files folder to upload to the server
const configPanini = {
  root: baseDir + '/pages/',
  layouts: baseDir + '/layouts/',
  partials: baseDir + '/includes/',
  helpers: baseDir + '/helpers/',
  data: baseDir + '/data/',
}
const configPurge = {
  content: [
    baseDir + '/**/*.{html,htm,hbs}',
    baseDir + '/assets/scripts/**/*.js',
    baseDir + '/assets/sass/blocks/_pswp.scss',
    'node_modules/bootstrap/js/dist/dom/*.js',
    'node_modules/bootstrap/js/dist/{base-component,button,dropdown,collapse}.js',
  ],
  safelist: {
    // standart: ["selectorname"],
    deep: [/scrolltotop$/, /:focus-visible$/, /dark-blur-body$/],
    greedy: [/on$/, /down$/, /is-hidden$/],
  },
  keyframes: true,
}

//  server reload task
function browse() {
  server()
}

// html assembly task
function assemble() {
  panini.refresh()
  if (env.BUILD === 'production') {
    return src(baseDir + '/pages/**/*.html')
      .pipe(panini(configPanini))
      .pipe(htmlmin({ removeComments: true, collapseWhitespace: true }))
      .pipe(dest(distDir))
  } else {
    return src(baseDir + '/pages/**/*.html')
      .pipe(panini(configPanini))
      .pipe(dest(distDir))
  }
}

// scripts task
async function scripts() {
  const bundle = await rollup({
    input: baseDir + '/assets/scripts/main.js',
    plugins: [resolve(), commonjs({ include: 'node_modules/**' }), babel({ babelHelpers: 'bundled' }), json()],
  })
  await bundle.write({
    file: distDir + '/assets/js/main.min.js',
    format: 'iife',
    name: 'main',
    sourcemap: env.BUILD === 'production' ? false : true,
  })
  // minify scripts task
  if (env.BUILD === 'production') {
    return src(distDir + '/assets/js/main.min.js')
      .pipe(gulpTerser({ compress: { passes: 2 }, format: { comments: false } }, minify))
      .pipe(dest(distDir + '/assets/js'))
  }
}

// styles task
function styles() {
  if (env.BUILD === 'production') {
    return src(baseDir + '/assets/scss/*.scss')
      .pipe(sass())
      .pipe(purgecss(configPurge))
      .pipe(postCss([autoprefixer, csso({ comments: false })]))
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest(distDir + '/assets/css'))
  } else {
    return src(baseDir + '/assets/scss/*.scss', { sourcemaps: true })
      .pipe(sass().on('error', sass.logError))
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest(distDir + '/assets/css', { sourcemaps: '.' }))
  }
}
// task view rejected styles
function reject() {
  configPurge.rejected = true
  return src(baseDir + '/assets/scss/main.scss')
    .pipe(sass())
    .pipe(purgecss(configPurge))
    .pipe(rename({ suffix: '.rejected' }))
    .pipe(dest(distDir + '/assets/css'))
}

// images task
function images() {
  return src(baseDir + '/assets/images/**/*.{jpg,png,svg}', { base: baseDir })
    .pipe(changed(distDir))
    .pipe(imagemin({ verbose: 'true' }))
    .pipe(dest(distDir))
}

// copy task
function assetscopy() {
  return src([baseDir + '/assets/fonts/**/*.*', baseDir + '/assets/images/**/*.ico'], {
    base: baseDir,
  }).pipe(dest(distDir))
}
function bicopy() {
  return src('node_modules/bootstrap-icons/font/fonts/*.*').pipe(dest(distDir + '/assets/fonts/bootstrap-icons'))
}

// clean task
function clean() {
  return del([distDir + '/*', distDir + '/assets/*', '!' + distDir + '/assets', '!' + distDir + '/assets/images'], {
    force: true,
  })
}

function watchdev() {
  watch(baseDir + '/**/*.{html,htm}', parallel(assemble))
  watch(baseDir + '/assets/scripts/**/*.js', parallel(scripts))
  watch(baseDir + '/assets/scss/**/*.{scss,sass,css}', parallel(styles))
  watch(baseDir + '/assets/images/**/*.{jpg,png,svg}', parallel(images))
}

export { clean, assemble, styles, scripts, images, reject }
export let assets = series(assetscopy, bicopy, images, assemble, styles, scripts)
export let serve = parallel(watchdev, browse)
export let dev = series(clean, assets, serve)
export let build = series(clean, assets)
