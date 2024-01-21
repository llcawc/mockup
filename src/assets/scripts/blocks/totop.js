// totop.js
// Кнопка возврата на верх страницы

function eventScrollToTop() {
  let flag = false
  const metka = 300
  const arrowUp = document.getElementById('scrolltotop')

  window.addEventListener('scroll', function () {
    let counter = this.scrollY
    if (counter > metka) {
      arrowUp.classList.add('on')
      arrowUp.classList.remove('down')
      flag = true
    }
    if (counter <= metka && flag == true) {
      arrowUp.classList.add('down')
      arrowUp.classList.remove('on')
      flag = false
    }
  })

  arrowUp.onclick = function (event) {
    event.preventDefault()
    window.scrollTo({
      left: this.scrollX,
      top: 0,
      behavior: 'smooth',
    })
  }
}

// Блок загрузки кода scrol to top
function scrollToTopLoader() {
  let codScroll = `<div id="scrolltotop"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22V2M12 2L2 12M12 2L22 12" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`
  let el = document.getElementsByTagName('script')
  el[el.length - 1].insertAdjacentHTML('afterend', codScroll)
}

// Запуск кнопки scrollToTop после полной загрузки DOM для экранов с viwport более 340px
document.addEventListener('DOMContentLoaded', () => {
  let intViewportWidth = window.innerWidth // viwport X
  // let intViewportHeight = window.innerHeight // viewport Y
  if (intViewportWidth >= 340) {
    scrollToTopLoader()
    eventScrollToTop()
  }
})
