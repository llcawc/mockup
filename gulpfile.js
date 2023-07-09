// gulpfile.js • mockup • pasmurno by llcawc • https://github.com/llcawc

// import modules & requires
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import browsersync from 'browser-sync'
import { htmlbau } from './gulp/htmlbau.js'
import { images } from './gulp/images.js'
import { styles } from './gulp/styles.js'
import { scripts } from './gulp/scripts.js'
import { clean, assetscopy } from './gulp/assets.js'

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
const fileswatch = 'html,htm,hbs,scss,sass,css,php,txt,js,cjs,mjs,webp,jpg,png,svg,json,md,woff2'

//  server reload task
function browserSync() {
  browsersync.init({
    server: { baseDir: distDir },
    notify: false,
    online: true,
    open:   false,
  })
}

// watch task
function watchDev() {
  watch(`./${baseDir}/**/*.{html,htm,hbs}`, { usePolling: true }, htmlbau)
  watch(`./${baseDir}/assets/scripts/**/*.{js,mjs,cjs}`, { usePolling: true }, scripts)
  watch(`./${baseDir}/assets/sass/**/*.{scss,sass,css}`, { usePolling: true }, styles)
  watch(`./${baseDir}/assets/images/**/*.{jpg,png,svg}`, { usePolling: true }, images)
  watch(`./${distDir}/**/*.{${fileswatch}}`, { usePolling: true }).on('change', browsersync.reload)
}

// export
export { htmlbau, clean, assetscopy, styles, scripts, images }
export let assets = series(htmlbau, assetscopy, styles, scripts)
export let serve = parallel(browserSync, watchDev)
export let dev = series(clean, images, assets, serve)
export let build = series(clean, images, assets)
