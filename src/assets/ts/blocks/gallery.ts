// gallery.js

import Shuffle from 'shufflejs'

const gall = document.getElementById('gallery-grid')
const options = {
  itemSelector: '.gallery-item',
  sizer: '.gallery-shuffle-sizer',
}

const all = document.getElementById('all')
const ass = document.getElementById('foo')
const bas = document.getElementById('bar')
const das = document.getElementById('baz')

if (all && ass && bas && das) {
  if (gall) {
    const shuffleGallery = new Shuffle(gall, options)

    all.addEventListener(
      'click',
      (event) => {
        event.preventDefault()
        shuffleGallery.filter('all')
      },
      false
    )
    ass.addEventListener(
      'click',
      (event) => {
        event.preventDefault()
        shuffleGallery.filter('foo')
      },
      false
    )
    bas.addEventListener(
      'click',
      (event) => {
        event.preventDefault()
        shuffleGallery.filter('bar')
      },
      false
    )
    das.addEventListener(
      'click',
      (event) => {
        event.preventDefault()
        shuffleGallery.filter('baz')
      },
      false
    )
  }
}
