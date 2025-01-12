async function getGIF(condition) {
    let response = await fetch(
        `https://api.giphy.com/v1/gifs/translate?api_key=I7SjYdeut9sz1L6tY8CRAdZDQSuhxIjh&s=${condition}`,
        { mode: 'cors' }
    );
    let gifData = await response.json();
    return gifData.data.images.original.url;
}

async function processWeatherJSON(data) {
    let processedData = {
        address: data.resolvedAddress,
        datetime: new Date(data.currentConditions.datetimeEpoch * 1000),
        description: data.description,
        currentTemp: data.currentConditions.temp,
        condition: data.currentConditions.conditions,
        nextWeek: [],
        displayUrl: await getGIF(data.currentConditions.conditions),
    };

    for (let i = 1; i <= 7; i++) {
        const day = data.days[i];
        processedData.nextWeek.push([
            day.datetime,
            day.conditions,
            day.temp,
            day.feelslike,
            day.humidity,
        ]);
    }
    return processedData;
}

export async function getWeather(location, unit) {
    const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=3TCE2PZH6EYSSQWKAPM774TB6&unitGroup=${unit}`,
        { mode: 'cors' }
    );
    if (response.status === 400) {
        alert('City not found!');
        return {};
    }
    const responseJSON = await response.json();
    return processWeatherJSON(responseJSON);
}
