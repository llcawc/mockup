// gulpfile.js • mockup • nunjucks • pasmurno by llcawc • https://github.com/llcawc

// import modules
import { env } from 'node:process'
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import { nunjucksCompile } from 'gulp-nunjucks' // About nunjucks: https://mozilla.github.io/nunjucks/
import htmlmin from 'gulp-htmlmin'
import prettier from 'gulp-prettier'
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
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin'
import changed from 'gulp-changed'
import rename from 'gulp-rename'
import { deleteAsync as del } from 'del'
import server from 'passerve'

// variables & path
const baseDir = 'src'
const distDir = 'dist'
// prettier-ignore
const paths = {
  purge: {
    content: [
      baseDir + '/**/*.{html,htm,njk}',
      baseDir + '/assets/ts/**/*.*',
      baseDir + '/assets/scss/blocks/_pswp.scss',
      baseDir + '/libs/bootstrap/js/dist/dom/*.js',
      baseDir + '/libs/bootstrap/js/dist/{collapse,dropdown}.js',
    ],
    safelist: [],
    keyframes: true,
  },
}

//  server reload task
function browse() {
  server()
}

// html assembly task
function assemble() {
  if (env.BUILD === 'production') {
    return src(baseDir + '/*.{njk,htm,html}', { base: baseDir })
      .pipe(nunjucksCompile().on('Error', (err) => console.log(err)))
      .pipe(htmlmin({ removeComments: true, collapseWhitespace: true }))
      .pipe(dest(distDir))
  } else {
    return src(baseDir + '/*.{njk,htm,html}', { base: baseDir })
      .pipe(nunjucksCompile().on('Error', (err) => console.log(err)))
      .pipe(prettier({ parser: 'html' }))
      .pipe(dest(distDir))
  }
}

// scripts task
async function scripts() {
  const bundle = await rollup({
    input: baseDir + '/assets/ts/main.ts',
    plugins: [
      typescript({ compilerOptions: { lib: ['DOM', 'ES2015'], target: 'ES6' } }),
      resolve(),
      commonjs({ include: 'node_modules/**' }),
      babel({ babelHelpers: 'bundled' }),
    ],
  })
  await bundle.write({
    file: distDir + '/assets/js/main.min.js',
    format: 'iife',
    name: 'main',
    plugins: env.BUILD === 'production' ? [terser({ format: { comments: false } })] : [],
    sourcemap: env.BUILD === 'production' ? false : true,
  })
}

// bootstrap scripts task
async function boots() {
  const bootstrap = await rollup({
    input: baseDir + '/assets/ts/boots.ts',
    plugins: [
      typescript({ compilerOptions: { lib: ['DOM', 'ES2015'], target: 'ES6' } }),
      resolve(),
      commonjs({ include: 'node_modules/**' }),
      babel({ babelHelpers: 'bundled' }),
    ],
  })
  await bootstrap.write({
    file: distDir + '/assets/js/boots.min.js',
    format: 'iife',
    name: 'bootstrap',
    plugins: env.BUILD === 'production' ? [terser({ format: { comments: false } })] : [],
    sourcemap: env.BUILD === 'production' ? false : true,
  })
}

// styles task
function styles() {
  if (env.BUILD === 'production') {
    return src(baseDir + '/assets/scss/*.scss')
      .pipe(sass())
      .pipe(purgecss(paths.purge))
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

// images task
function images() {
  return src(baseDir + '/assets/images/**/*.*', { base: baseDir, encoding: false })
    .pipe(changed(distDir))
    .pipe(
      imagemin(
        [
          gifsicle({ interlaced: true }),
          mozjpeg({ quality: 75, progressive: true }),
          optipng({ optimizationLevel: 5 }),
          svgo({ plugins: [{ name: 'preset-default', params: { overrides: { removeViewBox: false } } }] }),
        ],
        { verbose: true }
      )
    )
    .pipe(dest(distDir))
}

// copy task
function bicopy() {
  return src(baseDir + '/libs/bootstrap-icons/font/fonts/*.woff2', { encoding: false })
    .pipe(rename({ basename: 'bi-font' }))
    .pipe(dest(distDir + '/assets/fonts/biFont'))
}
function copy() {
  return src([baseDir + '/assets/fonts/**/*.*', baseDir + '/.htaccess'], { base: baseDir, encoding: false }).pipe(dest(distDir))
}

// clean task
// prettier-ignore
function clean() {
  return del(
    [ distDir + '/*',
      distDir + '/assets/*',
      '!' + distDir + '/assets',
      '!' + distDir + '/assets/images'
    ], { force: true })
}

function watcher() {
  watch(baseDir + '/**/*.{html,htm,njk}', { usePolling: true }, parallel(assemble, styles))
  watch(baseDir + '/assets/{ts,scripts}/**/*.{ts,js,json}', { usePolling: true }, parallel(scripts, boots))
  watch(baseDir + '/assets/scss/**/*.{scss,sass,css}', { usePolling: true }, parallel(styles))
  watch(baseDir + '/assets/images/**/*.{jpg,png,svg,gif}', { usePolling: true }, parallel(images))
}

export { clean, bicopy, copy, assemble, styles, scripts, boots, images }
export let assets = parallel(copy, bicopy, images, assemble, styles, scripts, boots)
export let serve = parallel(watcher, browse)
export let dev = series(clean, assets, serve)
export let build = series(clean, assets)
