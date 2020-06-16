'use strict';

(function () {

    //first load map load
    geocode("East Falls", OMW_MAPBOX_KEY).then(function (result) {
        console.log(result);
        mapboxgl.accessToken = OMW_MAPBOX_KEY;
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9',
            center: result,
            zoom: 13
        });
        map.setCenter(result);
        // map.flyTo({center: result});
    });


    var q = $('#search-term').val();

    function getInfo() {
        var q = $('#search-term').val();
        console.log(q);

        geocode(q, OMW_MAPBOX_KEY).then(function (result) {
            console.log(result);
            mapboxgl.accessToken = OMW_MAPBOX_KEY;
            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v9',
                center: result,
                zoom: 13
            });
            // map.setCenter(result);
            map.flyTo({center: result});
            var markerOptions = {
                color: "#2c2d68",
                draggable: true
            };
            var marker = new mapboxgl.Marker(markerOptions)
                .setLngLat(result)
                .addTo(map);
        });

        $.get("http://api.openweathermap.org/data/2.5/forecast", {
            "APPID": OWM_KEY,
            "q": q,
            "units": "imperial"
        }).done(function (data) {
            console.log(data);
            renderHTML(data);
        }).fail(function (errors) {
            console.error(errors)
        });
    }

    function renderHTML(data) {
        console.log(data);
        //this function logs min temp for JUST one day.
        function minTemp(){
            var miniTempArr=[];
            for (var i = 0; i < 7;i++){
                // console.log(data.list[i].main.temp_min);
                miniTempArr.push(data.list[i].main.temp_min)
            }
            return(Math.floor(Math.min(...miniTempArr)));
        }
        minTemp(data);

        // console.log(data.list[0].main.temp_min);
        // console.log(data.list[1].main.temp_min);
        // console.log(data.list[2].main.temp_min);
        // console.log(data.list[3].main.temp_min);
        // console.log(data.list[4].main.temp_min);
        // console.log(data.list[5].main.temp_min);
        // console.log(data.list[6].main.temp_min);



        function maximumTemp(data){
            var maxTemp=[];
            for (var i =0; i<data.list.length; i+=6){
                maxTemp.push(data.list[i].main.temp_max);
            }
            return (Math.floor(Math.max(...maxTemp)));
        }

        // console.log(maximumTemp(data));

        $('#weather,#location').empty();
        $('#location').append("Your current location is: ", data.city.name);
        $('#powered-by-owm').html("Powered by: " + "<a href='https://openweathermap.org/'>OpenWeather</a>");
        for (var i = 0; i < 40; i += 8) {

            //icon
            var imgIcon = 'http://openweathermap.org/img/w/"+data.list[i].weather[0].icon+".png';

            var degreeSign = '\xB0F';

            //get rid of the time from the date
            var dateNoTime = data.list[i].dt_txt;
            var printDate = dateNoTime.slice(0, 10);

            var mainList = data.list[i].main;
            var startSpan = '<span class="font-weight-bold">';
            var endSpan = '</span>';
            var weatherCards = "";
            var headerLocation = "";

            $('#weather-info').html("<h3>" + "For the week beginning: " + data.list[0].dt_txt.slice(0, 10) + "</h3>");

            //populates the cards
            weatherCards = '<div class="card">' +
                '<h5 class="card-header text-center border-bottom">' + printDate + '</h5>' +
                '<div class="card-body p-0 m-0">' +
                '<div class="card-no-header">' +
                '<h5 class="card-title text-center  pt-2">' + Math.floor(mainList.temp) + degreeSign + ' ' + '</h5>' +
                '<p class="card-text text-center">' + minTemp(data)+ degreeSign + ' / ' + maximumTemp(data) + degreeSign + '</p>' +
                '<img class="mx-auto d-block" src=' + 'http://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png' + ' alt="">' +
                '<p class="card-text border-bottom pl-1 ">' + 'Description: ' + startSpan + data.list[i].weather[0].description + endSpan + '</p>' +
                '<p class="card-text border-bottom pl-1">' + 'Humidity:  ' + startSpan + mainList.humidity + '%' + endSpan + '</p>' +
                '<p class="card-text border-bottom pl-1">' + 'Wind:  ' + startSpan + data.list[i].wind.speed + ' mi/hr' + endSpan + '</p>' +
                '<p class="card-text pl-1 ">' + 'Pressure:  ' + startSpan + mainList.pressure + ' hPa' + endSpan + '</p>' +
                '</div>' + '</div>';
            $("#weather").append(weatherCards);
            // '<p class="card-text text-center">' + Math.floor(mainList.temp_min) + degreeSign + ' / ' + (Math.floor(mainList.temp_max) + degreeSign) + '</p>' +
        }
    }

    $('#do-search').click(function (event) {
        event.preventDefault();
        getInfo(); //API request
    });

})();

