// images.js

// import modules
import { env } from 'process'
import gulp from 'gulp'
const { src, dest, parallel, series } = gulp
import imagemin from 'gulp-imagemin'
import changed from 'gulp-changed'
import chalk from 'chalk'

// variables & patch
const baseDir = 'src'
const distDir = 'dist'
let paths = {
  src:  baseDir + '/assets/images/**/*.{jpg,png,svg}',
  dest: distDir,
}

// images resize task
function images() {
  console.log(env.BUILD === 'production' ? chalk.green('Images transform OK!'):chalk.magenta('Images transform OK!'))
  return src(paths.src, { base: baseDir })
    .pipe(changed(paths.dest))
    .pipe(imagemin({ verbose: 'true' }))
    .pipe(dest(paths.dest))
}

// export
export { images }
