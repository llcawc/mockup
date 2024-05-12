// share.js
'use strict'

const link = {
  tg: 'https://t.me/share/url?url=', // https://t.me/share/url?url={url}&text={text}
  vk: 'https://vk.com/share.php?url=', // https://vk.com/share.php?url={...}&title={...}&image={...}
  fb: `https://www.facebook.com/sharer/sharer.php?u=`, // &title={...}
  insta: 'https://www.instagram.com/awcomru/',
  email:
    'mailto:?subject=%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82!%20%D0%97%D0%B4%D0%B5%D1%81%D1%8C%20%D0%B2%D0%B0%D0%B6%D0%BD%D0%B0%D1%8F%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B0&body=%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82!%20%D0%97%D0%B4%D0%B5%D1%81%D1%8C%20%D0%B2%D0%B0%D0%B6%D0%BD%D0%B0%D1%8F%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B0:%20',
}

// open and close shared box --------------------
const but = document.querySelectorAll('button[data-share="popshare"]')
but.forEach((el) => {
  openShare(el)
})

function openShare(butshare) {
  const share = document.querySelector('#share')
  if (share === null) {
    console.log(' Id: "#share" not found')
    return
  }
  const popshare = document.querySelector('#popshare')
  if (popshare === null) {
    console.log(' Id: "#popshare" not found')
    return
  }
  let ticking = false

  // open share block
  if (butshare !== null) {
    butshare.addEventListener('click', (e) => {
      if (share.classList.contains('open-share')) {
        share.classList.remove('open-share')
      } else {
        share.classList.add('open-share')
        sharePos(butshare, popshare)
        setPopupLinkListen(popshare)
        e.stopPropagation()
      }
    })
  }
  // close share block if scroll
  document.addEventListener('scroll', function (e) {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        share.classList.remove('open-share')
        butshare.blur()
        ticking = false
      })
      ticking = true
    }
  })
  // close share block if press key Esc
  document.addEventListener('keydown', function (e) {
    if (e.code == 'Escape') {
      e.preventDefault()
      share.classList.remove('open-share')
    }
  })
  // close share block if click out block
  document.addEventListener('click', function (e) {
    const target = e.target
    if (!target) {
      console.log('Target not found')
      return
    }

    const its_pop = target == popshare || popshare.contains(<Element>target)
    const pop_is_open = share.classList.contains('open-share')
    if (!its_pop && pop_is_open) {
      share.classList.remove('open-share')
    }
  })

  // position share block
  function sharePos(base, target) {
    let X = base.dataset.deltaX ? Number(base.dataset.deltaX) : 0
    let Y = base.dataset.deltaY ? Number(base.dataset.deltaY) + 12 : 12
    target.style.left = Math.round(base.getBoundingClientRect().right + X - target.clientWidth) + 'px'
    target.style.top = Math.round(base.getBoundingClientRect().bottom + Y) + 'px'
  }

  // add to anchors new possibility to open share window
  function setPopupLinkListen(div) {
    const anchors = div.querySelectorAll('[data-pop="popshare"]')
    anchors.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault()
        openWindowPopup(el, el.href)
      })
    })
  }
}

// new window
var windowPopup: Window | null
function openWindowPopup(el, address) {
  let widthWindows = 650
  let heightWindows = 580
  let posX = window.screenX + document.documentElement.clientWidth / 2 - widthWindows / 2
  let posY = window.screenY + document.documentElement.clientHeight / 2 - heightWindows / 2
  let params = `status=no,location=no,toolbar=no,menubar=no,width=${widthWindows},height=${heightWindows},left=${posX},top=${posY}`
  if (windowPopup == null || windowPopup.closed) {
    windowPopup = window.open(address, 'shareWindows', params)
  } else {
    windowPopup.focus()
  }
}

// button vkontakte -----------------------------
let vk = document.querySelectorAll('.vkontakte-link')
vk.forEach((el) => {
  let currUrl = document.URL
  ;(<HTMLAnchorElement>el).href = link.vk + currUrl
})

// button telegram -----------------------------
let tg = document.querySelectorAll('.telegram-link')
tg.forEach((el) => {
  let currUrl = document.URL
  ;(<HTMLAnchorElement>el).href = link.tg + currUrl
})

// button facebook -----------------------------
let fb = document.querySelectorAll('.facebook-link')
fb.forEach((el) => {
  let currUrl = document.URL
  ;(<HTMLAnchorElement>el).href = link.fb + currUrl
})

// button instagram -----------------------------
let instagram = document.querySelectorAll('.instagram-link')
instagram.forEach((el) => {
  ;(<HTMLAnchorElement>el).href = link.insta
})

// button pinterest -----------------------------
let pin = document.querySelectorAll('.pinterest-link')
pin.forEach((el) => {
  let currUrl = document.URL
  let currSlideElementHref = 'http://localhost:3000/assets/images/preview.jpg'
  ;(<HTMLAnchorElement>el).href =
    `https://www.pinterest.com/pin/create/link/?url=${currUrl}&media=${currSlideElementHref}&description=Next%20stop%3A%20Pinterest`
})

// button download link ------------------------------
let downLink = document.querySelectorAll('.download-link')
downLink.forEach((el) => {
  let currUrl = 'assets/images/preview.jpg' // document.URL
  ;(<HTMLAnchorElement>el).href = currUrl
})

// button copy link ------------------------------
let copyLinkBut = document.querySelectorAll('.copy-link')
copyLinkBut.forEach((el) => {
  el.addEventListener('click', () => {
    let currUrl = document.URL
    navigator.clipboard.writeText(currUrl)
    el.innerHTML = 'Ссылка скопирована'
    ;(<HTMLAnchorElement>el).blur()
    setTimeout(() => {
      el.innerHTML = 'Скопировать ссылку'
    }, 3000)
  })
})

// button mail send link --------------------------
let sendEmailLinkBut = document.querySelectorAll('.email-link')
sendEmailLinkBut.forEach((el) => {
  let currUrl = document.URL
  ;(<HTMLAnchorElement>el).href = link.email + currUrl + '%20'
})

// dark blur body  -----------------------------

let selBlur = document.querySelectorAll('.blur')
let diVuale = document.createElement('div')
let ScrollBar = window.innerWidth - document.documentElement.clientWidth
let navBar: HTMLElement | null = document.querySelector('.navbar')

function darkBody() {
  if (!navBar) {
    console.log('Не найден элемент navbar')
    return
  }
  document.body.style.overflowY = 'hidden'
  document.body.style.paddingRight = ScrollBar + 'px'
  navBar.style.paddingRight = ScrollBar + 'px'
  selBlur.forEach((el) => {
    ;(<HTMLElement>el).style.filter = 'blur(2px)'
  })
  diVuale.className = 'dark-blur-body'
  document.body.append(diVuale)
}

function clearBodyStyle() {
  if (!navBar) {
    console.log('Не найден элемент navbar')
    return
  }
  document.body.style.overflowY = ''
  document.body.style.paddingRight = ''
  navBar.style.paddingRight = ''
  selBlur.forEach((el) => {
    ;(<HTMLElement>el).style.filter = ''
  })
  diVuale.remove()
}
