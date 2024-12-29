// gulpfile.js • mockup • pasmurno by llcawc • https://github.com/llcawc

// import modules
import gulp from 'gulp'
import imagemin from 'gulp-img'
import purgecss from 'gulp-purgecss'
import { deleteAsync as del } from 'del'
import htmlmin from 'gulp-hmin'
const { src, dest, parallel, series, watch } = gulp
const purge = {
  content: [
    'src/**/*.{ts,js,twig,html}',
    'src/styles/blocks/_lightbox.scss',
    'vendor/bootstrap/js/dist/dom/*.js',
    'vendor/bootstrap/js/dist/{base-component,alert,button,dropdown}.js',
  ],
  safelist: [/scrolltotop$/, /on$/, /down$/],
  keyframes: true,
}

// images task
function images() {
  return src(['src/assets/images/icon/*.*', 'src/assets/images/thumb/*.*', 'src/assets/images/*.*'], {
    encoding: false,
  })
    .pipe(imagemin())
    .pipe(dest('public/assets/images'))
}

// purge styles
function styles() {
  return src('dist/assets/css/main.css').pipe(purgecss(purge)).pipe(dest('dist/assets/css'))
}

function copy() {
  return src(
    [
      'src/assets/fonts/bootstrap-icons/*.woff*',
      'src/assets/fonts/Inter/*.woff*',
      'src/assets/fonts/JetBrains/*.woff*',
    ],
    {
      encoding: false,
    }
  ).pipe(dest('public/assets/fonts'))
}

// minify html
function hmin() {
  return src('dist/*.html')
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true, minifyJS: true, minifyCSS: true }))
    .pipe(dest('dist'))
}

// clean task
function clean() {
  return del(['public/assets/*'], {
    force: true,
  })
}

function watcher() {
  watch('src/assets/images/**/*.*', images)
  watch('src/assets/fonts/**/*.*', copy)
}

export { clean, copy, images, styles, hmin }
export const minify = parallel(styles, hmin)
export const assets = series(clean, copy, images)
export const dev = parallel(assets, watcher)
