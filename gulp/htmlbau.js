// htmlbau.js

// import modules
import { env } from 'process'
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import pug from 'gulp-pug'
import minify from 'gulp-htmlmin'

// variables & path
const baseDir = 'src'
const distDir = 'dist'

// html assembly task
function assemble() {
  return src(baseDir +'/pages/*.pug')
    .pipe(pug({ pretty: true }))
    .pipe(dest(distDir))
}

// html minify task
function htmlmin() {
  return src(distDir + '/*.html')
    .pipe(minify({ removeComments: true, collapseWhitespace: true }))
    .pipe(dest(distDir))
}

// export
export let htmlbau = env.BUILD === 'production' ? series( assemble, htmlmin ) : assemble
