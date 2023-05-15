
var current_weather_data_daily;
var current_weather_data_hourly;
var day = 0;
var lat;
var lon;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        lat = latitude;
        lon = longitude;
        /*setTimeout(() => {
            popolateFields(latitude, longitude);
        }, 3000);*/
        getData();
        //popolateFields(latitude, longitude);

    });
}

setTimeout(() => {
    if(lat || lon){
        return;
    }
    //document.querySelector("#loading_circle").classList.remove("rotation");
    //document.querySelector("#loading_circle").style.display = "none";
    document.querySelector("#user_invite_to_action").style.opacity = "1";
    //document.querySelector("#user_invite_to_action").style.opacity = "1";

}, 2000);

document.getElementById("search_icon").addEventListener("click", () => {
    getLocationFromApi();
})

document.addEventListener('keyup', (event) => {
    const keyName = event.key;
    if(keyName != "Enter"){
        return;
    }
    day = 0;
    document.querySelector("#day").innerHTML = "Oggi";
    document.querySelector("#next_arrow").style.opacity = "1";
    document.querySelector("#next_arrow").style.pointerEvents = "initial";
    document.querySelector("#back_arrow").style.opacity = "0";
    document.querySelector("#back_arrow").style.pointerEvents = "none";
    getLocationFromApi();
});

function getLocationFromApi(){

    fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + document.querySelector("#searchbar input").value + '&count=1&language=it&format=json')
        .then(response => response.json())
        .then(data => {
            document.querySelector("#user_invite_to_action").style.opacity = "0";

            document.querySelector("#searchbar input").value = data["results"][0]["name"];

            document.querySelector("#weather").classList.add("fadeOut");
            document.querySelector("#current_day_info").classList.add("fadeOut");
            document.querySelector("#more_info").classList.add("fadeOut");

            //document.querySelector("#weather").style.opacity = "0";
            //document.querySelector("#current_day_info").style.opacity = "0";
            //document.querySelector("#more_info").style.opacity = "0";

            document.querySelector("#loading_circle").classList.add("rotation");
            document.querySelector("#loading_circle").style.display = "block";
            document.querySelector("#user_invite_to_action").style.opacity = "1";


            let latitude = data["results"][0]["latitude"];
            let longitude = data["results"][0]["longitude"];
            lat = latitude;
            lon = longitude;
            getData();

            /*setTimeout(() => {
                popolateFields(latitude, longitude);
            }, 200)
*/
            
        });

}

function loadImage(weather_code){
    let src_weather_img = "";
    switch(weather_code){
        case 0:
            src_weather_img = "./img/cute hand drawn/sun.png";

            document.querySelector("#bg").classList.remove(...document.body.classList);
            document.querySelector("#bg").classList.add("sole_bg");

            //document.querySelector("#ellipse_1").setAttribute("src", src_weather_img);
            //document.querySelector("#ellipse_2").setAttribute("src", src_weather_img);

            // sun
            break;
        case 1: case 2: case 3:
            // cloudy, partly clear
            src_weather_img = "./img/cute hand drawn/partly_clear.png";

            document.querySelector("#bg").classList.remove(...document.body.classList);
            document.querySelector("#bg").classList.add("parz_nuvoloso_bg");

            //document.querySelector("#ellipse_1").setAttribute("src", "./img/cute hand drawn/sun.png");
            //document.querySelector("#ellipse_2").setAttribute("src", "./img/cute hand drawn/cloud_1.png");

            break;
        case 45: case 48:
            src_weather_img = "./img/fog.png";
            // foggy
            break;
        case 51: case 53: case 55: case 56: case 57: case 61: case 63: case 65: case 66: case 67:
            src_weather_img = "./img/cute hand drawn/rain.png";

            document.querySelector("#bg").classList.remove(...document.body.classList);
            document.querySelector("#bg").classList.add("pioggia_bg");

            //document.querySelector("#ellipse_1").setAttribute("src", src_weather_img);
            //document.querySelector("#ellipse_2").setAttribute("src", src_weather_img);

            // light rain
            break;
        case 71: case 73: case 75: case 85: case 86:
            src_weather_img = "./img/cute hand drawn/snow.png";

            document.querySelector("#bg").classList.remove(...document.body.classList);
            document.querySelector("#bg").classList.add("neve_bg");

            //document.querySelector("#ellipse_1").setAttribute("src", src_weather_img);
            //document.querySelector("#ellipse_2").setAttribute("src", src_weather_img);

            // snow
            break;
        case 77:
            // snow grains:
            break;
        case 80: case 81: case 82:
            src_weather_img = "./img/cute hand drawn/rain.png";

            document.querySelector("#bg").classList.remove(...document.body.classList);
            document.querySelector("#bg").classList.add("pioggia_bg");

            //document.querySelector("#ellipse_1").setAttribute("src", src_weather_img);
            //document.querySelector("#ellipse_2").setAttribute("src", src_weather_img);

            // heavier rain
            break;
        case 95: case 96: case 99:
            src_weather_img = "./img/cute hand drawn/thunder.png";

            document.querySelector("#bg").classList.remove(...document.body.classList);
            document.querySelector("#bg").classList.add("temporale_bg");

            //document.querySelector("#ellipse_1").setAttribute("src", src_weather_img);
            //document.querySelector("#ellipse_2").setAttribute("src", src_weather_img);
            
            // thunderstorm
            break;
        default:
            break;
    }

    document.querySelector("#weather").setAttribute("src",src_weather_img);

    document.querySelector("#loading_circle").classList.remove("rotation");
    document.querySelector("#loading_circle").style.display = "none";

    document.querySelector("#weather").classList.remove("fadeOut");
    document.querySelector("#current_day_info").classList.remove("fadeOut");
    document.querySelector("#more_info").classList.remove("fadeOut");

    document.querySelector("#weather").classList.add("fadeIn");
    document.querySelector("#current_day_info").classList.add("fadeIn");
    document.querySelector("#more_info").classList.add("fadeIn");

    document.querySelector("#user_invite_to_action").style.opacity = "0";


}

function addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
}

function getData(){

    let start_date = new Date().toJSON().slice(0, 10);
    let end_date = new Date();
    end_date.setDate(end_date.getDate() + 7);
    end_date = end_date.toJSON().slice(0, 10);
    //console.log(start_date, end_date);
    fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=Europe%2FBerlin')
        .then(response => response.json())
        .then(data => {
            current_weather_data_daily = data;           
            fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&hourly=temperature_2m,weathercode&start_date=' + start_date +'&end_date=' + end_date + '&timezone=auto')
            .then(response => response.json())
            .then(data => {
                current_weather_data_hourly = data;   
                popolateFields();
            });
        });
}


function getWeatherSrc(weatherCode){
    let src_weather_img = "";
    switch(weatherCode){
        case 0:
            src_weather_img = "./img/cute hand drawn/sun.png";
            // sun
            break;
        case 1: case 2: case 3:
            // cloudy, partly clear
            src_weather_img = "./img/cute hand drawn/partly_clear.png";
            break;
        case 45: case 48:
            src_weather_img = "./img/fog.png";
            // foggy
            break;
        case 51: case 53: case 55: case 56: case 57: case 61: case 63: case 65: case 66: case 67:
            src_weather_img = "./img/cute hand drawn/rain.png";
            // light rain
            break;
        case 71: case 73: case 75: case 85: case 86:
            src_weather_img = "./img/cute hand drawn/snow.png";
            // snow
            break;
        case 77:
            // snow grains:
            break;
        case 80: case 81: case 82:
            src_weather_img = "./img/cute hand drawn/rain.png";
            // heavier rain
            break;
        case 95: case 96: case 99:
            src_weather_img = "./img/cute hand drawn/thunder.png";            
            // thunderstorm
            break;
        default:
            break;
    }

    return src_weather_img;
}


function popolateFields(latitude, longitude){
    console.log("day: " + day);
    if(day == 0){
        let currentDate = new Date().toJSON().slice(0, 10);
        let d = new Date();
        currentDate += "T" + addZero(d.getHours()) + ":00";
        //console.log(currentDate, current_weather_data_hourly["hourly"]["time"]);
        let index = current_weather_data_hourly["hourly"]["time"].indexOf(currentDate);
        //console.log(currentDate, index, current_weather_data_hourly);

        document.querySelector("#degree").innerHTML = current_weather_data_hourly["hourly"]["temperature_2m"][index].toFixed(1) + "°C";

        // https://open-meteo.com/en/docs

        let weather_code = current_weather_data_hourly["hourly"]["weathercode"][index];
        
        document.querySelector("#more_info").innerHTML = "";
        let divs = [];
        for(let i = index + 1; i < 24; i++){
            divs.push(document.createElement("div"));
            let img = document.createElement("img");
            img.setAttribute("src", getWeatherSrc(current_weather_data_hourly["hourly"]["weathercode"][i]));
            
            let span_degrees = document.createElement("span")
            span_degrees.innerHTML = current_weather_data_hourly["hourly"]["temperature_2m"][i] + "°C";

            let span_hour = document.createElement("span");
            let indexT = current_weather_data_hourly["hourly"]["time"][i].indexOf("T") + 1;
            //console.log(indexT);
            span_hour.innerHTML = current_weather_data_hourly["hourly"]["time"][i].substring(indexT, current_weather_data_hourly["hourly"]["time"][i].length);

            divs[i - (index + 1)].classList.add("days_after");
            divs[i - (index + 1)].append(img);
            divs[i - (index + 1)].append(span_degrees);
            divs[i - (index + 1)].append(span_hour);
            document.querySelector("#more_info").append(divs[i - (index + 1)]);
        }
        loadImage(weather_code);
    }else{
        document.querySelector("#degree").innerHTML = ((current_weather_data_daily["daily"]["temperature_2m_max"][day] + current_weather_data_daily["daily"]["temperature_2m_min"][day]) / 2).toFixed(1) + "°C";

        // https://open-meteo.com/en/docs

        let weather_code = current_weather_data_daily["daily"]["weathercode"][day];

        document.querySelector("#more_info").innerHTML = "";

        var date = new Date();
        // add a day
        date.setDate(date.getDate() + day);
        let currentDate = date.toJSON().slice(0, 10);
        currentDate += "T00:00";
        let index = current_weather_data_hourly["hourly"]["time"].indexOf(currentDate);
        //console.log(currentDate, index);
        //console.log(currentDate, index, current_weather_data_hourly["hourly"]["time"]);

        document.querySelector("#more_info").innerHTML = "";
        let divs = [];

        for(let i = index; i < 24 * (day + 1); i++){
            divs.push(document.createElement("div"));
            let img = document.createElement("img");
            img.setAttribute("src", getWeatherSrc(current_weather_data_hourly["hourly"]["weathercode"][i]));
            let span_degrees = document.createElement("span")
            span_degrees.innerHTML = current_weather_data_hourly["hourly"]["temperature_2m"][i] + "°C";

            let span_hour = document.createElement("span");
            let indexT = current_weather_data_hourly["hourly"]["time"][i].indexOf("T") + 1;
            span_hour.innerHTML = current_weather_data_hourly["hourly"]["time"][i].substring(indexT, current_weather_data_hourly["hourly"]["time"][i].length);

            divs[i - index].classList.add("days_after");
            divs[i - index].append(img);
            divs[i - index].append(span_degrees);
            divs[i - index].append(span_hour);
            document.querySelector("#more_info").append(divs[i - index]);
        }
        loadImage(weather_code);
    }
}

