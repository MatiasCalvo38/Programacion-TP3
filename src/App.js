import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = 'acf164fb8033204e9eae907c95791d4c';

const iconMapping = {
  clear: 'clear-day.svg',
  clouds: 'cloudy.svg',
  drizzle: 'drizzle.svg',
  rain: 'rain.svg',
  snow: 'snow.svg',
  mist: 'mist.svg',
  fog: 'fog.svg',
  smoke: 'smoke.svg',
  haze: 'haze.svg',
  dust: 'dust.svg',
  sand: 'sand.svg',
  ash: 'ash.svg',
  squall: 'squall.svg',
  tornado: 'tornado.svg',
  thunderstorm: 'thunderstorms.svg',
};

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);

  /*const { name, main: { temp, temp_min, temp_max, humidity }, weather } = data;
 
  const tipoDeClima = weather[0].main.toLowerCase();

  const iconNombre = iconMapping[weatherType] || 'clear-day.svg';
  const iconUrl = `./icons/${iconNombre}`;*/

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const response = await axios.get('http://localhost:5000/searches');
    setHistory(response.data);
  };

  const getWeather = async (city) => {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
    setWeather(response.data);

    // Guardar el historial de busqueda
    await axios.post('http://localhost:5000/search', { city });
    fetchHistory();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getWeather(city);
    setCity('');
  };

  const getIcon = (description) => {
    if (!description) return null;
    const key = description.toLowerCase().split(' ')[0]; // Take the first word of the description
    return iconMapping[key] || 'default.svg'; // Return a default icon if no match is found
  };

  return (
    <>
      <h1>Clima en Argentina</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Indica la ciudad..."/>
        <button type="submit">Buscar</button>
      </form>

      {weather && (
        <div>
          <hr></hr>
          <h2>{weather.name}</h2>
          <img src={`./icons/${getIcon(weather.weather[0].description)}`} alt={weather.weather[0].description}/>
          <p>Temperatura: {Math.round(weather.main.temp - 273.15)}°C</p>
          <p>Humedad: {weather.main.humidity}%</p>
        </div>
      )}

      <h2>Historial de Busqueda</h2>
      <ul>
        {history.map((item, index) => (
          <li key={index}>{item.city} - {new Date(item.date).toLocaleString()}</li>
        ))}
      </ul>
    </>
  );
}

export default App;