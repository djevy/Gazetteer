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
// $('#selectOption').val()

function applyCountryBorder(mymap, countryname) {
    jQuery
      .ajax({
        type: "GET",
        dataType: "json",
        url:
          "https://nominatim.openstreetmap.org/search?country=" +
          countryname +
          "&polygon_geojson=1&format=json"
      })
      .then(function(data) {
        /*const latLngs = L.GeoJSON.coordsToLatLngs(data[0].geojson.coordinates,2) 
        L.polyline(latLngs, {
          color: "green",
          weight: 14,
          opacity: 1
        }).addTo(map);*/
  
        var layer = L.geoJSON(data[0].geojson, {
          color: "#9effd3",
          weight: 3,
          opacity: 0.7,
          fillOpacity: 0.0 
        }).addTo(mymap);
        layer.addTo(mymap);
      });
  }
$("#goBtn").on('click', function(){
    //layer.remove();
    countryName = $("#selectOption").val();
    applyCountryBorder(mymap, countryName);
});
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


//Page navigation
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

//Exchange
var currencies = ["AUD","BGN","BRL","CAD","CHF","CNY","CZK","DKK","EUR","GBP","HRK","HUF","IDR","ILS","INR","ISK","JPY","KRW","MXN","MYR","NOK","NZD","PHP","PLN","RON","RUB","SEK","SGD","THB","TRY","USD","ZAR"];
//Populate currencies -
$('#select').empty();
for (var i = 0; i <= currencies.length; i++) {
    $('#from').append('<option value="' + currencies[i] + '">' + currencies[i] + '</option>');
    $('#to').append('<option value="' + currencies[i] + '">' + currencies[i] + '</option>');
}
//API:
//Fill countries-
$.getJSON("php/allCountries.json", function(data) {
    console.log(data);
    for (var i = 0; i <= data.length; i++) {
        $('#selectOption').append("<option value=" + data[i.toString()]['alpha-2'] + ">" + data[i]['name'] + "</option>");
    }
});


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
$("#day3").html(thirdDay);
$("#day4").html(fourthDay);

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


