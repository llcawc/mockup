// images.js

// import modules
import { env } from 'process'
import gulp from 'gulp'
const { src, dest, parallel, series } = gulp
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin'
import imageminWebp from 'imagemin-webp'
import changed from 'gulp-changed'
import rename from 'gulp-rename'
import chalk from 'chalk'

// variables & patch
const baseDir = 'src'
const distDir = 'dist'
let paths = {
  src:  baseDir + '/assets/images/**/*.{jpg,png,svg,gif}',
  webp: distDir + '/assets/images/webp',
  dest: distDir,
}

// images build task
function makeimg() {
  console.log(env.BUILD === 'production' ? chalk.green('Images transfotm OK!'):chalk.magenta('Images transfotm OK!'))
  return src(paths.src, { base: baseDir })
    .pipe(changed(paths.dest))
    .pipe(imagemin([
      gifsicle({ interlaced: true }),
      mozjpeg({ quality: 75, progressive: true }),
      optipng({ optimizationLevel: 5 }),
      svgo({ plugins: [{ name: 'preset-default', params: { overrides: { removeViewBox: false }} }] })
    ], { verbose: 'true' }))
    .pipe(dest(paths.dest))
}

// webp format images task
function makewebp() {
  console.log(chalk.green('Webp transform images running OK!'))
  return src(paths.src, { base: baseDir + '/assets/images'})
    .pipe(imagemin([imageminWebp({ quality: 50 })], { verbose: 'true' }))
    .pipe(rename({ extname: '.webp' }))
    .pipe(dest(paths.webp))
}

// export
export let images = env.BUILD === 'webp' ? makewebp : makeimg
