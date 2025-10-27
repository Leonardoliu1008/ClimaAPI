document.querySelector('#search').addEventListener('submit', async (event) => {
    event.preventDefault();

    const cityName = document.querySelector('#city_name').value;

    if (!cityName) {
        document.querySelector("#weather").classList.remove('show');
        showAlert('Você precisa digitar uma cidade...');
        return;
    }

    const apiKey = '8a60b2de14f7a17c7a11706b2cfcd87c';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`

    const results = await fetch(apiUrl);
    const json = await results.json();

if (json.cod === 200) {
    showInfo({
        city: json.name,
        country: json.sys.country,
        temp: json.main.temp,
        tempMax: json.main.temp_max,
        tempMin: json.main.temp_min,
        description: json.weather[0].description,
        tempIcon: json.weather[0].icon,
        windSpeed: json.wind.speed,
        humidity: json.main.humidity,
        lat: json.coord.lat,
        lon: json.coord.lon // <-- adicionado
    });
}

     else {
        document.querySelector("#weather").classList.remove('show');
        showAlert(`
            Não foi possível localizar...
        `)
    }
});

function showInfo(json){
    showAlert('');

    document.querySelector("#weather").classList.add('show');

    // script.js

    document.querySelector('#title').innerHTML = `${json.city}, ${json.country}`;
    document.querySelector('#country-flag').setAttribute('src', `https://flagcdn.com/w40/${json.country.toLowerCase()}.png`);

    document.querySelector('#temp_value').innerHTML = `${json.temp.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#temp_description').innerHTML = `${json.description}`;
    document.querySelector('#temp_img').setAttribute('src', `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`)

    document.querySelector('#temp_max').innerHTML = `${json.tempMax.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#temp_min').innerHTML = `${json.tempMin.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#humidity').innerHTML = `${json.humidity}%`;
    document.querySelector('#wind').innerHTML = `${json.windSpeed.toFixed(1)}km/h`;
    showMap(json.lat, json.lon, `${json.city}, ${json.country}`);

}

function showAlert(msg) {
    document.querySelector('#alert').innerHTML = msg;
}

let map;
let marker;

function showMap(lat, lon, city) {
    if (!map) {
        // Cria o mapa pela primeira vez
        map = L.map('map').setView([lat, lon], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    } else {
        // Atualiza a posição do mapa se ele já existir
        map.setView([lat, lon], 11);
        if (marker) marker.remove();
    }

    // Adiciona marcador na cidade
    marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`${city}`)
        .openPopup();
}
