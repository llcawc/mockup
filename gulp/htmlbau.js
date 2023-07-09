// htmlbau.js

// import modules
import { env } from 'process'
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import panini from 'panini' // panini documentation: https://get.foundation/sites/docs/panini.html
import prettier from 'gulp-prettier'
import minify from 'gulp-htmlmin'
import rename from 'gulp-rename'

// variables & path
const baseDir = 'src'
const distDir = 'dist'
const paniset = {
  root:     baseDir + '/pages/',
  layouts:  baseDir + '/layouts/',
  partials: baseDir + '/includes/',
  helpers:  baseDir + '/helpers/',
  data:     baseDir + '/data/',
}

// html assembly task
function assemble() {
  panini.refresh()
  return src(baseDir +'/pages/*.hbs')
    .pipe(panini(paniset))
    .pipe(prettier({ parser: "html" }))
    .pipe(rename({ extname: '.html' }))
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
