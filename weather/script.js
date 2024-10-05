// script.js

const cityInput = document.getElementById("city");
const countryInput = document.getElementById("country-input");
const countrySuggestions = document.getElementById("country-suggestions");
const searchButton = document.getElementById("search-button");
const weatherInfo = document.getElementById("weather-info");
const errorMessage = document.getElementById("error-message");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const weatherIcon = document.getElementById("weatherIcon");
const weatherDescription = document.getElementById("weatherDescription");

let countriesData = []; // Store fetched countries

const isProduction = !(
  window.location.hostname.includes("localhost") ||
  window.location.hostname.includes("127.0.0.1")
);
const apiUrl = isProduction
  ? "https://your-backend-url.onrender.com" // Production backend URL
  : "http://localhost:3000"; // Local development backend URL

document.addEventListener("DOMContentLoaded", () => {
  fetchCountries();
});

// Fetch countries and store them
async function fetchCountries() {
  try {
    const response = await fetch(`${apiUrl}/countries`);

    if (!response.ok) {
      throw new Error("Error fetching country list");
    }

    const countries = await response.json();
    countriesData = countries; // Store countries data globally
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
}

// Handle country input for autocomplete
function handleCountryInput(event) {
  const query = countryInput.value.toLowerCase();
  countrySuggestions.innerHTML = "";

  if (!query) {
    countrySuggestions.style.display = "none";
    countryInput.removeAttribute("data-value"); // Clear selected country code
    return;
  }

  // Filter countries that start with the query
  let matchedCountries = countriesData.filter((country) =>
    country.name.toLowerCase().startsWith(query)
  );

  // Filter countries that contain the query but don't start with it
  let otherCountries = countriesData.filter(
    (country) =>
      !country.name.toLowerCase().startsWith(query) &&
      country.name.toLowerCase().includes(query)
  );

  // Sort matched countries
  matchedCountries.sort((a, b) => a.name.localeCompare(b.name));
  otherCountries.sort((a, b) => a.name.localeCompare(b.name));

  // Create suggestion items for matched countries
  matchedCountries.forEach((country) => {
    const suggestionItem = document.createElement("li");
    // Highlight the matching part
    const boldText = `<strong>${country.name.substr(
      0,
      query.length
    )}</strong>${country.name.substr(query.length)}`;
    suggestionItem.innerHTML = boldText;
    suggestionItem.setAttribute("data-code", country.code);
    suggestionItem.classList.add("matched-country");
    suggestionItem.addEventListener("click", () => {
      selectCountry(country);
    });
    countrySuggestions.appendChild(suggestionItem);
  });

  // Create suggestion items for other countries
  otherCountries.forEach((country) => {
    const suggestionItem = document.createElement("li");
    // Highlight the matching part within the name
    const startIndex = country.name.toLowerCase().indexOf(query);
    const beforeMatch = country.name.substring(0, startIndex);
    const matchText = country.name.substr(startIndex, query.length);
    const afterMatch = country.name.substr(startIndex + query.length);
    const highlightedText = `${beforeMatch}<strong>${matchText}</strong>${afterMatch}`;

    suggestionItem.innerHTML = highlightedText;
    suggestionItem.setAttribute("data-code", country.code);
    suggestionItem.classList.add("other-country");
    suggestionItem.addEventListener("click", () => {
      selectCountry(country);
    });
    countrySuggestions.appendChild(suggestionItem);
  });

  countrySuggestions.style.display = "block";
}

// Function to select a country
function selectCountry(country) {
  countryInput.value = country.name;
  countryInput.setAttribute("data-value", country.code);
  countrySuggestions.innerHTML = "";
  countrySuggestions.style.display = "none";
}

// Event listener for country input
countryInput.addEventListener("input", handleCountryInput);

// Event listener for keydown to handle arrow keys and enter key
let suggestionIndex = -1;

countryInput.addEventListener("keydown", (e) => {
  const suggestions = countrySuggestions.getElementsByTagName("li");
  if (e.key === "ArrowDown") {
    e.preventDefault();
    suggestionIndex++;
    if (suggestionIndex >= suggestions.length) suggestionIndex = 0;
    highlightSuggestion(suggestions, suggestionIndex);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    suggestionIndex--;
    if (suggestionIndex < 0) suggestionIndex = suggestions.length - 1;
    highlightSuggestion(suggestions, suggestionIndex);
  } else if (e.key === "Enter") {
    if (suggestionIndex > -1) {
      e.preventDefault();
      suggestions[suggestionIndex].click();
      suggestionIndex = -1;
    }
  } else if (e.key === "Tab") {
    if (suggestionIndex > -1) {
      suggestions[suggestionIndex].click();
      suggestionIndex = -1;
    }
  } else {
    suggestionIndex = -1;
  }
});

function highlightSuggestion(suggestions, index) {
  for (let i = 0; i < suggestions.length; i++) {
    suggestions[i].classList.remove("highlighted");
  }
  if (suggestions[index]) {
    suggestions[index].classList.add("highlighted");
    // Optionally, you can scroll to the highlighted item if suggestions are scrollable
    suggestions[index].scrollIntoView({ block: "nearest" });
  }
}

// Close suggestions when clicking outside
document.addEventListener("click", (e) => {
  if (e.target !== countryInput) {
    countrySuggestions.innerHTML = "";
    countrySuggestions.style.display = "none";
    suggestionIndex = -1;
  }
});

// Modify getWeather function to get selected country code
async function getWeather() {
  const city = cityInput.value.trim();
  const country = countryInput.getAttribute("data-value"); // Get country code

  if (!city) {
    displayError("Please enter a city name.");
    return;
  }

  if (!country) {
    displayError("Please select a valid country from the suggestions.");
    return;
  }

  const requestUrl = `${apiUrl}/fetchWeather?city=${encodeURIComponent(
    city
  )}&country=${country}`;

  try {
    const response = await fetch(requestUrl);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found. Please check the city name.");
      } else {
        throw new Error(
          "Unable to fetch weather data. Please try again later."
        );
      }
    }

    const data = await response.json();

    updateWeatherInfo(data);
  } catch (error) {
    displayError(error.message);
  }
}

function updateWeatherInfo(data) {
  errorMessage.style.display = "none";
  weatherInfo.style.display = "block";

  cityName.textContent = `${data.name}, ${data.sys.country}`;
  temperature.textContent = `🌡️ ${Math.round(data.main.temp)}°C`;
  humidity.textContent = `💧 ${data.main.humidity}%`;
  windSpeed.textContent = `💨 ${data.wind.speed} m/s`;

  const iconCode = data.weather[0].icon;
  weatherIcon.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIcon.alt = data.weather[0].description;
  weatherDescription.textContent = data.weather[0].description;
}

function displayError(message) {
  weatherInfo.style.display = "none";
  errorMessage.style.display = "block";
  errorMessage.textContent = message;
}

searchButton.addEventListener("click", getWeather);

// Allow pressing 'Enter' to trigger the search when focus is on city input
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getWeather();
  }
});

// Also allow 'Enter' key on country input if suggestions are not open
countryInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && countrySuggestions.style.display === "none") {
    getWeather();
  }
});
