// htmlbau.js

// import modules
import { env } from 'process'
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import pug from 'gulp-pug'
import chalk from 'chalk'

// variables & path
const baseDir = 'src'
const distDir = 'dist'

// html assembly task
function htmlbau() {
  console.log(env.BUILD === 'production' ? chalk.green('Pug running OK!'):chalk.magenta('Pug running OK!'))
  return src(baseDir +'/pages/**/*.pug', {base: baseDir + '/pages'})
    .pipe(pug(env.BUILD === 'production' ? {} : { pretty: true }))
    .pipe(dest(distDir))
}

// export
export { htmlbau }
