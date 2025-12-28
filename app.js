const express = require('express');
const app = express();

// Serve files from the 'public' folder
app.use(express.static('public'));

const API_KEY = '738856aea9e683b9e65c0b4b75a7517f';

// Our Server-Side Route
app.get('/weather-data', async (req, res) => {
    const city = req.query.city;

    // 1. URLs for the APIs
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const factUrl = `https://uselessfacts.jsph.pl/random.json?language=en`;

    try {
        // 2. Fetching using built-in fetch (no axios!)
        // We fetch weather first
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        // ADD THIS LINE BELOW TO DEBUG:
        console.log("Response from OpenWeather:", weatherData); 

        if (weatherData.cod !== 200) {
            return res.status(404).json({ error: "City not found" });
        }

        // 3. Fetch the Second API (Fact API)
        const factResponse = await fetch(factUrl);
        const factData = await factResponse.json();

        // 4. Organize the data as required by the assignment
        const processedData = {
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            coordinates: `Lat: ${weatherData.coord.lat}, Lon: ${weatherData.coord.lon}`,
            feels_like: weatherData.main.feels_like,
            wind_speed: weatherData.wind.speed,
            country_code: weatherData.sys.country,
            // Assignment asks for rain volume (last 3h)
            rain_volume: weatherData.rain ? (weatherData.rain['3h'] || 0) : 0,
            // Our additional API data
            fact: factData.text 
        };

        // 5. Send the finished JSON back to the HTML page
        res.json(processedData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error occurred" });
    }
});

app.listen(3000, () => {
    console.log("Server started at http://localhost:3000");
});