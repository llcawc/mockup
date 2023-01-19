// htmlbau.js

// import modules
import { env } from 'process'
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import nunjucks from 'gulp-nunjucks' // About nunjucks: https://mozilla.github.io/nunjucks/
import prettier from 'gulp-prettier'
import minify from 'gulp-htmlmin'
import chalk from 'chalk'

// variables & path
const baseDir = 'src'
const distDir = 'dist'

// html assembly task
function assemble() {
  console.log(env.BUILD === 'production' ? chalk.green('Nunjuks running OK!'):chalk.magenta('Nunjuks running OK!'))
  return src(baseDir +'/*.{html,htm,njk}', { base: baseDir })
    .pipe(nunjucks.compile().on('Error', function(error){ console.log(error) }))
    .pipe(prettier({ parser: "html" }))
    .pipe(dest(distDir))
}

// html minify task
function htmlmin() {
  console.log(chalk.green('HTML minify running OK!'))
  return src(distDir + '/*.html')
    .pipe(minify({ removeComments: true, collapseWhitespace: true }))
    .pipe(dest(distDir))
}

// export
export let htmlbau = env.BUILD === 'production' ? series( assemble, htmlmin ) : assemble
