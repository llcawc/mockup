// Glightbox
import GLightbox from 'glightbox'

const glightbox = GLightbox({
  touchNavigation: true,
  loop: true,
  autoplayVideos: true,
})

const closeSVG =
  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306C514.019,27.23,514.019,14.135,505.943,6.058z"></path></g></g><g><g><path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"></path></g></g></svg>'

const customLightboxHTML = `<div id="glightbox-body" class="glightbox-container">
    <div class="gloader visible"></div>
    <div class="goverlay"></div>
    <div class="gcontainer">
    <div id="glightbox-slider" class="gslider"></div>
    <button class="gnext gbtn" tabindex="0" aria-label="Next" data-customattribute="example">{nextSVG}</button>
    <button class="gprev gbtn" tabindex="1" aria-label="Previous">{prevSVG}</button>
    <button class="gclose gbtn" tabindex="2" aria-label="Close">${closeSVG}</button>
</div>
</div>`

const customSlideHTML = `<div class="gslide">
    <div class="gslide-inner-content">
        <div class="ginner-container">
            <div class="gslide-media">
            </div>
            <div class="gslide-description">
                <div class="gdesc-inner">
                    <h4 class="gslide-title"></h4>
                    <div class="gslide-desc"></div>
                </div>
            </div>
        </div>
    </div>
</div>`

const btn = document.getElementById('open-lightbox')
const options = {
  // lightboxHTML: customLightboxHTML,
  // slideHTML: customSlideHTML,
  // skin: 'supercool',
  plyr: {
    css: 'https://cdn.plyr.io/3.7.8/plyr.css', // Default not required to include
    js: 'https://cdn.plyr.io/3.7.8/plyr.js', // Default not required to include
    config: {
      ratio: '16:9', // or '4:3'
      muted: false,
      hideControls: true,
      youtube: {
        noCookie: true,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
      },
      vimeo: {
        byline: false,
        portrait: false,
        title: false,
        speed: true,
        transparent: false,
      },
    },
  },
  elements: [
    {
      href: '/images/b3.jpg',
      type: 'image',
      alt: 'image text alternatives',
    },
    {
      href: 'https://player.vimeo.com/video/141995089?h=309e9283d9&loop=1',
      type: 'video',
      sourse: 'vimeo', //vimeo, youtube or local
      width: 960,
    },
    {
      content:
        '<iframe width="960" height="540" src="https://rutube.ru/play/embed/bcf0f3db760895332428bad3060cfeb3" frameBorder="0" allow="clipboard-write; autoplay" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>',
      width: 960,
      height: 'auto',
    },
    {
      content: '<p>This will append some html inside the slide</p>', // read more in the API section
      width: 960,
      height: 540,
    },
    // {
    //   content: document.getElementById('inline-example'), // this will append a node inside the slide
    // },
  ],
  autoplayVideos: false,
}

// Instead of using a selector, define the gallery elements
const myGallery = GLightbox(options)
if (btn) btn.addEventListener('click', () => myGallery.open())