//On page load
$(window).on('load',function(){

    //Apply border
    countryName = $("#selectOption").val();
    applyCountryBorder(mymap, countryName);

    //GeoDBCities
    $.ajax({
        url: "php/GeoDBCities.php",
        type: 'POST',
        dataType: 'json',
        data: {
            //country: $('#selectOption option:selected').text(),
        },
        success: function(result) {

            console.log(result);

            if (result.status.name == "ok") {
                // const {data:{query:}} = result;
               // $("#wiki").html(result['data']['query']['pages'][0]['extract']);
                
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 
    
    //Country Info:
    //getCountryInfo-
    $.ajax({
        url: "php/getCountryInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#selectOption').val(),
        },
        success: function(result) {

            console.log(result);

            if (result.status.name == "ok") {
                $("#countryName").html(result['data'][0]['countryName']);
                $('#capital').html(result['data'][0]['capital']);
                $('#area').html(result['data'][0]['areaInSqKm'] + " km<sup>2</sup>");
                $('#population').html(result['data'][0]['population']);
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

    //restCountry-
    $.ajax({
        url: "php/restCountry.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#selectOption').val(),
        },
        success: function(result) {

            console.log(result);

            if (result.status.name == "ok") {
                $("#flag").attr("src", result['data']['flag']);
                $('#currency').html(result['data']['currencies']['0']['name'] + " - " + result['data']['currencies']['0']['symbol']);
                $('#continent').html(result['data']['region']);
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

    //wikiApi-
    $.ajax({
        url: "php/wikiApi.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#selectOption option:selected').text(),
        },
        success: function(result) {            
            console.log(result);

            if (result.status.name == "ok") {
                $("#sumTitle").append(result['data']['0']['title']);
                $("#summary").html(result['data']['0']['summary']);
                $("#wikipediaUrl").attr('href', result['data']['0']['wikipediaUrl']);
                $("#wikipediaUrl").html(result['data']['0']['wikipediaUrl']);                
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

    //Weather:
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

                //Onload:
                $('#temp').html(result['data']['current']['temp']+" ℃");
                var icon = result['data']['current']['weather']['0']['icon'];
                $('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['current']['weather']['0']['description']);
                var weatherUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                $('#weatherIcon').attr("src", weatherUrl);
                $('#wind').html(result['data']['current']['wind_speed'] + ' meter/sec ' + direction(result['data']['current']['wind_deg']));
                var sunrise = moment(result['data']['current']['sunrise']*1000).format("HH:mm");
                $('#sunrise').html(sunrise);
                var sunset = moment(result['data']['current']['sunset']*1000).format("HH:mm");
                $('#sunset').html(sunset);
                $('#humidity').html(result['data']['current']['humidity'] + ' %');
                
                var time1 = moment(result['data']['hourly']['3']['dt']*1000).format("HH:mm");
                var time2 = moment(result['data']['hourly']['6']['dt']*1000).format("HH:mm");
                var time3 = moment(result['data']['hourly']['9']['dt']*1000).format("HH:mm");
                var time4 = moment(result['data']['hourly']['12']['dt']*1000).format("HH:mm");
                var temp1 = result['data']['hourly']['3']['temp'];
                var temp2 = result['data']['hourly']['6']['temp'];
                var temp3 = result['data']['hourly']['9']['temp'];
                var temp4 = result['data']['hourly']['12']['temp'];
                $('#hour1').append(result['data']['hourly']['3']['weather']['0']['description'] + " and " + temp1 + " ℃ at " + time1);
                $('#hour2').append(result['data']['hourly']['6']['weather']['0']['description'] + " and " + temp2 + " ℃ at " + time2);
                $('#hour3').append(result['data']['hourly']['9']['weather']['0']['description'] + " and " + temp3 + " ℃ at " + time3);
                $('#hour4').append(result['data']['hourly']['12']['weather']['0']['description'] + " and " + temp4 + " ℃ at " + time4);
                var icon1 = result['data']['hourly']['3']['weather']['0']['icon'];
                var icon2 = result['data']['hourly']['6']['weather']['0']['icon'];
                var icon3 = result['data']['hourly']['9']['weather']['0']['icon'];
                var icon4 = result['data']['hourly']['12']['weather']['0']['icon'];
                var weatherUrl1 = "http://openweathermap.org/img/wn/" + icon1 + "@2x.png";
                var weatherUrl2 = "http://openweathermap.org/img/wn/" + icon2 + "@2x.png";
                var weatherUrl3 = "http://openweathermap.org/img/wn/" + icon3 + "@2x.png";
                var weatherUrl4 = "http://openweathermap.org/img/wn/" + icon4 + "@2x.png";
                $('#weatherIcon1').attr("src", weatherUrl1);
                $('#weatherIcon2').attr("src", weatherUrl2);
                $('#weatherIcon3').attr("src", weatherUrl3);
                $('#weatherIcon4').attr("src", weatherUrl4);

                //Today
                $("#day1").on('click', function(){
                    $('.weatherHide').show();
                    
                    $("#temp").empty();
                    $("#currentWeather").empty();
                    $("#wind").empty();
                    $("#sunrise").empty();
                    $("#sunset").empty();
                    $("#humidity").empty();
                    $('#temp').html(result['data']['current']['temp']+" ℃");
                    var icon = result['data']['current']['weather']['0']['icon'];
                    $('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['current']['weather']['0']['description']);
                    var weatherUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                    $('#weatherIcon').attr("src", weatherUrl);
                    $('#wind').html(result['data']['current']['wind_speed'] + ' meter/sec ' + direction(result['data']['current']['wind_deg']));
                    var sunrise = moment(result['data']['current']['sunrise']*1000).format("HH:mm");
                    $('#sunrise').html(sunrise);
                    var sunset = moment(result['data']['current']['sunset']*1000).format("HH:mm");
                    $('#sunset').html(sunset);
                    $('#humidity').html(result['data']['current']['humidity'] + ' %');

                    $('#hour1').empty();
                    $('#hour2').empty();
                    $('#hour3').empty();
                    $('#hour4').empty();
                    // $('#hourWeather1').html('<img id="weatherIcon1" alt="weather icon" src=""></img>');
                    // $('#hourWeather2').html('<img id="weatherIcon2" alt="weather icon" src=""></img>');
                    // $('#hourWeather3').html('<img id="weatherIcon3" alt="weather icon" src=""></img>');
                    // $('#hourWeather4').html('<img id="weatherIcon4" alt="weather icon" src=""></img>');
                    var time1 = moment(result['data']['hourly']['3']['dt']*1000).format("HH:mm");
                    var time2 = moment(result['data']['hourly']['6']['dt']*1000).format("HH:mm");
                    var time3 = moment(result['data']['hourly']['9']['dt']*1000).format("HH:mm");
                    var time4 = moment(result['data']['hourly']['12']['dt']*1000).format("HH:mm");
                    var temp1 = result['data']['hourly']['3']['temp'];
                    var temp2 = result['data']['hourly']['6']['temp'];
                    var temp3 = result['data']['hourly']['9']['temp'];
                    var temp4 = result['data']['hourly']['12']['temp'];
                    $('#hour1').append(result['data']['hourly']['3']['weather']['0']['description'] + " and " + temp1 + " ℃ at " + time1);
                    $('#hour2').append(result['data']['hourly']['6']['weather']['0']['description'] + " and " + temp2 + " ℃ at " + time2);
                    $('#hour3').append(result['data']['hourly']['9']['weather']['0']['description'] + " and " + temp3 + " ℃ at " + time3);
                    $('#hour4').append(result['data']['hourly']['12']['weather']['0']['description'] + " and " + temp4 + " ℃ at " + time4);
                    var icon1 = result['data']['hourly']['3']['weather']['0']['icon'];
                    var icon2 = result['data']['hourly']['6']['weather']['0']['icon'];
                    var icon3 = result['data']['hourly']['9']['weather']['0']['icon'];
                    var icon4 = result['data']['hourly']['12']['weather']['0']['icon'];
                    var weatherUrl1 = "http://openweathermap.org/img/wn/" + icon1 + "@2x.png";
                    var weatherUrl2 = "http://openweathermap.org/img/wn/" + icon2 + "@2x.png";
                    var weatherUrl3 = "http://openweathermap.org/img/wn/" + icon3 + "@2x.png";
                    var weatherUrl4 = "http://openweathermap.org/img/wn/" + icon4 + "@2x.png";
                    $('#weatherIcon1').attr("src", weatherUrl1);
                    $('#weatherIcon2').attr("src", weatherUrl2);
                    $('#weatherIcon3').attr("src", weatherUrl3);
                    $('#weatherIcon4').attr("src", weatherUrl4);
                });
            
            
                //Tomorrow
                $("#day2").on('click', function(){
                    $("#currentWeather").empty();
                    $('.weatherHide').hide();
                    $('#temp').html("Max: " + result['data']['daily'][1]['temp']['max'] +" ℃ \n" + "Min: "  + result['data']['daily'][1]['temp']['min'] + " ℃");
                    var icon = result['data']['daily'][1]['weather']['0']['icon'];
                    $('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['daily'][1]['weather']['0']['description']);
                    var weatherUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                    $('#weatherIcon').attr("src", weatherUrl);
                    $('#wind').html(result['data']['daily'][1]['wind_speed'] + ' meter/sec ' + direction(result['data']['daily'][1]['wind_deg']));
                    var sunrise = moment(result['data']['daily'][1]['sunrise']*1000).format("HH:mm");
                    $('#sunrise').html(sunrise);
                    var sunset = moment(result['data']['daily'][1]['sunset']*1000).format("HH:mm");
                    $('#sunset').html(sunset);
                    $('#humidity').html(result['data']['daily'][1]['humidity'] + ' %');
                });

                //Third Day
                $("#day3").on('click', function(){
                    $("#currentWeather").empty();
                    $('.weatherHide').hide();
                    $('#temp').html("Max: " + result['data']['daily'][2]['temp']['max'] +" ℃ \n" + "Min: "  + result['data']['daily'][2]['temp']['min'] + " ℃");
                    var icon = result['data']['daily'][2]['weather']['0']['icon'];
                    $('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['daily'][2]['weather']['0']['description']);
                    var weatherUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                    $('#weatherIcon').attr("src", weatherUrl);
                    $('#wind').html(result['data']['daily'][2]['wind_speed'] + ' meter/sec ' + direction(result['data']['daily'][2]['wind_deg']));
                    var sunrise = moment(result['data']['daily'][2]['sunrise']*1000).format("HH:mm");
                    $('#sunrise').html(sunrise);
                    var sunset = moment(result['data']['daily'][2]['sunset']*1000).format("HH:mm");
                    $('#sunset').html(sunset);
                    $('#humidity').html(result['data']['daily'][2]['humidity'] + ' %');
                });

                //Fourth Day
                $("#day4").on('click', function(){
                    $("#currentWeather").empty();
                    $('.weatherHide').hide();
                    $('#temp').html("Max: " + result['data']['daily'][3]['temp']['max'] +" ℃ \n" + "Min: "  + result['data']['daily'][3]['temp']['min'] + " ℃");
                    var icon = result['data']['daily'][3]['weather']['0']['icon'];
                    $('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['daily'][3]['weather']['0']['description']);
                    var weatherUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                    $('#weatherIcon').attr("src", weatherUrl);
                    $('#wind').html(result['data']['daily'][3]['wind_speed'] + ' meter/sec ' + direction(result['data']['daily'][3]['wind_deg']));
                    var sunrise = moment(result['data']['daily'][3]['sunrise']*1000).format("HH:mm");
                    $('#sunrise').html(sunrise);
                    var sunset = moment(result['data']['daily'][3]['sunset']*1000).format("HH:mm");
                    $('#sunset').html(sunset);
                    $('#humidity').html(result['data']['daily'][3]['humidity'] + ' %');
                });                
                
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("There has been an error!")
        }
    });

    //News:
    $.ajax({
        url: "php/newsApi.php",
        type: 'POST',
        dataType: 'json',
        data: {
           country: $('#selectOption option:selected').val(),
        },
        success: function(result) {

            console.log(result);
            
            if (result.status.name == "ok") {
                $("#articleTitle").html(result['data']['articles']['0']['title']);
                $("#articleDescription").html(result['data']['articles']['0']['description']);
                $("#articleContent").html(result['data']['articles']['0']['content']);
                $("#articleImg").attr("src", result['data']['articles']['0']['urlToImage']);
                $("#articleAuthor").html(result['data']['articles']['0']['author']);
                $("#publishedAt").html(result['data']['articles']['0']['publishedAt']);
                $("#articleUrl").html(result['data']['articles']['0']['url']);
                $("#articleUrl").attr("href", result['data']['articles']['0']['url']);
            }
            var i = 0;
            $("#nextArticle").on('click', function() {
                i++;
                if (result.status.name == "ok") {
                    $("#articleTitle").html(result['data']['articles'][i]['title']);
                    $("#articleDescription").html(result['data']['articles'][i]['description']);
                    $("#articleContent").html(result['data']['articles'][i]['content']);
                    $("#articleImg").attr("src", result['data']['articles'][i]['urlToImage']);
                    $("#articleAuthor").html(result['data']['articles'][i]['author']);
                    $("#publishedAt").html(result['data']['articles'][i]['publishedAt']);
                    $("#articleUrl").html(result['data']['articles'][i]['url']);
                    $("#articleUrl").attr("href", result['data']['articles'][i]['url']);
                }
            });
            $("#previousArticle").on('click', function() {
                i--;
                if (result.status.name == "ok") {
                    $("#articleTitle").html(result['data']['articles'][i]['title']);
                    $("#articleDescription").html(result['data']['articles'][i]['description']);
                    $("#articleContent").html(result['data']['articles'][i]['content']);
                    $("#articleImg").attr("src", result['data']['articles'][i]['urlToImage']);
                    $("#articleAuthor").html(result['data']['articles'][i]['author']);
                    $("#publishedAt").html(result['data']['articles'][i]['publishedAt']);
                    $("#articleUrl").html(result['data']['articles'][i]['url']);
                    $("#articleUrl").attr("href", result['data']['articles'][i]['url']);
                }
            });
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    });
});


//Select country
$("#selectOption").change(function(){
    
    //Apply border
    countryName = $("#selectOption").val();
    applyCountryBorder(mymap, countryName);

    //GeoDBCities
    $.ajax({
        url: "php/GeoDBCities.php",
        type: 'POST',
        dataType: 'json',
        data: {
            //country: $('#selectOption option:selected').text(),
        },
        success: function(result) {

            console.log(result);

            if (result.status.name == "ok") {
                // const {data:{query:}} = result;
                // $("#wiki").html(result['data']['query']['pages'][0]['extract']);
                
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

    //Country Info:
    //getCountryInfo-
    $.ajax({
        url: "php/getCountryInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#selectOption').val(),
        },
        success: function(result) {

            console.log(result);

            if (result.status.name == "ok") {
                $("#countryName").html(result['data'][0]['countryName']);
                $('#capital').html(result['data'][0]['capital']);
                $('#area').html(result['data'][0]['areaInSqKm'] + " km<sup>2</sup>");
                $('#population').html(result['data'][0]['population']);
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

    //restCountry-
    $.ajax({
        url: "php/restCountry.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#selectOption').val(),
        },
        success: function(result) {

            console.log(result);

            if (result.status.name == "ok") {
                $("#flag").attr("src", result['data']['flag']);
                $('#currency').html(result['data']['currencies']['0']['name'] + " - " + result['data']['currencies']['0']['symbol']);
                $('#continent').html(result['data']['region']);
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

    //wikiApi-
    $.ajax({
        url: "php/wikiApi.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#selectOption option:selected').text(),
        },
        success: function(result) {            
            console.log(result);

            if (result.status.name == "ok") {
                $("#sumTitle").append(result['data']['0']['title']);
                $("#summary").html(result['data']['0']['summary']);
                $("#wikipediaUrl").attr('href', result['data']['0']['wikipediaUrl']);
                $("#wikipediaUrl").html(result['data']['0']['wikipediaUrl']);                
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

    //Weather:
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

                //Onload:
                $('.weatherHide').show();
                $("#temp").empty();
                $("#currentWeather").empty();
                $("#wind").empty();
                $("#sunrise").empty();
                $("#sunset").empty();
                $("#humidity").empty();

                $('#temp').html(result['data']['current']['temp']+" ℃");
                var icon = result['data']['current']['weather']['0']['icon'];
                $('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['current']['weather']['0']['description']);
                var weatherUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                $('#weatherIcon').attr("src", weatherUrl);
                $('#wind').html(result['data']['current']['wind_speed'] + ' meter/sec ' + direction(result['data']['current']['wind_deg']));
                var sunrise = moment(result['data']['current']['sunrise']*1000).format("HH:mm");
                $('#sunrise').html(sunrise);
                var sunset = moment(result['data']['current']['sunset']*1000).format("HH:mm");
                $('#sunset').html(sunset);
                $('#humidity').html(result['data']['current']['humidity'] + ' %');
                var time1 = moment(result['data']['hourly']['3']['dt']*1000).format("HH:mm");
                var time2 = moment(result['data']['hourly']['6']['dt']*1000).format("HH:mm");
                var time3 = moment(result['data']['hourly']['9']['dt']*1000).format("HH:mm");
                var time4 = moment(result['data']['hourly']['12']['dt']*1000).format("HH:mm");
                var temp1 = result['data']['hourly']['3']['temp'];
                var temp2 = result['data']['hourly']['6']['temp'];
                var temp3 = result['data']['hourly']['9']['temp'];
                var temp4 = result['data']['hourly']['12']['temp'];
                $('#hour1').append(result['data']['hourly']['3']['weather']['0']['description'] + " and " + temp1 + " ℃ at " + time1);
                $('#hour2').append(result['data']['hourly']['6']['weather']['0']['description'] + " and " + temp2 + " ℃ at " + time2);
                $('#hour3').append(result['data']['hourly']['9']['weather']['0']['description'] + " and " + temp3 + " ℃ at " + time3);
                $('#hour4').append(result['data']['hourly']['12']['weather']['0']['description'] + " and " + temp4 + " ℃ at " + time4);
                var icon1 = result['data']['hourly']['3']['weather']['0']['icon'];
                var icon2 = result['data']['hourly']['6']['weather']['0']['icon'];
                var icon3 = result['data']['hourly']['9']['weather']['0']['icon'];
                var icon4 = result['data']['hourly']['12']['weather']['0']['icon'];
                var weatherUrl1 = "http://openweathermap.org/img/wn/" + icon1 + "@2x.png";
                var weatherUrl2 = "http://openweathermap.org/img/wn/" + icon2 + "@2x.png";
                var weatherUrl3 = "http://openweathermap.org/img/wn/" + icon3 + "@2x.png";
                var weatherUrl4 = "http://openweathermap.org/img/wn/" + icon4 + "@2x.png";
                $('#weatherIcon1').attr("src", weatherUrl1);
                $('#weatherIcon2').attr("src", weatherUrl2);
                $('#weatherIcon3').attr("src", weatherUrl3);
                $('#weatherIcon4').attr("src", weatherUrl4);

                $('#hour1').empty();
                $('#hour2').empty();
                $('#hour3').empty();
                $('#hour4').empty();
                // $('#hourWeather1').html('<img id="weatherIcon1" alt="weather icon" src=""></img>');
                // $('#hourWeather2').html('<img id="weatherIcon2" alt="weather icon" src=""></img>');
                // $('#hourWeather3').html('<img id="weatherIcon3" alt="weather icon" src=""></img>');
                // $('#hourWeather4').html('<img id="weatherIcon4" alt="weather icon" src=""></img>');
                var time1 = moment(result['data']['hourly']['3']['dt']*1000).format("HH:mm");
                var time2 = moment(result['data']['hourly']['6']['dt']*1000).format("HH:mm");
                var time3 = moment(result['data']['hourly']['9']['dt']*1000).format("HH:mm");
                var time4 = moment(result['data']['hourly']['12']['dt']*1000).format("HH:mm");
                var temp1 = result['data']['hourly']['3']['temp'];
                var temp2 = result['data']['hourly']['6']['temp'];
                var temp3 = result['data']['hourly']['9']['temp'];
                var temp4 = result['data']['hourly']['12']['temp'];
                $('#hour1').append(result['data']['hourly']['3']['weather']['0']['description'] + " and " + temp1 + " ℃ at " + time1);
                $('#hour2').append(result['data']['hourly']['6']['weather']['0']['description'] + " and " + temp2 + " ℃ at " + time2);
                $('#hour3').append(result['data']['hourly']['9']['weather']['0']['description'] + " and " + temp3 + " ℃ at " + time3);
                $('#hour4').append(result['data']['hourly']['12']['weather']['0']['description'] + " and " + temp4 + " ℃ at " + time4);
                var icon1 = result['data']['hourly']['3']['weather']['0']['icon'];
                var icon2 = result['data']['hourly']['6']['weather']['0']['icon'];
                var icon3 = result['data']['hourly']['9']['weather']['0']['icon'];
                var icon4 = result['data']['hourly']['12']['weather']['0']['icon'];
                var weatherUrl1 = "http://openweathermap.org/img/wn/" + icon1 + "@2x.png";
                var weatherUrl2 = "http://openweathermap.org/img/wn/" + icon2 + "@2x.png";
                var weatherUrl3 = "http://openweathermap.org/img/wn/" + icon3 + "@2x.png";
                var weatherUrl4 = "http://openweathermap.org/img/wn/" + icon4 + "@2x.png";
                $('#weatherIcon1').attr("src", weatherUrl1);
                $('#weatherIcon2').attr("src", weatherUrl2);
                $('#weatherIcon3').attr("src", weatherUrl3);
                $('#weatherIcon4').attr("src", weatherUrl4);

                //Today
                $("#day1").on('click', function(){
                    $('.weatherHide').show();
                    $("#temp").empty();
                    $("#currentWeather").empty();
                    $("#wind").empty();
                    $("#sunrise").empty();
                    $("#sunset").empty();
                    $("#humidity").empty();
                    $('#temp').html(result['data']['current']['temp']+" ℃");
                    var icon = result['data']['current']['weather']['0']['icon'];
                    $('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['current']['weather']['0']['description']);
                    var weatherUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                    $('#weatherIcon').attr("src", weatherUrl);
                    $('#wind').html(result['data']['current']['wind_speed'] + ' meter/sec ' + direction(result['data']['current']['wind_deg']));
                    var sunrise = moment(result['data']['current']['sunrise']*1000).format("HH:mm");
                    $('#sunrise').html(sunrise);
                    var sunset = moment(result['data']['current']['sunset']*1000).format("HH:mm");
                    $('#sunset').html(sunset);
                    $('#humidity').html(result['data']['current']['humidity'] + ' %');

                    $('#hour1').empty();
                    $('#hour2').empty();
                    $('#hour3').empty();
                    $('#hour4').empty();
                    // $('#hourWeather1').html('<img id="weatherIcon1" alt="weather icon" src=""></img>');
                    // $('#hourWeather2').html('<img id="weatherIcon2" alt="weather icon" src=""></img>');
                    // $('#hourWeather3').html('<img id="weatherIcon3" alt="weather icon" src=""></img>');
                    // $('#hourWeather4').html('<img id="weatherIcon4" alt="weather icon" src=""></img>');
                    var time1 = moment(result['data']['hourly']['3']['dt']*1000).format("HH:mm");
                    var time2 = moment(result['data']['hourly']['6']['dt']*1000).format("HH:mm");
                    var time3 = moment(result['data']['hourly']['9']['dt']*1000).format("HH:mm");
                    var time4 = moment(result['data']['hourly']['12']['dt']*1000).format("HH:mm");
                    var temp1 = result['data']['hourly']['3']['temp'];
                    var temp2 = result['data']['hourly']['6']['temp'];
                    var temp3 = result['data']['hourly']['9']['temp'];
                    var temp4 = result['data']['hourly']['12']['temp'];
                    $('#hour1').append(result['data']['hourly']['3']['weather']['0']['description'] + " and " + temp1 + " ℃ at " + time1);
                    $('#hour2').append(result['data']['hourly']['6']['weather']['0']['description'] + " and " + temp2 + " ℃ at " + time2);
                    $('#hour3').append(result['data']['hourly']['9']['weather']['0']['description'] + " and " + temp3 + " ℃ at " + time3);
                    $('#hour4').append(result['data']['hourly']['12']['weather']['0']['description'] + " and " + temp4 + " ℃ at " + time4);
                    var icon1 = result['data']['hourly']['3']['weather']['0']['icon'];
                    var icon2 = result['data']['hourly']['6']['weather']['0']['icon'];
                    var icon3 = result['data']['hourly']['9']['weather']['0']['icon'];
                    var icon4 = result['data']['hourly']['12']['weather']['0']['icon'];
                    var weatherUrl1 = "http://openweathermap.org/img/wn/" + icon1 + "@2x.png";
                    var weatherUrl2 = "http://openweathermap.org/img/wn/" + icon2 + "@2x.png";
                    var weatherUrl3 = "http://openweathermap.org/img/wn/" + icon3 + "@2x.png";
                    var weatherUrl4 = "http://openweathermap.org/img/wn/" + icon4 + "@2x.png";
                    $('#weatherIcon1').attr("src", weatherUrl1);
                    $('#weatherIcon2').attr("src", weatherUrl2);
                    $('#weatherIcon3').attr("src", weatherUrl3);
                    $('#weatherIcon4').attr("src", weatherUrl4);
                });
            
            
                //Tomorrow
                $("#day2").on('click', function(){
                    $("#currentWeather").empty();
                    $('.weatherHide').hide();
                    $('#temp').html("Max: " + result['data']['daily'][1]['temp']['max'] +" ℃ \n" + "Min: "  + result['data']['daily'][1]['temp']['min'] + " ℃");
                    var icon = result['data']['daily'][1]['weather']['0']['icon'];
                    $('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['daily'][1]['weather']['0']['description']);
                    var weatherUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                    $('#weatherIcon').attr("src", weatherUrl);
                    $('#wind').html(result['data']['daily'][1]['wind_speed'] + ' meter/sec ' + direction(result['data']['daily'][1]['wind_deg']));
                    var sunrise = moment(result['data']['daily'][1]['sunrise']*1000).format("HH:mm");
                    $('#sunrise').html(sunrise);
                    var sunset = moment(result['data']['daily'][1]['sunset']*1000).format("HH:mm");
                    $('#sunset').html(sunset);
                    $('#humidity').html(result['data']['daily'][1]['humidity'] + ' %');
                });

                //Third Day
                $("#day3").on('click', function(){
                    $("#currentWeather").empty();
                    $('.weatherHide').hide();
                    $('#temp').html("Max: " + result['data']['daily'][2]['temp']['max'] +" ℃ \n" + "Min: "  + result['data']['daily'][2]['temp']['min'] + " ℃");
                    var icon = result['data']['daily'][2]['weather']['0']['icon'];
                    $('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['daily'][2]['weather']['0']['description']);
                    var weatherUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                    $('#weatherIcon').attr("src", weatherUrl);
                    $('#wind').html(result['data']['daily'][2]['wind_speed'] + ' meter/sec ' + direction(result['data']['daily'][2]['wind_deg']));
                    var sunrise = moment(result['data']['daily'][2]['sunrise']*1000).format("HH:mm");
                    $('#sunrise').html(sunrise);
                    var sunset = moment(result['data']['daily'][2]['sunset']*1000).format("HH:mm");
                    $('#sunset').html(sunset);
                    $('#humidity').html(result['data']['daily'][2]['humidity'] + ' %');
                });

                //Fourth Day
                $("#day4").on('click', function(){
                    $("#currentWeather").empty();
                    $('.weatherHide').hide();
                    $('#temp').html("Max: " + result['data']['daily'][3]['temp']['max'] +" ℃ \n" + "Min: "  + result['data']['daily'][3]['temp']['min'] + " ℃");
                    var icon = result['data']['daily'][3]['weather']['0']['icon'];
                    $('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['daily'][3]['weather']['0']['description']);
                    var weatherUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                    $('#weatherIcon').attr("src", weatherUrl);
                    $('#wind').html(result['data']['daily'][3]['wind_speed'] + ' meter/sec ' + direction(result['data']['daily'][3]['wind_deg']));
                    var sunrise = moment(result['data']['daily'][3]['sunrise']*1000).format("HH:mm");
                    $('#sunrise').html(sunrise);
                    var sunset = moment(result['data']['daily'][3]['sunset']*1000).format("HH:mm");
                    $('#sunset').html(sunset);
                    $('#humidity').html(result['data']['daily'][3]['humidity'] + ' %');
                });                
                
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("There has been an error!")
        }
    });

    //News:
    $.ajax({
        url: "php/newsApi.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#selectOption option:selected').val(),
        },
        success: function(result) {

            console.log(result);
            
            if (result.status.name == "ok") {
                $("#articleTitle").html(result['data']['articles']['0']['title']);
                $("#articleDescription").html(result['data']['articles']['0']['description']);
                $("#articleContent").html(result['data']['articles']['0']['content']);
                $("#articleImg").attr("src", result['data']['articles']['0']['urlToImage']);
                $("#articleAuthor").html(result['data']['articles']['0']['author']);
                $("#publishedAt").html(result['data']['articles']['0']['publishedAt']);
                $("#articleUrl").html(result['data']['articles']['0']['url']);
                $("#articleUrl").attr("href", result['data']['articles']['0']['url']);
            }
            var i = 0;
            $("#nextArticle").on('click', function() {
                i++;
                if (result.status.name == "ok") {
                    $("#articleTitle").html(result['data']['articles'][i]['title']);
                    $("#articleDescription").html(result['data']['articles'][i]['description']);
                    $("#articleContent").html(result['data']['articles'][i]['content']);
                    $("#articleImg").attr("src", result['data']['articles'][i]['urlToImage']);
                    $("#articleAuthor").html(result['data']['articles'][i]['author']);
                    $("#publishedAt").html(result['data']['articles'][i]['publishedAt']);
                    $("#articleUrl").html(result['data']['articles'][i]['url']);
                    $("#articleUrl").attr("href", result['data']['articles'][i]['url']);
                }
            });
            $("#previousArticle").on('click', function() {
                i--;
                if (result.status.name == "ok") {
                    $("#articleTitle").html(result['data']['articles'][i]['title']);
                    $("#articleDescription").html(result['data']['articles'][i]['description']);
                    $("#articleContent").html(result['data']['articles'][i]['content']);
                    $("#articleImg").attr("src", result['data']['articles'][i]['urlToImage']);
                    $("#articleAuthor").html(result['data']['articles'][i]['author']);
                    $("#publishedAt").html(result['data']['articles'][i]['publishedAt']);
                    $("#articleUrl").html(result['data']['articles'][i]['url']);
                    $("#articleUrl").attr("href", result['data']['articles'][i]['url']);
                }
            });
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    });
});

$("#exchangeBtn").on('click', function(){
    //Exchange
    $.ajax({
        url: "php/openExchangeRates.php",
        type: 'POST',
        dataType: 'json',
        data: {
           base: $('#from option:selected').text(),
           //base: 'GBP',
        },
        success: function(result) {

            console.log(result);

            if (result.status.name == "ok") {
                $("#exchangeResult").html(result['data']['rates'][$('#to option:selected').text()] * $('#value').val());
                $("#exchangeDate").html(result['data']['date']);
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    });
});