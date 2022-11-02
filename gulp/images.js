// images.js

// variables & patch
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
let paths = {
  images: {
    src: baseDir + '/assets/images/**/*.{jpg,png,gif}',
    svg: baseDir + '/assets/images/**/*.svg',
    webp: distDir + '/assets/images/webp',
    dest: distDir,
  },
}

// require
import gulp from 'gulp'
const { src, dest, parallel, series } = gulp
import imagemin, { mozjpeg } from 'gulp-imagemin'
import imageminWebp from 'imagemin-webp'
import imageminSvgo from 'imagemin-svgo'
import changed from 'gulp-changed'
import rename from 'gulp-rename'

// task
function makeimg() {
  return src(paths.images.src, { base: baseDir })
    .pipe(changed(paths.images.dest))
    .pipe(imagemin([mozjpeg({quality: 75, progressive: true})], { verbose: 'true' }))
    .pipe(dest(paths.images.dest))
}
function makesvg() {
  return src(paths.images.svg, { base: baseDir })
  .pipe(changed(paths.images.dest))
  .pipe(imagemin([
    imageminSvgo({
      plugins: [{ name: 'preset-default', params: { overrides: { removeViewBox: false } } }]
    })
  ], { verbose: true }))
  .pipe(dest(paths.images.dest))
}
function makewebp() {
  return src(paths.images.src, { base: baseDir + '/assets/images'})
    .pipe(imagemin([imageminWebp({ quality: 50 })], { verbose: 'true' }))
    .pipe(rename({ extname: '.webp' }))
    .pipe(dest(paths.images.webp))
}

// export
let images = series(makeimg, makesvg)
export { images, makewebp }
