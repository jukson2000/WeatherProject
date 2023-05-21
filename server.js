const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");
const myCache = new NodeCache({ checkperiod: 1000 });

const app = express();

const API_KEY = "cd68abbf9d1cfe894b606eab377b4681";
// import library and files
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// let express to use this
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/weather/current", async (req, res) => {
  if (!auth) {
    res.send("You are not logged in");
  } else {
    const city = req.query.city;
    console.log(city);
    if (!city) {
      return res.status(400).json({ message: "Please enter a city!!!" });
    }

    try {
      let cach = myCache.get("current");

      if (cach !== undefined && cach.name === city) {
        const data = cach;
        const temperature = data.main.temp;
        const description = data.weather[0].description;
        const windSpeed = data.wind.speed;
        const windDirection = data.wind.deg;

        console.log("Cach");
        return res.json({
          temperature,
          description,
          windSpeed,
          windDirection,
        });
      } else {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        );

        const data = response.data;
        cach = myCache.set("current", data, 1000);
        cach = myCache.get("current");

        const temperature = data.main.temp;
        const description = data.weather[0].description;
        const windSpeed = data.wind.speed;
        const windDirection = data.wind.deg;

        console.log("API ");
        return res.json({
          temperature,
          description,
          windSpeed,
          windDirection,
        });
      }
    } catch (error) {
      if (error.response.status === 404) {
        res.send("City not found! Please try again!");
      } else {
        return res
          .status(500)
          .json({ message: "There was a mistke in your request!" });
      }
    }
  }
});

app.get("/weather/forecast", async function (req, res) {
  if (!auth) {
    res.send("You are not logged in");
  } else {
    const city = req.query.city;
    console.log(city);
    if (!city) {
      return res.status(400).json({ message: "Please enter a city!!!" });
    }

    try {
      let cach = myCache.get("forecast");

      if (cach !== undefined && cach.city.name === city) {
        const weather = [];
        const data = cach;
        for (let i = 0; i < data.list.length - 1; i += 8) {
          const temperature = data.list[i].main.temp;
          const description = data.list[i].weather[0].description;
          const windSpeed = data.list[i].wind.speed;
          const windDirection = data.list[i].wind.deg;
          const date = data.list[i].dt_txt;

          weather.push({
            temperature,
            description,
            windSpeed,
            windDirection,
            date,
          });
        }
        console.log("Cach");
        res.send(weather);
      } else {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );

        const data = response.data;
        cach = myCache.set("forecast", data, 1000);
        cach = myCache.get("forecast");
        console.log(cach.city.name);

        const weather = [];
        for (let i = 0; i < data.list.length - 1; i += 8) {
          const temperature = data.list[i].main.temp;
          const description = data.list[i].weather[0].description;
          const windSpeed = data.list[i].wind.speed;
          const windDirection = data.list[i].wind.deg;
          const date = data.list[i].dt_txt;

          weather.push({
            temperature,
            description,
            windSpeed,
            windDirection,
            date,
          });
        }
        console.log("API");
        return res.send(weather);
      }
    } catch (error) {
      if (error.response.status === 404) {
        res.send("City not found! Please try again!");
      } else {
        return res
          .status(500)
          .json({ message: "There was a mistke in your request!" });
      }
    }
  }
});

let cityID = 0;

app.get("/weather/history", async (req, res) => {
  if (!auth) {
    res.send("You are not logged in");
  } else {
    const city = req.query.city;
    start = req.query.startDate;
    end = req.query.endDate;
    console.log(city);

    const startDate = Math.round(new Date(start).getTime() / 1000);
    const endDate = Math.round(new Date(end).getTime() / 1000);

    if (!city) {
      return res.status(400).json({ message: "Please enter a city!!!" });
    }

    try {
      let cach = myCache.get("history");

      if (cach !== undefined && cach.cityName === city) {
        const weather = [];
        const data = cach;
        for (let i = 0; i < data.list.length - 1; i += 8) {
          const temperature = data.list[i].main.temp;
          const description = data.list[i].weather[0].description;
          const windSpeed = data.list[i].wind.speed;
          const windDirection = data.list[i].wind.deg;
          const date = data.list[i].dt_txt;

          weather.push({
            temperature,
            description,
            windSpeed,
            windDirection,
            date,
          });
        }
        console.log("Cach");
        res.send(weather);
      } else {
        const response = await axios.get(
          `https://history.openweathermap.org/data/2.5/history/city?q=${city}&type=hour&units=metric&start=${startDate}&end=${endDate}&appid=${API_KEY}`
        );

        const data = response.data;
        data.cityName = city;
        cach = myCache.set("history", data, 1000);
        cach = myCache.get("history");
        cityID = cach.city_id;

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
        console.log("API");
        res.send(weather);
      }
    } catch (error) {
      if (error.response.status === 404) {
        res.send("City not found! Please try again!");
      } else {
        return res
          .status(500)
          .json({ message: "There was a mistke in your request!" });
      }
    }
  }
});

let auth = false;

app.get("/weather/auth", (req, res) => {
  const email = req.query.email;
  const password = req.query.password;
  const user = { email, password };

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === user.email && users[i].password === user.password) {
      auth = true;
      break;
    } else {
      auth = false;
    }
  }
  if (auth) {
    res.send("You are logged in!");
  } else {
    res.send("Wrong credentials");
  }
});

app.listen(3000, () => {
  console.log(`Server listening on port 3000`);
});

const users = [
  { email: "jusuf@mail.com", password: "0000" },
  { email: "steve@mail.com", password: "0000" },
  { email: "emir@mail.com", password: "0000" },
  { email: "john@mail.com", password: "0000" },
  { email: "faris@mail.com", password: "0000" },
  { email: "ajdin@mail.com", password: "0000" },
];
