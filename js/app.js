//api_key
const api_key = "832308d112a715ea1d8d932b7d786fee";

// window.onload = function () {
//     document.getElementById("tip-box").style.display = "block";
//
// };

//function to fetch api information and set name to display
function NameGrabber() {
    const newName = document.getElementById('citySearch');
    const name = document.getElementById('cityName');
    name.innerHTML = newName.value
    const weatherDayContainer = document.getElementById('days-container')

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${newName.value}&units=metric&appid=${api_key}`)
        .then(response => response.json())
        .then(function (data) {
            weatherDayContainer.innerHTML = "";
            console.log(data);
            //getting current time of day.
            const currentTimeOfDay = new Date(data.list[0].dt * 1000).getHours();
            // console.log(currentTimeOfDay);
            //extracting and setting the inner-html temperature value.
            document.querySelector('#temp_now').innerHTML ="Temperature: "+data.list[0].main.temp +" &degC";
            //extracting and setting the inner-html weather description.
            document.querySelector('#weatherSummary').innerHTML = data.list[0].weather[0].description+".";

            //function call to build div element and add daily name and weather info.
            showDailyTempAndDay(data);
            //function call to change the background image depending on the time of day.
            backgroundImageSwitch(currentTimeOfDay);

        })
        .catch((error) => console.log(error));
}

//function to show temp_label

// function showTempLabel() {
//     const tempLabel = document.getElementById('temp_label');
//     const tempLabelDisplay = tempLabel.style.display;
//     const trigger = document.getElementById('searchButton')
//
//     if (tempLabelDisplay === 'block') {
//         tempLabel.style.display = 'none';
//         trigger.innerHTML = 'Search';
//     }
//     else {
//         tempLabel.style.display = 'block';
//         trigger.innerHTML = 'Search';
//     }
// }


//function to build daily weather info and create divs to place info.
function showDailyTempAndDay(data) {
    const weatherContainer = document.getElementById('days-container');
    const dailyTemperatures = {};

    data.list.forEach(item => {
        const date = new Date(item.dt_txt).toLocaleString('en-US', {weekday: "long"});
        const temperature = item.main.temp;

        if (dailyTemperatures[date]) {
            dailyTemperatures[date].push(temperature);
        } else {
            dailyTemperatures[date] = [temperature];
        }
    });

    // Get 6 dates, including today and the next 5 days
    const dates = Object.keys(dailyTemperatures).slice(0, 6);

    dates.forEach(date => {
        const dayDiv = document.createElement('div');
        const temperature = Math.round(dailyTemperatures[date]
            .reduce((x, y) => x + y) / dailyTemperatures[date].length);
        const weatherIconCode = data.list.find(item => new Date(item.dt_txt).toLocaleString('en-US',
            {weekday: "long"}) === date).weather[0].icon;
        const iconSrc = `https://openweathermap.org/img/w/${weatherIconCode}.png`;
        const iconTag = document.createElement('img');
        iconTag.src = iconSrc;

        const wCon = data.list.find(item => new Date(item.dt_txt).toLocaleString('en-US', {weekday:"long"})===date).weather[0].description;

        dayDiv.innerHTML = `
        <p>${date}</p><br>
        <p>${temperature}&deg;C</p><br>
        <img src="${iconSrc}" alt="Weather Icon"><br>
        <p>${wCon}</p>`;

        weatherContainer.appendChild(dayDiv);
    });
}


// function to switch the background image depending on the time of day
function backgroundImageSwitch(currentTimeOfDay) {
    const pageBody = document.querySelector("body");
    if (currentTimeOfDay >= 6 && currentTimeOfDay < 18) {
        pageBody.style.background = "url('../assets/images/day.jpg')"; //day time wallpaper goes here.

    }else{
        pageBody.style.background = "url('../assets/images/night.jpg')"; //nighttime wallpaper goes here.
    }

}
