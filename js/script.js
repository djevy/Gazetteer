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
    var redIcon = new L.Icon({
        iconUrl: 'squat-marker-red.svg',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    })
    var PinIcon = L.Icon.extend({
        options: {
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize:     [25, 41],
            shadowSize:   [41, 41],
            iconAnchor:   [12, 41],
            popupAnchor:  [1, -34]
        }
    });
    var greenIcon = new PinIcon({iconUrl: 'squat-marker-green.svg'});
    
    mymap.addLayer(tiles);
    mymap.setView(London, 4);

//Get location
    var latlng = [];
    var userLocation = [];
    var miniMap = new L.Control.GlobeMiniMap({     
        land:'#03ac13',
        water:'#0195d0',
        marker:'#000',
        topojsonSrc: '../data/world.json'
    }).addTo(mymap);

    mymap.locate({setView: false}).on('locationfound', function(e){

        userLocation = [e.latitude, e.longitude]
        var locationMarker = L.marker(userLocation, {icon: redIcon}).bindPopup('You are here!');
        var circle =L.circle([e.latitude, e.longitude], e.accuracy/2, {
            weight: 1,
            color: 'red',
            fillColor: '#cacaca',
            fillOpacity: 0.2
        });


        mymap.addLayer(locationMarker);
        mymap.addLayer(circle);


        //Weather:
        $.ajax({
            url: "php/openWeather.php",
            type: 'POST',
            dataType: 'json',
            data: {
                lat: userLocation[0],
                lon: userLocation[1]
            },
            success: function(result) {
                //console.log(result);
                if (result.status.name == "ok" && result['data']['current'] != undefined) {

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
                    var calculated = Math.round(result['data']['current']['wind_speed'] * 3600 / 1610.3*1000)/1000;
                    $('#wind').html(calculated + ' mph ' + direction(result['data']['current']['wind_deg']));                        var sunrise = moment(result['data']['current']['sunrise']*1000).format("HH:mm");
                    $('#sunrise').html(sunrise);
                    var sunset = moment(result['data']['current']['sunset']*1000).format("HH:mm");
                    $('#sunset').html(sunset);
                    $('#humidity').html(result['data']['current']['humidity'] + ' %');

                    $('#hour1').empty();
                    $('#hour2').empty();
                    $('#hour3').empty();
                    $('#hour4').empty();
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
                        var calculated = Math.round(result['data']['current']['wind_speed'] * 3600 / 1610.3*1000)/1000;
                        $('#wind').html(calculated + ' mph ' + direction(result['data']['current']['wind_deg']));                        var sunrise = moment(result['data']['current']['sunrise']*1000).format("HH:mm");
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
                        var calculated = Math.round(result['data']['daily'][1]['wind_speed'] * 3600 / 1610.3*1000)/1000;
                        $('#wind').html(calculated + ' mph ' + direction(result['data']['daily'][1]['wind_deg']));
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
                        var calculated = Math.round(result['data']['daily'][2]['wind_speed'] * 3600 / 1610.3*1000)/1000;
                        $('#wind').html(calculated + ' mph ' + direction(result['data']['daily'][2]['wind_deg']));
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
                        var calculated = Math.round(result['data']['daily'][3]['wind_speed'] * 3600 / 1610.3*1000)/1000;
                        $('#wind').html(calculated + ' mph ' + direction(result['data']['daily'][3]['wind_deg']));
                        $('#sunrise').html(sunrise);
                        var sunset = moment(result['data']['daily'][3]['sunset']*1000).format("HH:mm");
                        $('#sunset').html(sunset);
                        $('#humidity').html(result['data']['daily'][3]['humidity'] + ' %');
                    });                
                    
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(jqXHR + " There has been an error! " + errorThrown)
            }
        });


        //change selectOption to users location:
        $.ajax({
            url: "php/getCountryCode.php",
            type: 'POST',
            dataType: 'json',
            data: {
                lat: e.latitude,
                lng: e.longitude,
            },
            success: function(result) {

                // console.log(result);

                if (result.status.name == "ok") {
                    $("#selectOption").val(result['data']['countryCode']).change();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // console.warn(jqXHR.responseText + "   " + errorThrown);
            }
        }); 

    }). on('locationerror', function(e) {
        console.log(e);
        alert("Location access denied.");
    });





