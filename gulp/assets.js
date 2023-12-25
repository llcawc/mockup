// assets.js

// require
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import { deleteAsync as del } from 'del'

// variables & paths
const baseDir = 'src'
const distDir = 'dist'
let paths = {
  copy: [
    baseDir + '/assets/fonts/**/*.*'
  ],
  del: [
    distDir + '/*',
    distDir + '/assets/*',
    '!' + distDir + '/assets',
    '!' + distDir + '/assets/images',
    '!' + distDir + '/assets/images/*.{jpg,png,svg}',
  ],
}

function copy() {
  return src(paths.copy, { base: baseDir }).pipe(dest(distDir))
}

function clean() {
  return del(paths.del)
}

// export
export { clean, copy }
