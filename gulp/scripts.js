// scripts.js

// import modules
import { env } from 'process'
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import { rollup } from 'rollup'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { minify } from "terser"
import gulpTerser from "gulp-terser"

// variables & path
const baseDir = 'src'
const distDir = 'dist'
let paths = {
  src:  baseDir + '/assets/scripts/main.js',
  min:  distDir + '/assets/js/main.min.js',
  dest: distDir + '/assets/js',
}

// task
async function scripts() {
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
  if (env.BUILD === 'production') {
    return src(paths.min)
      .pipe(gulpTerser({compress: {passes: 2}, format: {comments: false}}, minify))
      .pipe(dest(paths.dest))
  }
}

// export
export { scripts }
