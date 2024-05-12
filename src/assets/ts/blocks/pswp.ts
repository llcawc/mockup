// pswp.js
// open image gallery with share button
'use strict'

import PhotoSwipe from 'photoswipe'
import PhotoSwipeLightbox from 'photoswipe/lightbox'

const leftArrowSVGString =
  '<svg aria-hidden="true" class="pswp__icn" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 28 10 16 22 4" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const closeSVGstring =
  '<svg aria-hidden="true" class="pswp__icn" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.049 5.049a1.2 1.2 0 1 0-1.697-1.698L12.2 10.503 5.049 3.35a1.2 1.2 0 0 0-1.699 1.7l7.152 7.151-7.152 7.152a1.2 1.2 0 1 0 1.698 1.697l7.151-7.152 7.152 7.152a1.2 1.2 0 1 0 1.697-1.697L13.896 12.2l7.152-7.151Z" fill="#fff"/></svg>'
const zoomSVGstring =
  '<svg aria-hidden="true" class="pswp__icn" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="pswp__zoom-icn-bar-h" stroke="#fff" stroke-width="1.5" stroke-linecap="round" d="M7.828 10.72h5.5"/><path class="pswp__zoom-icn-bar-v" stroke="#fff" stroke-width="1.5" stroke-linecap="round" d="M10.577 13.385v-5.5"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10.578 2.75a7.827 7.827 0 0 0-7.828 7.828 7.827 7.827 0 0 0 7.828 7.827 7.797 7.797 0 0 0 5.129-1.915l.61.61v.872l3.529 3.529 1.654-1.655-3.529-3.529H17.1l-.61-.61a7.798 7.798 0 0 0 1.915-5.13 7.827 7.827 0 0 0-7.828-7.827ZM4.25 10.578a6.327 6.327 0 0 1 6.328-6.328 6.327 6.327 0 0 1 6.327 6.328 6.327 6.327 0 0 1-6.328 6.327 6.327 6.327 0 0 1-6.327-6.328Z" fill="#fff"/></svg>'
const shareSVGstring =
  '<svg aria-hidden="true" class="pswp__icn" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 16.137c-.76 0-1.44.3-1.96.773l-7.13-4.167A3.3 3.3 0 0 0 9 12.04a3.3 3.3 0 0 0-.09-.703l7.05-4.126a2.98 2.98 0 0 0 2.04.813c1.66 0 3-1.345 3-3.012A3.002 3.002 0 0 0 18 2c-1.66 0-3 1.345-3 3.012 0 .241.04.472.09.703L8.04 9.84A2.98 2.98 0 0 0 6 9.028c-1.66 0-3 1.345-3 3.012a3.002 3.002 0 0 0 3 3.012c.79 0 1.5-.311 2.04-.813l7.12 4.177c-.05.21-.08.431-.08.652A2.93 2.93 0 0 0 18 22a2.93 2.93 0 0 0 2.92-2.932A2.93 2.93 0 0 0 18 16.137Z" fill="#fff"/></svg>'

const config = {
  arrowPrevSVG: leftArrowSVGString,
  arrowNextSVG: leftArrowSVGString,
  closeSVG: closeSVGstring,
  zoomSVG: zoomSVGstring,
  bgOpacity: 0.92, // set background opacity
  gallerySelector: '.pswp-gallery',
  childSelector: 'a',
  paddingFn: (viewportSize: { x: number }) => {
    return {
      top: viewportSize.x < 1024 ? 0 : 48,
      bottom: viewportSize.x < 1024 ? 0 : 48,
      left: 0,
      right: 0,
    }
  },
  allowMouseDrag: true,
  pswpModule: PhotoSwipe,
}

const lightbox = new PhotoSwipeLightbox(config)

// open popup share button into bar
function openPopupShareButton(el) {
  const shareWrapper = document.querySelector('.psw-share-wrapper')
  if (!shareWrapper) {
    console.log('share-wrapper not found')
    return
  }
  const div = document.createElement('div')
  div.className = 'share-button-list'
  div.innerHTML = shareWrapper.innerHTML
  el.before(div)
  return div
}

// listen click button into bar for close share popup
function buttonClickListen(pswp, sharelist) {
  pswp.scrollWrap.addEventListener('click', addHandler, false)
  function addHandler(e) {
    const target = e.target
    const its_bar = target == pswp.topBar || pswp.topBar.contains(target)
    const bar_is_active = pswp.topBar != null
    if (!its_bar && bar_is_active) {
      sharelist.remove()
      pswp.scrollWrap.removeEventListener('click', addHandler, false)
    }
  }
}