//Easy Buttons:
    //Info-
    infoButton = L.easyButton({
        id: 'infoLeaf',
        position: 'topleft',
        type: 'animate',
        leafletClasses: true,
        states:[{
          stateName: 'show-info',
          onClick: function(button, map){
            $("#infoModalScrollable").modal();
          },
          title: 'show country information',
          icon: "fa-info"
        }]
      })
    mymap.addControl(infoButton);
    
    // Weather-
    weatherButton = L.easyButton({
        id: 'weatherLeaf',
        position: 'topleft',
        type: 'animate',
        leafletClasses: true,
        states:[{
          stateName: 'show-weather',
          onClick: function(button, map){
            $("#weatherModalScrollable").modal();
          },
          title: 'show the weather',
          icon: "fa-cloud-sun "
        }]
      })
    mymap.addControl(weatherButton);

    //News-
    newsButton = L.easyButton({
        id: 'newsLeaf',
        position: 'topleft',
        type: 'animate',
        leafletClasses: true,
        states:[{
          stateName: 'show-news',
          onClick: function(button, map){
            $("#newsModalScrollable").modal();
          },
          title: 'show country news',
          icon: "fa-newspaper"
        }]
      });
     mymap.addControl(newsButton);

     //Exchange-
     exchangeButton = L.easyButton({
        id: 'exchangeLeaf',
        position: 'topleft',
        type: 'animate',
        leafletClasses: true,
        states:[{
          stateName: 'show-exchange',
          onClick: function(button, map){
            $("#exchangeModalScrollable").modal();
          },
          title: 'show exchange rates',
          icon: "fa-dollar"
        }]
      });
     mymap.addControl(exchangeButton);

     //Images-
     imagesButton = L.easyButton({
        id: 'imagesLeaf',
        position: 'topleft',
        type: 'animate',
        leafletClasses: true,
        states:[{
          stateName: 'show-images',
          onClick: function(button, map){
            $("#imagesModalScrollable").modal();
          },
          title: 'show country images',
          icon: "fa-camera"
        }]
      });
     mymap.addControl(imagesButton);



//Exchange
    var currencies = ["AUD","BGN","BRL","CAD","CHF","CNY","CZK","DKK","EUR","GBP","HRK","HUF","IDR","ILS","INR","ISK","JPY","KRW","MXN","MYR","NOK","NZD","PHP","PLN","RON","RUB","SEK","SGD","THB","TRY","USD","ZAR"];
    
    //Populate currencies -
        $('#select').empty();
        for (var i = 0; i <= currencies.length; i++) {
            $('#from').append('<option value="' + currencies[i] + '">' + currencies[i] + '</option>');
            $('#to').append('<option value="' + currencies[i] + '">' + currencies[i] + '</option>');
        }



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


//Days:
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


//Fill countries-
$.ajax({
    url: "php/countryNames.php",
    type: 'GET',
    dataType: 'json',

    success: function(result) {

        //console.log(result);

        if (result.status.name == "ok") {
            for (var i = 0; i < result.data.length; i++) {
                $('#selectOption').append("<option value=" + result['data'][i]['code'] + ">" + result['data'][i]['name'] + "</option>");
            }
        }
    
    },
});

