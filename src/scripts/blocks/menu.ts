// menu.js
// Auto hide navbar

document.addEventListener('DOMContentLoaded', () => {
  let scrolling = false
  let previousTop = 0
  const scrollDelta = 10
  const scrollOffset = 250

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
    const currentTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
    const header: HTMLElement | null = document.querySelector('.nav-autohide')
    if (!header) {
      console.log('Attension! Selector ".nav-autohide" not found!')
      return
    }
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
