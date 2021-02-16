//Preloader:
$(window).on('load', function () {
    if ($('#preloader').length) {
    $('#preloader').delay(100).fadeOut('slow', function () {
        $(this).remove();
    });
    }
});

//Creating a map:
var London = [52, -0.09];
var mymap = L.map('map');
var tileUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}';
var tiles = L.tileLayer(tileUrl, { 
    attribution:'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 2,
    maxZoom: 20,
    ext: 'png'
 });
 mymap.addLayer(tiles);
 mymap.setView(London, 4);

var loadMap = function(id) {

    var redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      
     //Get location
     mymap.locate({setView: true}).on('locationfound', function(e){
         var locationMarker = L.marker([e.latitude, e.longitude], {icon: redIcon}).bindPopup('You are here!');
         var circle =L.circle([e.latitude, e.longitude], e.accuracy/2, {
             weight: 1,
             color: 'red',
             fillColor: '#cacaca',
             fillOpacity: 0.2
         });
         //var marker = L.marker([51.6, -0.09]).addTo(mymap);
         mymap.addLayer(locationMarker);
         mymap.addLayer(circle);
     }). on('locationerror', function(e) {
         console.log(e);
         alert("Location access denied.");
     });
     //Apply border:
     $(window).on('load',function(){
        countryName = $("#selectOption").val();
        applyCountryBorder(mymap, countryName);
     });

     $("#selectOption").change(function(){
        countryName = $("#selectOption").val();
        applyCountryBorder(mymap, countryName);
     });
};

var miniMap = new L.Control.GlobeMiniMap({     
    land:'#03ac13',
    water:'#0195d0',
    marker:'#000',
    topojsonSrc: '../data/world.json'
  }).addTo(mymap);

