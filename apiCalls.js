import fetch from "node-fetch"; // Using node-fetch to make API requests

// Function to fetch weather data
export const fetchWeather = async (city, country) => {
  const API_KEY = process.env.API_KEY;
  const API_URL = process.env.API_URL;

  const apiUrl = `${API_URL}?q=${encodeURIComponent(
    city
  )},${country}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found. Please check the city name.");
      } else {
        throw new Error(
          "Unable to fetch weather data. Please try again later."
        );
      }
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

// Function to fetch countries
export const fetchCountries = async (req, res) => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();

    const countryData = countries.map((country) => ({
      name: country.name.common,
      code: country.cca2.toLowerCase(), // Standardize to lowercase
    }));

    // Sort the countryData alphabetically by name
    countryData.sort((a, b) => a.name.localeCompare(b.name));

    res.json(countryData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching country list" });
  }
};
