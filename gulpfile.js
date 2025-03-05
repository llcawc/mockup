// gulpfile.js • mockup • pasmurno by llcawc • https://github.com/llcawc

// import modules
import { src, dest, parallel, series, watch } from 'gulp'
import imagemin from 'psimage'
import { deleteAsync } from 'del'
import licss from 'licss'
import htmlmin from 'gulp-hmin'

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

// video task
function video() {
  return src(['src/assets/video/*.*'], { encoding: false }).pipe(dest('public/assets/video'))
}

// purge styles
function css() {
  return src('src/styles/*.scss', { sourcemaps: true })
    .pipe(licss({ purgeOptions: purge }))
    .pipe(dest('dist/assets/css', { sourcemaps: '.' }))
}
async function styles() {
  return src(['dist/assets/css/*.css'])
    .pipe(licss({ minify: true, purgeOptions: purge }))
    .pipe(dest('dist/assets/css'))
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
async function clean() {
  return await deleteAsync(['public/assets/*'], {
    force: true,
  })
}

function watcher() {
  watch('src/styles/**/*.{css,sass,scss}', css)
  watch('src/assets/images/**/*.*', images)
  watch('src/assets/fonts/**/*.*', copy)
}

export { clean, copy, images, video, css, styles, hmin }
export const minify = parallel(styles, hmin)
export const assets = series(clean, copy, images, video)
export const dev = parallel(assets, watcher)
