// assets.js

// require
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import { deleteAsync as del } from 'del'

// variables & paths
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
let paths = {
  copy: {
    src: [baseDir + '/assets/fonts/**/*'],
    dest: distDir,
    base: baseDir,
  },
  bif: {
    src: 'node_modules/bootstrap-icons/font/fonts/**/*',
    dest: distDir + '/assets/fonts/bootstrap-icons',
  },
  del: {
    src: [
      distDir + '/**',
      distDir + '/assets/**',
      '!' + distDir + '/assets',
      '!' + distDir + '/assets/images',
      '!' + distDir + '/assets/images/*.{jpg,png,svg,webp}',
    ],
    all: [ distDir ],
  },
}

// tasks
function assets() {
  return src(paths.copy.src, { base: paths.copy.base }).pipe(dest(paths.copy.dest))
}
function bifcopy() {
  return src(paths.bif.src).pipe(dest(paths.bif.dest))
}
function clean() {
  return del(paths.del.src)
}
function cleanall() {
  return del(paths.del.all)
}

// export
let assetscopy = series(assets, bifcopy)
export { assetscopy, clean, cleanall }
