//Preloader:
$(window).on('load', function () {
    if ($('#preloader').length) {
    $('#preloader').delay(100).fadeOut('slow', function () {
        $(this).remove();
    });
    }
});

//Creating a map:
var mymap = L.map('map').setView([51.505, -0.09], 13);

