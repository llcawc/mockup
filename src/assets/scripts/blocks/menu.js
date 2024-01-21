// menu.js
// Auto hide navbar

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.nav-autohide')
  let scrolling = false
  let previousTop = 0
  let scrollDelta = 10
  let scrollOffset = 250

  document.addEventListener('scroll', () => {
    if (!scrolling) {
      scrolling = true

      if (!window.requestAnimationFrame) {
        setTimeout(autoHideHeader, 250)
      } else {
        requestAnimationFrame(autoHideHeader)
      }
    }
  })

  function autoHideHeader() {
    let currentTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop

    // Scrolling up
    if (previousTop - currentTop > scrollDelta || currentTop === 0) {
      header.classList.remove('is-hidden')
    } else if (currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
      // Scrolling down
      header.classList.add('is-hidden')
    }

    previousTop = currentTop
    scrolling = false
  }
})