// use new attribute for image size: data-size="1920x1200"
lightbox.on('itemData', (e) => {
  const { itemData } = e
  const { element } = itemData // element is children
  if (!element) {
    console.log('element in "itemData" not found')
    return
  }
  itemData.src = (<HTMLAnchorElement>element).href
  const sizeAttr = element.dataset.size // data-size
  if (!sizeAttr) {
    console.log('attribute "data-size" not found')
    return
  }
  itemData.w = Number(sizeAttr.split('x')[0])
  itemData.h = Number(sizeAttr.split('x')[1])
  itemData.thumbCropped = true
})

// insert share button into bar
lightbox.on('uiRegister', function () {
  const thisBox = lightbox.pswp
  if (!thisBox) {
    console.log('lightbox.pswp not found')
    return
  }
  if (!thisBox.ui) {
    console.log('lightbox.pswp.ui not found')
    return
  }
  thisBox.ui.registerElement({
    name: 'share',
    order: 9,
    isButton: true,
    title: 'Share',
    html: shareSVGstring,
    onClick: (event, el) => {
      const sharelist = document.querySelector('.share-button-list')
      if (sharelist === null) {
        const sharelist = openPopupShareButton(el)
        const addr = el.baseURI // current page url
        const slide = thisBox.currSlide // current slide
        if (!slide) {
          console.log('slide not found')
          return
        }
        const curl = slide.data.src // current slide image url
        setShareLink(sharelist, addr, curl) // add new link to href
        setShareLinkListen(sharelist) // replase default click as to new window open
        buttonClickListen(lightbox.pswp, sharelist)
      } else {
        sharelist.remove()
      }
    },
  })
})

// caption
lightbox.on('uiRegister', function () {
  const thisBox = lightbox.pswp
  if (!thisBox) {
    console.log('lightbox.pswp not found')
    return
  }
  if (!thisBox.ui) {
    console.log('lightbox.pswp.ui not found')
    return
  }
  thisBox.ui.registerElement({
    name: 'custom-caption',
    order: 9,
    isButton: false,
    appendTo: 'root',
    html: 'Caption text',
    onInit: (el, pswp) => {
      thisBox.on('change', () => {
        const slide = thisBox.currSlide // current slide
        if (!slide) {
          console.log('slide not found')
          return
        }
        let captionHTML = ''
        const currSlideElement = slide.data.element
        if (currSlideElement) {
          // получить заголовок из атрибута alt ...
          // captionHTML = currSlideElement.querySelector('img').getAttribute('alt')
          // получить заголовок из атрибута data-capt ...
          const img = currSlideElement.querySelector('img')
          if (!img) {
            console.log('img not found')
            return
          }
          captionHTML = img.dataset.capt || ''
        }
        el.innerHTML = captionHTML
      })
    },
  })
})

lightbox.init()
// ------------------------------------------------------------

// ------------------------------------------------------------
// add to anchors new possibility to open share window
// ------------------------------------------------------------
function setShareLinkListen(div) {
  const anchors = div.querySelectorAll('[data-link="share"]')
  anchors.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault()
      openShareWindow(el, el.href)
    })
  })
}

// ------------------------------------------------------------
// create new window for share link
// ------------------------------------------------------------
var windowShareFocus: Window | null
function openShareWindow(el, address) {
  let widthWindows = 650
  let heightWindows = 580
  let posX = window.screenX + document.documentElement.clientWidth / 2 - widthWindows / 2
  let posY = window.screenY + document.documentElement.clientHeight / 2 - heightWindows / 2
  let params = `status=no,location=no,toolbar=no,menubar=no,width=${widthWindows},height=${heightWindows},left=${posX},top=${posY}`
  if (windowShareFocus == null || windowShareFocus.closed) {
    windowShareFocus = window.open(address, 'shareWindows', params)
  } else {
    windowShareFocus.focus()
  }
}

// -------------------------------------------------------------
// set share link into anchors for current slide
// -------------------------------------------------------------

