//Preloader:
$(window).on('load', function () {
    if ($('#preloader').length) {
    $('#preloader').delay(100).fadeOut('slow', function () {
        $(this).remove();
    });
    }
});

//Creating a map:
const mymap = L.map('map').setView([51.505, -0.09], 13);

const attribution = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const tileUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}';

const tiles = L.tileLayer(tileUrl, { 
    attribution,
    subdomains: 'abcd',
	minZoom: 0,
    maxZoom: 20,
    ext: 'png'
 });
tiles.addTo(mymap);
