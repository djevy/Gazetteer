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

// var chosenCountry = $('countrySelect');
// chosenCountry.empty();
// chosenCountry.append("<option selected='true'>Select a Country</option>");
// chosenCountry.prop('selectedIndex', 0);

// $("select.country").change(function(){
//     var selectedCountry = $(this).children("option:selected").val();
//     alert("You have selected the country - " + selectedCountry);
// });





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

 //Days
var thirdDay = moment().add(2, 'days').format('dddd');  
var fourthDay = moment().add(3, 'days').format('dddd');   ;
$("#thirdDay").html(thirdDay);
$("#fourthDay").html(fourthDay);

  //Direction:
function direction(i) {
    if(i >= 349 && i <= 11){
            return +i + "°: N";
    } else if (i >= 12 && i <= 33) {
            return +i + "°: NNE";
    } else if (i >= 34 && i <= 56) {
            return +i + "°: NE";
    } else if (i >= 57 && i <= 78) {
            return +i + "°: ENE";
    } else if (i >= 79 && i <= 101) {
            return +i + "°: E";
    } else if (i >= 102 && i <= 123) {
            return +i + "°: ESE";
    } else if (i >= 124 && i <= 146) {
            return +i + "°: SE";
    } else if (i >= 147 && i <= 168) {
            return +i + "°: SSE";
    } else if (i >= 169 && i <= 191) {
            return +i + "°: S";
    } else if (i >= 192 && i <= 213) {
            return +i + "°: SSW";
    } else if (i >= 214 && i <= 236) {
            return +i + "°: SW";
    } else if (i >= 237 && i <= 258) {
            return +i + "°: WSW";
    } else if (i >= 259 && i <= 281) {
            return +i + "°: W";
    } else if (i >= 282 && i <= 303) {
            return +i + "°: WNW";
    } else if (i >= 304 && i <= 326) {
            return +i + "°: NW";
    } else if (i >= 327 && i <= 348) {
            return +i + "°: NNW";
    }
};


$(window).on('load',function(){
    //Weather
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

                let selectedDate = $("select.selectDate").find("option:selected").text();

                
                console.log(selectedDate);
                    
                //Today
                if(selectedDate === 'Today'){
                    $('#temp').html(result['data']['current']['temp']+" ℃");
                    var icon = result['data']['current']['weather']['0']['icon'];
                    $('#currentWeather').append(result['data']['current']['weather']['0']['description']);
                    var weatherUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                    console.log(weatherUrl);
                    $('#weatherIcon').attr("src", weatherUrl);
                    $('#wind').html(result['data']['current']['wind_speed'] + ' meter/sec ' + direction(result['data']['current']['wind_deg']));

                    var sunrise = moment(result['data']['current']['sunrise']*1000).format("HH:mm");
                    console.log(sunrise);
                    $('#sunrise').html(sunrise);
                    var sunset = moment(result['data']['current']['sunset']*1000).format("HH:mm");
                    $('#sunset').html(sunset);

                    $('#humidity').html(result['data']['current']['humidity'] + ' %');
                };
             
               
                //Tomorrow
                if($('#tomorrow')){
                    $('#temp').html(result['data']['current']['temp']+" ℃");
                    var icon = result['data']['current']['weather']['0']['icon'];
                    $('#currentWeather').append(result['data']['current']['weather']['0']['description']);
                    var weatherUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                    console.log(weatherUrl);
                    $('#weatherIcon').attr("src", weatherUrl);
                    $('#wind').html(result['data']['current']['wind_speed'] + ' meter/sec ' + direction(result['data']['current']['wind_deg']));

                    var sunrise = moment(result['data']['current']['sunrise']*1000).format("HH:mm");
                    console.log(sunrise);
                    $('#sunrise').html(sunrise);
                    var sunset = moment(result['data']['current']['sunset']*1000).format("HH:mm");
                    $('#sunset').html(sunset);

                    $('#humidity').html(result['data']['current']['humidity'] + ' %');
                };

                //Third Day

                //Fourth Day
                
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("There has been an error!")
        }
    });
});