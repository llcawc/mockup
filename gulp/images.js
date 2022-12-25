// images.js

// require
import gulp from 'gulp'
const { src, dest, parallel, series } = gulp
import imagemin from 'gulp-imagemin'
import changed from 'gulp-changed'

// variables & patch
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
let paths = {
  images: {
    src: baseDir + '/assets/images/**/*.{jpg,png,svg}',
    dest: distDir,
  },
}

// task
export function images() {
  return src(paths.images.src, { base: baseDir })
    .pipe(changed(paths.images.dest))
    .pipe(imagemin({ verbose: 'true' }))
    .pipe(dest(paths.images.dest))
}
