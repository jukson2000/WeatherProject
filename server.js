const express = require("express");
const axios = require("axios");

const app = express();

const API_KEY = "3fc11c035cb9fc9c68e2b161ba23eb1d";

app.get("/weather/current", async (req, res) => {
  const city = req.query.city;
  console.log(city);
  if (!city) {
    return res.status(400).json({ message: "Please enter a city!!!" });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );
    const temperature = response.data.main.temp;
    const description = response.data.weather[0].description;
    const windSpeed = response.data.wind.speed;
    const windDirection = response.data.wind.deg;

    return res.json({
      temperature,
      description,
      windSpeed,
      windDirection,
    });
  } catch (error) {
    if (error.response.status === 404) {
      res.send("City not found! Please try again!");
    } else {
      return res
        .status(500)
        .json({ message: "There was a mistke in your request!" });
    }
  }
});

app.get("/weather/forecast", async function (req, res) {
  const city = req.query.city;
  console.log(city);
  if (!city) {
    return res.status(400).json({ message: "Please enter a city!!!" });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );

    const weather = [];
    for (let i = 0; i < response.data.list.length - 1; i += 8) {
      const temperature = response.data.list[i].main.temp;
      const description = response.data.list[i].weather[0].description;
      const windSpeed = response.data.list[i].wind.speed;
      const windDirection = response.data.list[i].wind.deg;
      const date = response.data.list[i].dt_txt;

      weather.push({
        temperature,
        description,
        windSpeed,
        windDirection,
        date,
      });
    }

    return res.send(weather);
  } catch (error) {
    if (error.response.status === 404) {
      res.send("City not found! Please try again!");
    } else {
      return res
        .status(500)
        .json({ message: "There was a mistke in your request!" });
    }
  }
});

app.get("/weather/history", async (req, res) => {});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
