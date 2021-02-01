//Preloader:
$(window).on('load', function () {
    if ($('#preloader').length) {
    $('#preloader').delay(100).fadeOut('slow', function () {
        $(this).remove();
    });
    }
});

//Creating a map:
const mymap = L.map('map').setView([51.505, -0.09],4);

const attribution = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const tileUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}';

const tiles = L.tileLayer(tileUrl, { 
    attribution,
    subdomains: 'abcd',
	minZoom: 2,
    maxZoom: 20,
    ext: 'png'
 });
tiles.addTo(mymap);

var marker = L.marker([51.6, -0.09]).addTo(mymap);


//Pagination
var totalNumOfPages = $('#accordion .card').length;

$(".pagination").append("<li class='current-page page-item active'><a class='page-link'href='javascript:void(0)'>1</a></li>")

for(var i=2; i<=totalNumOfPages; i++){
    $(".pagination").append("<li class='current-page page-item'><a class='page-link'href='javascript:void(0)'>" + i + "</a></li>")
}

$(".pagination").append("<li id='next-page' class='page-item'> <a class='page-link' href='javascript:void(0)' aria-label='Next'> <span aria-hidden='true'>&raquo;</span> <span class='sr-only'>Next</span></a></li>");

$(".pagination li.current-page").on("click", function(){
    if($(this).hasClass("active")){
        return false;
    } else {
        var currentPage = $(this).index();
        $(".pagination li").removeClass("active");
        $(this).addClass("active");
        $("#accordion .card").hide();

        for(var i=1; i<=totalNumOfPages; i++){
            $("#page" + currentPage + "").show();
        }
    }
});

//Next Button
$("#next-page").on("click", function() {
    var currentPage = $(".pagination li.active").index();
    if(currentPage === totalNumOfPages){
        return false;
    } else {
        currentPage++;
        $(".pagination li").removeClass("active");
        $("#accordion .card").hide();
        
        for(var i=1; i<=totalNumOfPages; i++){
            $("#page" + currentPage).show();
        }
        
        $(".pagination li.current-page:eq(" + (currentPage -1)+")").addClass("active");
        
    }
})

//Previous Button
$("#previous-page").on("click", function() {
    var currentPage = $(".pagination li.active").index();
    if(currentPage === 1){
        return false;
    } else {
        currentPage--;
        $(".pagination li").removeClass("active");
        $("#accordion .card").hide();
        
        for(var i=1; i<=totalNumOfPages; i++){
            $("#page" + currentPage).show();
        }
        
        $(".pagination li.current-page:eq(" + (currentPage -1)+")").addClass("active");
        
    }
})


//AJAX FUNCTIONS:

//Weather
$('#practice').click(function(){
    $.ajax({
        url: "php/openWeather.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: 51.6,
            lon: -0.09
        },
        success: function(result) {
            console.log(result);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("There has been an error!")
        }
    });
});