document.querySelector("#next_arrow").addEventListener("click", () => {
    day++;
    if(day > 0){
        document.querySelector("#back_arrow").style.opacity = "1";
        document.querySelector("#back_arrow").style.pointerEvents = "initial";
    }
    if(day >= 6){
        document.querySelector("#next_arrow").style.opacity = "0";
        document.querySelector("#next_arrow").style.pointerEvents = "none";
    }
    let currentDate = new Date().toJSON().slice(0, 10);
    if(day == 0){
        document.querySelector("#day").innerHTML = "Oggi";
    }else{
        let d = new Date(current_weather_data_daily["daily"]["time"][day]);
        document.querySelector("#day").innerHTML = d.toLocaleDateString('en-GB');
    }

    document.querySelector("#weather").classList.remove("fadeIn");
    document.querySelector("#current_day_info").classList.remove("fadeIn");
    document.querySelector("#more_info").classList.remove("fadeIn");

    document.querySelector("#weather").classList.add("fadeOut");
    document.querySelector("#current_day_info").classList.add("fadeOut");
    document.querySelector("#more_info").classList.add("fadeOut");

    setTimeout(() => {
        popolateFields(lat, lon);
    }, 200);
})

document.querySelector("#back_arrow").addEventListener("click", () => {
    day--;
    if(day == 0){
        document.querySelector("#back_arrow").style.opacity = "0";
        document.querySelector("#back_arrow").style.pointerEvents = "none";
    }
    if(day < 6){
        document.querySelector("#next_arrow").style.opacity = "1";
        document.querySelector("#next_arrow").style.pointerEvents = "initial";
    }
    let currentDate = new Date().toJSON().slice(0, 10);
    if(day == 0){
        document.querySelector("#day").innerHTML = "Oggi";
    }else{
        let d = new Date(current_weather_data_daily["daily"]["time"][day]);
        document.querySelector("#day").innerHTML = d.toLocaleDateString('en-GB');
    }

    document.querySelector("#weather").classList.remove("fadeIn");
    document.querySelector("#current_day_info").classList.remove("fadeIn");
    document.querySelector("#more_info").classList.remove("fadeIn");

    document.querySelector("#weather").classList.add("fadeOut");
    document.querySelector("#current_day_info").classList.add("fadeOut");
    document.querySelector("#more_info").classList.add("fadeOut");

    setTimeout(() => {
        popolateFields(lat, lon);
    }, 200);
})

document.querySelector("#credits_section").addEventListener("click", () => {

    if(document.querySelector("#credits_section").hasAttribute("open")){
        document.querySelector("#credits_section").classList.remove("credits_section_open");
        //console.log("open");
        //document.querySelector("#credits_section").style.height = "1.5rem";
        //document.querySelector("#credits_section").style.top = "87.5vh";   
        return ;
    }
    document.querySelector("#credits_section").classList.add("credits_section_open");
    //document.querySelector("#credits_section").style.height = "calc(100px - 1%)";
    //document.querySelector("#credits_section").style.top = "91.5vh";    
})