// photoswipe плагин. Кастомный код яваскрипт
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import PhotoSwipe from 'photoswipe'

/**
 * Открыть лайтбокс галереи с селектором "photo-gallery"
 * подходит для любого количества слайдов
 */
// определяем новые классные кнопки
const leftArrowSVGString =
  '<svg aria-hidden="true" class="pswp__icn" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 28 10 16 22 4" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const closeSVGstring =
  '<svg aria-hidden="true" class="pswp__icn" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.049 5.049a1.2 1.2 0 1 0-1.697-1.698L12.2 10.503 5.049 3.35a1.2 1.2 0 0 0-1.699 1.7l7.152 7.151-7.152 7.152a1.2 1.2 0 1 0 1.698 1.697l7.151-7.152 7.152 7.152a1.2 1.2 0 1 0 1.697-1.697L13.896 12.2l7.152-7.151Z" fill="#fff"/></svg>'
const zoomSVGstring =
  '<svg aria-hidden="true" class="pswp__icn" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="pswp__zoom-icn-bar-h" stroke="#fff" stroke-width="1.5" stroke-linecap="round" d="M7.828 10.72h5.5"/><path class="pswp__zoom-icn-bar-v" stroke="#fff" stroke-width="1.5" stroke-linecap="round" d="M10.577 13.385v-5.5"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10.578 2.75a7.827 7.827 0 0 0-7.828 7.828 7.827 7.827 0 0 0 7.828 7.827 7.797 7.797 0 0 0 5.129-1.915l.61.61v.872l3.529 3.529 1.654-1.655-3.529-3.529H17.1l-.61-.61a7.798 7.798 0 0 0 1.915-5.13 7.827 7.827 0 0 0-7.828-7.827ZM4.25 10.578a6.327 6.327 0 0 1 6.328-6.328 6.327 6.327 0 0 1 6.327 6.328 6.327 6.327 0 0 1-6.328 6.327 6.327 6.327 0 0 1-6.327-6.328Z" fill="#fff"/></svg>'
// определяем конфиг лайтбокса
const config = {
  arrowPrevSVG: leftArrowSVGString,
  arrowNextSVG: leftArrowSVGString,
  closeSVG: closeSVGstring,
  zoomSVG: zoomSVGstring,
  bgOpacity: 0.92, // установить прозрачность фона
  gallery: '.photo-gallery',
  children: 'a',
  paddingFn: (viewportSize: { x: number }) => {
    return {
      top: viewportSize.x < 1024 ? 0 : 48,
      bottom: viewportSize.x < 1024 ? 0 : 48,
      left: 0,
      right: 0,
    }
  },
  pswpModule: PhotoSwipe,
}
// определям лайтбокс
const lightbox = new PhotoSwipeLightbox(config)

// включаем чтение размеров фото из атрибута data-size в сыллке
lightbox.addFilter('domItemData', (itemData, element, linkEl) => {
  if (linkEl) {
    const sizeAttr: string | undefined = linkEl.dataset.size

    itemData.src = linkEl.href
    itemData.w = Number(sizeAttr?.split('x')[0])
    itemData.h = Number(sizeAttr?.split('x')[1])
    itemData.thumbCropped = true
  }

  return itemData
})

// включаем caption - попись под картинкой слайда
lightbox.on('uiRegister', function () {
  // регистрируем новый элемент подписи в просматриваемом кадре лайтбокса
  lightbox.pswp?.ui?.registerElement({
    name: 'custom-caption',
    order: 9,
    isButton: false,
    appendTo: 'root',
    html: 'Caption text',
    // при инициализации нового кадра - меняем наполнение подписи
    onInit: (captElem: HTMLElement, pswp: PhotoSwipe) => {
      pswp.on('change', () => {
        // получим текущий элемент слайда ( children: 'a')
        const currSlideElement: HTMLElement | undefined = pswp.currSlide?.data.element
        // получим текст подписи из атрибута "data-title"
        const title = currSlideElement?.dataset.title?.trim()
        if (!title) {
          // если нет пописи скроем елемент подписи "captElem"
          captElem.classList.add('hidden')
        } else {
          // отобразим текст пописи
          captElem.classList.remove('hidden')
          captElem.innerHTML = title
        }
      })
    },
  })
})

// Запускаем лайтбокс
lightbox.init()

/**
 * Еще одна новая Галерея с кнопкой: где данные указаны далее ниже в коде,
 * открывать галерею по нажатию кнпки или ссылки с id: #open-lightbox
 */

const dataoptions = {
  dataSource: [
    // simple image
    {
      src: '/assets/images/b3.jpg',
      w: 1920,
      h: 1200,
      alt: 'test image',
    },
    // video vimeo
    // <div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/141995089?h=309e9283d9&loop=1" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
    {
      html: '<iframe src="https://player.vimeo.com/video/141995089?h=309e9283d9&loop=1" style="width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe><script src="https://player.vimeo.com/api/player.js"></script>',
      w: 960,
      h: 540,
    },
    // rutube
    // <iframe width="720" height="405" src="https://rutube.ru/play/embed/b72f28acbf761c05f3bd3803ecaa8e78" frameBorder="0" allow="clipboard-write; autoplay" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
    {
      html: '<lite-rutube videoid="b72f28acbf761c05f3bd3803ecaa8e78"></lite-rutube>',
      w: 960,
      h: 540,
    },
    // HTML5 video
    {
      html: '<video width="960" height="540" controls><source src="/assets/video/1166313_Woman_Smiling_1280x720.mp4" type="video/mp4"/></video>',
      w: 960,
      h: 540,
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
  bgOpacity: 0.92, // установить прозрачность фона
  paddingFn: (viewportSize: { x: number }) => {
    return {
      top: viewportSize.x < 1024 ? 0 : 48,
      bottom: viewportSize.x < 1024 ? 0 : 48,
      left: 0,
      right: 0,
    }
  },
  pswpModule: PhotoSwipe,
}
const datalightbox = new PhotoSwipeLightbox(dataoptions)
datalightbox.init()

document.addEventListener('DOMContentLoaded', () => {
  const openPopup: HTMLButtonElement | null = document.querySelector('#open-lightbox')
  if (openPopup) {
    openPopup.onclick = () => {
      datalightbox.loadAndOpen(0) // открываем первый слайд
    }
  }
})

/* Конец */
