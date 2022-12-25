// gulpfile.js

// import modules & requires
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import browsersync from 'browser-sync'
import { html, htmlmin } from './gulp/html.js'
import { deploy } from './gulp/deploy.js'
import { images } from './gulp/images.js'
import { styles, reject } from './gulp/styles.js'
import { scripts } from './gulp/scripts.js'
import { clean, cleanall, assetscopy } from './gulp/assets.js'

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
const fileswatch = 'html,htm,css,php,txt,js,cjs,mjs,webp,jpg,png,svg,json,md,woff2'

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
function watchstart() {
  watch(`./${baseDir}/**/*.{html,htm,njk}`, { usePolling: true }, html)
  watch(`./${baseDir}/assets/scripts/**/*.{js,mjs,cjs}`, { usePolling: true }, scripts)
  watch(`./${baseDir}/assets/sass/**/*.{scss,sass,css,pcss}`, { usePolling: true }, styles)
  watch(`./${baseDir}/assets/images/**/*.{jpg,png,svg}`, { usePolling: true }, images)
  watch(`./${distDir}/**/*.{${fileswatch}}`, { usePolling: true }).on('change', browsersync.reload)
}

// export
export { html, htmlmin, clean, cleanall, assetscopy, styles, reject, scripts, images, deploy }
export let assets = series(html, assetscopy, styles, scripts)
export let serve = parallel(browserSync, watchstart)
export let dev = series(clean, images, assets, serve)
export let build = series(clean, images, assets)
