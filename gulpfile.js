// gulpfile.js • mockup • pasmurno by llcawc • https://github.com/llcawc

// import modules
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import imagemin from 'gulp-img'
import { deleteAsync as del } from 'del'

// images task
function images() {
  return src('libs/images/**/*.*', { encoding: false }).pipe(imagemin()).pipe(dest('public/images'))
}

function copy() {
  return src(['libs/fonts/**/*.{woff,woff2}'], {
    encoding: false,
  }).pipe(dest('public/fonts'))
}

// clean task
function clean() {
  return del(['public/*'], {
    force: true,
  })
}

function watcher() {
  watch('libs/images/**/*.*', images)
}

export { clean, copy, images }
export let build = series(clean, copy, images)
export let dev = series(build, watcher)
