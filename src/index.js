import './style.css';
import { getWeather } from './api-data';
import { format } from 'date-fns';

const cityForm = document.querySelector('form');
const location = document.getElementById('location');
const unit = document.getElementById('unit');
const mainBody = document.querySelector('main');

cityForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();
    const data = await getWeather(location.value, unit.value);
    mainBody.classList.toggle('loading');
    if (!data.hasOwnProperty('address')) {
        mainBody.replaceChildren();
        return;
    }
    constructPage(data);
});

const showLoading = () => {
    const loading = document.createElement('h1');
    loading.textContent = 'Loading...';
    mainBody.replaceChildren(loading);
    mainBody.classList.toggle('loading');
};

const createP = (content, id) => {
    const p = document.createElement('p');
    p.id = id;
    p.innerHTML = content;
    return p;
};

const createTh = (content) => {
    const th = document.createElement('th');
    th.textContent = content;
    return th;
};

const createTd = (content) => {
    const td = document.createElement('td');
    td.textContent = content;
    return td;
};

const tempUnit = () => {
    return unit.value === 'us' ? 'F' : 'C';
};

function constructPage(data) {
    const h1 = document.createElement('h1');
    h1.textContent = data.address;
    const img = document.createElement('img');
    img.src = data.displayUrl;
    const div = document.createElement('div');
    div.replaceChildren(
        createP(data.description, 'desc'),
        createP(
            `<strong>Current Time:</strong> ${format(data.datetime, 'eeee HH:mm, dd LLL yyyy')}`,
            'time'
        ),
        createP(
            `<strong>Current Temp:</strong> ${data.currentTemp}&deg;${tempUnit()}`,
            'temp'
        )
    );
    const h2 = document.createElement('h2');
    h2.textContent = 'Weather forecast for the next week:';
    const table = document.createElement('table');
    const thead = document.createElement('tr');
    thead.replaceChildren(
        createTh('Date'),
        createTh('Condition'),
        createTh(`Temp(\u00B0${tempUnit()})`),
        createTh(`Feels Like(\u00B0${tempUnit()})`),
        createTh('Humidity(%)')
    );
    table.appendChild(thead);
    data.nextWeek.forEach((e) => {
        const tr = document.createElement('tr');
        for (let attr of e) {
            tr.appendChild(createTd(attr));
        }
        table.appendChild(tr);
    });
    mainBody.replaceChildren(h1, img, div, h2, table);
}
