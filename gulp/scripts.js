// scripts.js

// import modules
import { env } from 'node:process'
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import { rollup } from 'rollup'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { minify } from "terser"
import gulpTerser from "gulp-terser"

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
let paths = {
  src:  baseDir + '/assets/scripts/main.js',
  min:  distDir + '/assets/js/main.min.js',
  dest: distDir + '/assets/js',
}

// task
async function compile() {
  const bundle = await rollup({
    input: paths.src,
    plugins: [nodeResolve(), commonjs({ include: 'node_modules/**' }), babel({ babelHelpers: 'bundled' })],
  })
  await bundle.write({
    file: paths.min,
    format: 'iife',
    name: 'main',
    sourcemap: env.BUILD === 'production' ? false : true,
  })
}

// minify scripts task
function min() {
  return src(paths.min)
    .pipe(gulpTerser({compress: {passes: 2}, format: {comments: false}}, minify))
    .pipe(dest(paths.dest))
}

// export
export let scripts = env.BUILD === 'production' ? series(compile, min) : compile
