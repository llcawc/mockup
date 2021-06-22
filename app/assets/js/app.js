// Import jQuery module (npm i jquery)
import $ from "jquery"; window.jQuery = $; window.$ = $;

// Import vendor jQuery plugin (not module)
require("~/app/assets/vendor/magnific-popup/jquery.magnific-popup.js"); // Require vendor jQuery plugin (not module)
// require('~/node_modules/bootstrap/dist/js/bootstrap.bundle.js'); // Require Bootstrap as not module

// Import Bootstrap as module
// import { Tooltip, Toast, Popover } from 'bootstrap'; // before require popper to package (npm install @popperjs/core)

// import 'bootstrap/js/dist/alert';
// import 'bootstrap/js/dist/button';
// import 'bootstrap/js/dist/carousel';
import 'bootstrap/js/dist/collapse';
// import 'bootstrap/js/dist/dropdown';
// import 'bootstrap/js/dist/modal';
// import 'bootstrap/js/dist/popover'; // require from popper (npm install @popperjs/core)
// import 'bootstrap/js/dist/scrollspy';
// import 'bootstrap/js/dist/tab';
// import 'bootstrap/js/dist/toast';  // require from popper
// import 'bootstrap/js/dist/tooltip';// require from popper

// Sample USE Bootstrap module
// import Modal from 'bootstrap/js/dist/modal'
// const modal = new Modal(document.getElementById('myModal'))


// -------- Back to top button ------
var eventScrollToTop = function () {
  let flag = false;
  const metka = 300;
  const arrowUp = document.getElementById("scrolltotop");

  window.addEventListener("scroll", function () {
    let counter = pageYOffset;
    if (counter > metka) {
      arrowUp.classList.add("on");
      arrowUp.classList.remove("down");
      flag = true;
    }
    if (counter <= metka && flag == true) {
      arrowUp.classList.add("down");
      arrowUp.classList.remove("on");
      flag = false;
    }
  });

  arrowUp.onclick = function (event) {
    // event.preventDefault();
    window.scrollTo({
      left: pageXOffset,
      top: 0,
      behavior: "smooth",
    });
  };
};

// ------- scrol to top code loading block --------
var scrollToTopLoader = function () {
  let codScroll = `
  <div id="scrolltotop">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22V2M12 2L2 12M12 2L22 12" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
  `;
  let el = document.getElementsByTagName("script");
  el[el.length - 1].insertAdjacentHTML("afterend", codScroll);
};

// ------- On scrollToTop button for viewport up to 340px --------

document.addEventListener("DOMContentLoaded", () => {
  let intViewportWidth = window.innerWidth; // viwport X
  let intViewportHeight = window.innerHeight; // viewport Y
  if (intViewportWidth >= 340) {
    scrollToTopLoader();
    eventScrollToTop();
  }
});

//--------- jQuery: plugins section after full DOM load ----------
$(document).ready(function () {

//--------- jQuery: magnific-popup-gallery  ----------
  const titleText =
    `<p>Made with <span style="color: #e60f0a;">&#10084;</span> of monumental architecture.</p>`;
  const titleError =
    '<a href="%url%">Изображение #%curr%</a> загрузить нельзя.';

  $(".popup-gallery").magnificPopup({
    delegate: "a",
    type: "image",
    tLoading: "Loading image #%curr%...",
    mainClass: "mfp-img-mobile",
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1], // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: titleError,
      titleSrc: function (item) {
        return item.el.attr("title") + titleText;
      },
    },
  });

  //--------- jQuery: magnific-popup single image view --------
  $(".link-popup").magnificPopup({
    type: "image",
    image: {
      tError: titleError,
      titleSrc: function (item) {
        return item.el.attr("title") + titleText;
      },
    },
    // other options
  });

  //--------- jQuery: magnific-popup viewing content of different types ---------
  $("#open-popup").magnificPopup({
    items: [
      {
        src: "assets/images/b3.jpg",
        title:
          'Made with <span style="color: #e60f0a;">&#10084;</span> for the best architecture.',
      },
      {
        src: "https://vimeo.com/video/141995089",
        type: "iframe", // this overrides default type
      },
      {
        src: $('<div class="white-popup">Dynamically created element</div>'), // Dynamically created element
        type: "inline",
      },
      {
        src: '<div class="white-popup">Popup from HTML string</div>', // HTML string
        type: "inline",
      },
      {
        src: "#popup", // CSS selector of an element on page that should be used as a popup
        type: "inline",
      },
    ],
    gallery: {
      enabled: true,
    },
    type: "image", // this is a default type
  });

  // -------- jQuery: add-remove class ------------

  // $(".view-img").hover(function () {
  //   $(this).toggleClass("shadow");
  // });
});
//--- end: jQuery: plugins section after full DOM load ---
