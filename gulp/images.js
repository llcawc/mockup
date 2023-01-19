// images.js

// require
import gulp from 'gulp'
const { src, dest, parallel, series } = gulp
import imagemin from 'gulp-imagemin'
import imageminWebp from 'imagemin-webp'
import imageminSvgo from 'imagemin-svgo'
import changed from 'gulp-changed'
import rename from 'gulp-rename'

// variables & patch
const baseDir = 'src'
const distDir = 'dist'
let paths = {
  src:  baseDir + '/assets/images/**/*.{jpg,png,gif}',
  svg:  baseDir + '/assets/images/**/*.svg',
  webp: distDir + '/assets/images/webp',
  dest: distDir,
}

// images build task
function makeimg() {
  return src(paths.src, { base: baseDir })
    .pipe(changed(paths.dest))
    .pipe(imagemin({ verbose: 'true' }))
    .pipe(dest(paths.dest))
}
function makesvg() {
  return src(paths.svg, { base: baseDir })
  .pipe(changed(paths.dest))
  .pipe(imagemin([
    imageminSvgo({
      plugins: [{ name: 'preset-default', params: { overrides: { removeViewBox: false } } }]
    })
  ], { verbose: true }))
  .pipe(dest(paths.dest))
}
function makewebp() {
  return src(paths.src, { base: baseDir + '/assets/images'})
    .pipe(imagemin([imageminWebp({ quality: 50 })], { verbose: 'true' }))
    .pipe(rename({ extname: '.webp' }))
    .pipe(dest(paths.webp))
}

// export
export let images = series(makeimg, makesvg, makewebp)
