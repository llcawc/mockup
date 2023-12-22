// assets.js

// require
// import gulp from 'gulp'
// const { src, dest, parallel, series, watch } = gulp
import { deleteAsync as del } from 'del'

// variables & paths
// const baseDir = 'src'
const distDir = 'dist'
let paths = {
  del: [
    distDir + '/*',
    distDir + '/assets/*',
    '!' + distDir + '/assets',
    '!' + distDir + '/assets/images',
    '!' + distDir + '/assets/images/*.{jpg,png,svg}',
  ],
}

function clean() {
  return del(paths.del)
}

// export
export { clean }