//Select country
    $("#selectOption").change(function(){
        //Apply border
        $.ajax({
            url: "php/countryBorders.php",
            type: "POST",
            dataType: "json",
            data: {
                code: $("#selectOption option:selected").val(),
            },

            success: function(result) {

                // console.log(result);
        
                if (result.status.name == "ok") {
                    var bounds = result.data;
                    var borderStyle =  {
                        color: "#03ac13",
                        weight: 3,
                        opacity: 0.7,
                        fillOpacity: 0.0 
                    };
                    var border = L.geoJSON(bounds, borderStyle).addTo(mymap);
                    
                    mymap.fitBounds(border.getBounds(), {
                        padding: [10, 10],
                        animate: true,
                        duration: 5,
                    });
                };
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // console.warn(errorThrown);
            }
        });    

        //Country City Markers-
        $.ajax({
            url: "php/geoDBCities.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: $('#selectOption option:selected').val(),
            },
            success: function(result) {

                // console.log(result);

                if (result.status.name == "ok") {
                    result['data']['data'].forEach(element => {
                        L.marker([element.latitude, element.longitude], {icon: greenIcon}).addTo(mymap).bindPopup("<h1>" + element.name + "</h1> </br>");
                    });
                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // console.warn(jqXHR.responseText);
            }
        }); 

        //getCountryInfo-
        $.ajax({
            url: "php/getCountryInfo.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: $('#selectOption').val(),
            },
            success: function(result) {

                // console.log(result);

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

                //console.log(result);

                if (result.status.name == "ok") {
                    $("#flag").attr("src", result['data']['flag']);
                    $('#currency').html(result['data']['currencies']['0']['name'] + " - " + result['data']['currencies']['0']['symbol']);
                    $('#continent').html(result['data']['region']);
                    $('#language').html(result['data']['languages']['0']['name']);
                    
                    //update map view:
                    latlng = [result['data']['latlng']['0'], result['data']['latlng']['1']];
                    //console.log(latlng);
                    //mymap.flyTo(latlng, 5);
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
                // console.log(result);

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
                // console.log(result);
                if (result.status.name == "ok" && result['data']['current'] != undefined) {

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
                    var calculated = Math.round(result['data']['current']['wind_speed'] * 3600 / 1610.3*1000)/1000;
                    $('#wind').html(calculated + ' mph ' + direction(result['data']['current']['wind_deg']));
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
                        var calculated = Math.round(result['data']['current']['wind_speed'] * 3600 / 1610.3*1000)/1000;
                        $('#wind').html(calculated + ' mph ' + direction(result['data']['current']['wind_deg']));
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
                        var calculated = Math.round(result['data']['daily'][1]['wind_speed'] * 3600 / 1610.3*1000)/1000;
                        $('#wind').html(calculated + ' mph ' + direction(result['data']['daily'][1]['wind_deg']));
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
                        var calculated = Math.round(result['data']['daily'][2]['wind_speed'] * 3600 / 1610.3*1000)/1000;
                        $('#wind').html(calculated + ' mph ' + direction(result['data']['daily'][2]['wind_deg']));
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
                        var calculated = Math.round(result['data']['daily'][3]['wind_speed'] * 3600 / 1610.3*1000)/1000;
                        $('#wind').html(calculated + ' mph ' + direction(result['data']['daily'][3]['wind_deg']));
                        $('#sunrise').html(sunrise);
                        var sunset = moment(result['data']['daily'][3]['sunset']*1000).format("HH:mm");
                        $('#sunset').html(sunset);
                        $('#humidity').html(result['data']['daily'][3]['humidity'] + ' %');
                    });                
                    
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // console.warn("There has been an error! " + jqXHR.responseText + " " + errorThrown);
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

                //  console.log(result);
                
                if (result.status.name == "ok" && result['data']['articles']['0'] !== undefined) {
                    $("#newsCountry").empty();
                    $("#newsCountry").append($('#selectOption option:selected').text());
                    $("#articleTitle").html(result['data']['articles']['0']['title']);
                    $("#articleDescription").html(result['data']['articles']['0']['description']);
                    $("#articleContent").html(result['data']['articles']['0']['content']);
                    $("#articleImg").attr("src", result['data']['articles']['0']['urlToImage']);
                    $("#articleAuthor").html(result['data']['articles']['0']['author']);
                    var date = result['data']['articles']['0']['publishedAt'];
                    $("#publishedAt").html(moment(date).format('DD-MM-YYYY'));
                    $("#articleUrl").html('https://' + result['data']['articles']['0']['url']);
                    $("#articleUrl").attr("href",'https://' +  result['data']['articles']['0']['url']);
                }
                var i = 0;
                $("#nextArticle").on('click', function() {
                    if (result.status.name == "ok" && result['data']['articles'][i] !== undefined && i<(result['data']['articles'].length-1)) {
                        i++
                        // console.log(i)
                        $("#articleTitle").html(result['data']['articles'][i]['title']);
                        $("#articleDescription").html(result['data']['articles'][i]['description']);
                        $("#articleContent").html(result['data']['articles'][i]['content']);
                        $("#articleImg").attr("src", result['data']['articles'][i]['urlToImage']);
                        $("#articleAuthor").html(result['data']['articles'][i]['author']);
                        var date = result['data']['articles'][i]['publishedAt'];
                        $("#publishedAt").html(moment(date).format('DD-MM-YYYY'));
                        $("#articleUrl").html('https://' + result['data']['articles'][i]['url']);
                        $("#articleUrl").attr("href",'https://' +  result['data']['articles'][i]['url']);
                    }
                });
                
                $("#previousArticle").on('click', function() {
                    if (result.status.name == "ok" && result['data']['articles'][i] !== undefined && i>0) {
                        i--;
                        // console.log(i)
                        $("#articleTitle").html(result['data']['articles'][i]['title']);
                        $("#articleDescription").html(result['data']['articles'][i]['description']);
                        $("#articleContent").html(result['data']['articles'][i]['content']);
                        $("#articleImg").attr("src", result['data']['articles'][i]['urlToImage']);
                        $("#articleAuthor").html(result['data']['articles'][i]['author']);
                        var date = result['data']['articles'][i]['publishedAt'];
                        $("#publishedAt").html(moment(date).format('DD-MM-YYYY'));
                        $("#articleUrl").html('https://' + result['data']['articles'][i]['url']);
                        $("#articleUrl").attr("href", 'https://' + result['data']['articles'][i]['url']);
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

                // console.log(result);
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
                // console.warn("There has been an error " + errorThrown);
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

                // console.log(result);

                if (result.status.name == "ok") {
                    var conversion = Number(result['data']['rates'][$('#to option:selected').text()] * $('#value').val());
                    $("#exchangeResult").html(conversion.toFixed(2) + " - " + $('#to option:selected').text());
                    var date = result['data']['date'];
                    $("#exchangeDate").html(moment(date).format('DD-MM-YYYY'));
                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
            }
        });
    });