function setShareLink(div, addr, curl) {
  const link = {
    vk: 'https://vk.com/share.php?url=', // https://vk.com/share.php?url={...}&title={...}&image={...}
    tg: 'https://t.me/share/url?url=', // https://t.me/share/url?url={url}&text={text}
    pin: 'https://www.pinterest.com/pin/create/link/?url=', // https://www.pinterest.com/pin/create/link/?url={...}&media={...}&description=Next%20stop%3A%20Pinterest
    email:
      'mailto:?subject=%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82!%20%D0%97%D0%B4%D0%B5%D1%81%D1%8C%20%D0%B2%D0%B0%D0%B6%D0%BD%D0%B0%D1%8F%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B0&body=%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82!%20%D0%97%D0%B4%D0%B5%D1%81%D1%8C%20%D0%B2%D0%B0%D0%B6%D0%BD%D0%B0%D1%8F%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B0:%20',
  }

  // button vkontakte -----------------------------
  const vk = div.querySelector('.share-item--vkontakte')
  vk.href = link.vk + addr + '&image=' + curl

  // button telegram -----------------------------
  const tg = div.querySelector('.share-item--telegram')
  tg.href = link.tg + addr + '&text=' + curl

  // button pinterest -----------------------------
  const pin = div.querySelector('.share-item--pinterest')
  pin.href = link.pin + addr + '&media=' + curl + '&description=Next%20stop%3A%20Pinterest'

  // button mail send link --------------------------
  const sendEmailLinkBut = div.querySelector('.share-item--email')
  sendEmailLinkBut.href = link.email + curl + '%20'

  // button download link ------------------------------
  const downLink = div.querySelector('.share-item--down')
  downLink.href = curl
}

// ----------------------------------------------
//  display one slide
//-----------------------------------------------

const options = {
  arrowPrevSVG: leftArrowSVGString,
  arrowNextSVG: leftArrowSVGString,
  closeSVG: closeSVGstring,
  zoomSVG: zoomSVGstring,
  bgOpacity: 0.92, // set background opacity
  gallerySelector: '.pswp-one-image a',
  // showHideAnimationType: 'fade',
  paddingFn: (viewportSize) => {
    return {
      top: viewportSize.x < 1024 ? 0 : 48,
      bottom: viewportSize.x < 1024 ? 0 : 48,
      left: 0,
      right: 0,
    }
  },
  allowMouseDrag: true,
  pswpModule: PhotoSwipe,
}
const onelightbox = new PhotoSwipeLightbox(options)
onelightbox.on('itemData', (e) => {
  const { itemData } = e
  const { element } = itemData // element is children
  if (!element) {
    console.log('element in "itemData" not found')
    return
  }
  itemData.src = (<HTMLAnchorElement>element).href
  const sizeAttr = element.dataset.size // data-size
  if (!sizeAttr) {
    console.log('attribute "data-size" not found')
    return
  }
  itemData.w = Number(sizeAttr.split('x')[0])
  itemData.h = Number(sizeAttr.split('x')[1])
  itemData.thumbCropped = true
})
onelightbox.init()

//------------------------------------------------
// Data Sources
// open gallery from button or anchor
//------------------------------------------------

const datalightbox = new PhotoSwipeLightbox({
  dataSource: [
    // simple image
    {
      src: 'assets/images/b3.jpg',
      w: 1920,
      h: 1200,
      alt: 'test image',
    },
    // video
    {
      html: '<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/141995089?h=309e9283d9&loop=1" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>',
      w: 960,
      h: 540,
    },
    // responsive image
    {
      srcset:
        'https://dummyimage.com/1500x1000/555/fff/?text=1500x1000 1500w, https://dummyimage.com/1200x800/555/fff/?text=1200x800 1200w, https://dummyimage.com/600x400/555/fff/?text=600x400 600w',
      src: 'https://dummyimage.com/1500x1000/555/fff/?text=1500x1000',
      w: 1500,
      h: 1000,
      alt: 'test image srcset',
    },
    // HTML slide
    {
      html: '<div class="custom-html-slide">This is custom HTML slide. Link to <a href="/" target="_blank" rel="nofollow">home</a>.</div>',
    },
  ],
  arrowPrevSVG: leftArrowSVGString,
  arrowNextSVG: leftArrowSVGString,
  closeSVG: closeSVGstring,
  zoomSVG: zoomSVGstring,
  bgOpacity: 0.92, // set background opacity
  paddingFn: (viewportSize: { x: number }) => {
    return {
      top: viewportSize.x < 1024 ? 0 : 48,
      bottom: viewportSize.x < 1024 ? 0 : 48,
      left: 0,
      right: 0,
    }
  },
  // allowMouseDrag: true,
  pswpModule: PhotoSwipe,
})
datalightbox.init()

const openPopup = document.querySelector('#open-popup')
if (openPopup != null) {
  ;(<HTMLAnchorElement>openPopup).onclick = () => {
    datalightbox.loadAndOpen(0) // open the first image
  }
}
// -------------------------------------------------------
