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


//API:

$.getJSON("php/data_json.json", function(data){
    console.log(data);
});

var chosenCountry = $('countrySelect');
chosenCountry.empty();
chosenCountry.append("<option selected='true'>Select a Country</option>");
chosenCountry.prop('selectedIndex', 0);





//AJAX FUNCTIONS:

//Millseconds to Time
function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  }


  var currentDate = Date.today();
  var thirdDay = (2).day().fromNow();  
  var fourthDay = (3).day().fromNow() ;
  $("#thirdDay").html(thirdDay);
  $("#fourthDay").html(fourthDay);

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
            if (result.status.name == "ok") {
                // $('#city').html(result['data']['countryName']);
                $('#temp').html(result['data']['current']['temp']+" ℃");
                var icon = result['data']['current']['weather']['0']['icon'];
                $('#currentWeather').html(result['data']['current']['weather']['0']['description']);
                $('#weatherIcon').attr( "src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");
                $('#wind').html(result['data']['current']['wind_speed'] + ' meter/sec ' + result['data']['current']['wind_deg']);


                var sunrise = result['data']['current']['sunrise'];
                $('#sunrise').html((result['data']['current']['sunrise']));
                $('#sunset').html(msToTime(result['data']['current']['sunset']));
                $('#humidity').html(result['data']['current']['humidity'] + ' %');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("There has been an error!")
        }
    });
});