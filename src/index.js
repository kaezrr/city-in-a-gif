async function getGIF(condition) {
    console.log(condition);
    let response = await fetch(
        `https://api.giphy.com/v1/gifs/translate?api_key=I7SjYdeut9sz1L6tY8CRAdZDQSuhxIjh&s=${condition}`
    );
    let gifData = await response.json();
    return gifData.data.images.original.url;
}

async function processWeatherJSON(data) {
    let processedData = {
        datetime: new Date(data.currentConditions.datetimeEpoch),
        description: data.description,
        currentTemp: data.currentConditions.temp,
        condition: data.currentConditions.conditions,
        nextWeek: [],
        displayUrl: await getGIF(data.currentConditions.conditions),
    };

    for (let i = 1; i <= 7; i++) {
        const day = data.days[i];
        processedData.nextWeek.push({
            datetime: day.datetime,
            condition: day.conditions,
            temp: day.temp,
            feelslike: day.feelslike,
            humidity: day.humidity,
        });
    }
    return processedData;
}

async function getWeather(location) {
    const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=3TCE2PZH6EYSSQWKAPM774TB6`,
        { mode: 'cors' }
    );
    const responseJSON = await response.json();
    return processWeatherJSON(responseJSON);
}