loadMap('mymap');


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
        
        var borderLayer = L.geoJSON(data[0].geojson, {
          color: "#03ac13",
          weight: 3,
          opacity: 0.7,
          fillOpacity: 0.0 
        }).addTo(mymap);
        borderLayer.addTo(mymap);
      });
};

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
    //console.log(data);
    for (var i = 0; i < data.length; i++) {
        if(data[i]['alpha-2'] != 'undefined'){
            $('#selectOption').append("<option value=" + data[i]['alpha-2'] + ">" + data[i]['name'] + "</option>");
        }
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
$(window).on('load', function(){

    //World cities
    $.getJSON('php/worldCities.json', function(data) {
        var cities = data.features.filter(function(value){
            return value.properties.isoa2 == $('#selectOption').val();
        });
        for(var i = 0; i<cities.length; i++){
                var title = cities[i]['properties']['name'];
                var pop = cities[i]['properties']['pop_min'];
                L.geoJson(cities[i]['geometry']).bindPopup("<h1>" + title + "</h1> </br>" + "Population: " + pop + "</br>").addTo(mymap);

                $("#cityImages")
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
                $('#language').html(result['data']['languages']['0']['name']);
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
                $("#sumTitle").empty();
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
                //$('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['current']['weather']['0']['description']);
                var weatherUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
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
                var weatherUrl1 = "https://openweathermap.org/img/wn/" + icon1 + "@2x.png";
                var weatherUrl2 = "https://openweathermap.org/img/wn/" + icon2 + "@2x.png";
                var weatherUrl3 = "https://openweathermap.org/img/wn/" + icon3 + "@2x.png";
                var weatherUrl4 = "https://openweathermap.org/img/wn/" + icon4 + "@2x.png";
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
                    var weatherUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
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
                    var weatherUrl1 = "https://openweathermap.org/img/wn/" + icon1 + "@2x.png";
                    var weatherUrl2 = "https://openweathermap.org/img/wn/" + icon2 + "@2x.png";
                    var weatherUrl3 = "https://openweathermap.org/img/wn/" + icon3 + "@2x.png";
                    var weatherUrl4 = "https://openweathermap.org/img/wn/" + icon4 + "@2x.png";
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
                    var weatherUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
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
                    var weatherUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
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
                    var weatherUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
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

    //Location Images:
    $.ajax({
        url: "php/locationImages.php",
        type: 'POST',
        dataType: 'json',
        data: {
        query: $('#selectOption option:selected').text(),
        },
        success: function(result) {

            console.log(result);
            
            if (result.status.name == "ok") {
                for(var i = 0; i<result['data']['results'].length; i++){
                    $("#countryImages").append("<p style='color:white' id='description" + i +"'class='countryDescription'>")
                    $("#countryImages").append("<img src='' alt='' id='image" + i +"'class='countryImages'><br><br>")
                    $("#image" + i).attr('src', result['data']['results'][i]['urls']['regular']);
                    $("#image" + i).attr('alt', result['data']['results'][i]['alt_description']);
                    $("#description" + i).append(result['data']['results'][i]['alt_description'] + " -");
                }
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.warn("There has been an error " + errorThrown);
        }
    });
});


//Select country
$("#selectOption").change(function(){

    //Country City Markers-
    $.getJSON('php/worldCities.json', function(data) {
        
        var cities = data.features.filter(function(value){
            return value.properties.isoa2 == $('#selectOption').val();
        });
        for(var i = 0; i<cities.length; i++){
            var title = cities[i]['properties']['name'];
            var pop = cities[i]['properties']['pop_min'];
            L.geoJson(cities[i]['geometry']).bindPopup("<h1>" + title + "</h1> </br>" + "Population: " +pop).addTo(mymap);
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
                $('#language').html(result['data']['languages']['0']['name']);
                
                //update map view:
                latlng = [result['data']['latlng']['0'], result['data']['latlng']['1']];
                console.log(latlng);
                mymap.flyTo(latlng, 5);
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("There has been an error!")
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
                $("#sumTitle").empty();
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
            lat: window.latlng[0],
            lon: window.latlng[1]
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
                var weatherUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
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
                var weatherUrl1 = "https://openweathermap.org/img/wn/" + icon1 + "@2x.png";
                var weatherUrl2 = "https://openweathermap.org/img/wn/" + icon2 + "@2x.png";
                var weatherUrl3 = "https://openweathermap.org/img/wn/" + icon3 + "@2x.png";
                var weatherUrl4 = "https://openweathermap.org/img/wn/" + icon4 + "@2x.png";
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
                var weatherUrl1 = "https://openweathermap.org/img/wn/" + icon1 + "@2x.png";
                var weatherUrl2 = "https://openweathermap.org/img/wn/" + icon2 + "@2x.png";
                var weatherUrl3 = "https://openweathermap.org/img/wn/" + icon3 + "@2x.png";
                var weatherUrl4 = "https://openweathermap.org/img/wn/" + icon4 + "@2x.png";
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
                    var weatherUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
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
                    var weatherUrl1 = "https://openweathermap.org/img/wn/" + icon1 + "@2x.png";
                    var weatherUrl2 = "https://openweathermap.org/img/wn/" + icon2 + "@2x.png";
                    var weatherUrl3 = "https://openweathermap.org/img/wn/" + icon3 + "@2x.png";
                    var weatherUrl4 = "https://openweathermap.org/img/wn/" + icon4 + "@2x.png";
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
                    var weatherUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
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
                    var weatherUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
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
                    var weatherUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
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
                $("#newsCountry").empty();
                $("#newsCountry").append($('#selectOption option:selected').text());
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

    //Location Images:
    $.ajax({
        url: "php/locationImages.php",
        type: 'POST',
        dataType: 'json',
        data: {
        query: $('#selectOption option:selected').text(),
        },
        success: function(result) {

            console.log(result);
            $("#countryImages").empty();
            
            if (result.status.name == "ok") {
                for(var i = 0; i<result['data']['results'].length; i++){
                    
                    $("#countryImages").append("<p style='color:white' id='description" + i +"'class='countryDescription'>")
                    $("#countryImages").append("<img src='' alt='' id='image" + i +"'class='countryImages'><br><br>")
                    $("#image" + i).attr('src', result['data']['results'][i]['urls']['regular']);
                    $("#image" + i).attr('alt', result['data']['results'][i]['alt_description']);
                    $("#description" + i).append(result['data']['results'][i]['alt_description'] + " -");
                }
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.warn("There has been an error " + errorThrown);
        }
    });
});

//Exchange
$("#exchangeBtn").on('click', function(){
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
                var conversion = Number(result['data']['rates'][$('#to option:selected').text()] * $('#value').val());
                $("#exchangeResult").html(conversion.toFixed(2) + " - " + $('#to option:selected').text());
                $("#exchangeDate").html(result['data']['date']);
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    });
});