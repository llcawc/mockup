// assets.js

// require
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import { deleteAsync as del } from 'del'

// variables & paths
const baseDir = 'src'
const distDir = 'dist'
let paths = {
  copy: {
    src:  baseDir + '/assets/fonts/**/*',
    dest: distDir,
    base: baseDir,
  },
  bi: {
    src: 'node_modules/bootstrap-icons/font/fonts/**/*',
    dest: distDir + '/assets/fonts/bootstrap-icons',
  },
  del: [
    distDir + '/*',
    distDir + '/assets/*',
    '!' + distDir + '/assets',
    '!' + distDir + '/assets/images',
    '!' + distDir + '/assets/images/*.{jpg,png,svg}',
  ],
}

// tasks
function assetscopy() {
  return src(paths.copy.src, { base: paths.copy.base }).pipe(dest(paths.copy.dest))
}
function bicopy() {
  return src(paths.bi.src).pipe(dest(paths.bi.dest))
}
function clean() {
  return del(paths.del)
}

// export
let copy = series(assetscopy, bicopy)
export { clean, copy }
