//--------- cod isotope ----------------

require('~/app/assets/vendor/isotope/isotope.pkgd.js')
require('~/app/assets/vendor/isotope/imagesloaded.pkgd.js')


$(document).ready(function () {

  // init Isotope
  var $grid = $('.grid').isotope({
    // set itemSelector so .grid-sizer is not used in layout
    itemSelector: '.grid-item',
    percentPosition: true,
    masonry: {
      // use element for option
      columnWidth: 100,
      gutter: 26,
      // horizontalOrder: true,
      columnWidth: '.grid-sizer'
    }
  });

  // layout Isotope after each image loads
  $grid.imagesLoaded().progress( function() {
    $grid.isotope('layout');
  });

  // filter items on button click
  $('.filter-button-group').on( 'click', 'button', function() {
    var filterValue = $(this).attr('data-filter');
    $grid.isotope({ filter: filterValue });
  });

  // change is-checked class on buttons
  $('.button-group').each( function( i, buttonGroup ) {
    var $buttonGroup = $( buttonGroup );
    $buttonGroup.on( 'click', 'button', function() {
      $buttonGroup.find('.is-checked').removeClass('is-checked');
      $( this ).addClass('is-checked');
    });
});


});
