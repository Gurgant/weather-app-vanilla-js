# 🌦️ Weather Forecast App

Welcome to the **Weather Forecast App**—a responsive, user-friendly application that provides real-time weather information for cities around the globe. Built with modern web technologies, this app delivers accurate weather data and a seamless user experience on both mobile and desktop devices.

## 📋 Table of Contents

- [Demo](#-demo)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Usage](#-usage)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)
- [Acknowledgments](#-acknowledgments)

---

## 🚀 Demo

Check out the live application: [Weather Forecast App Live Demo](https://your-app-name.onrender.com)

_Note: Replace the URL with your actual deployed app link once available._

---

## ✨ Features

- **Real-Time Weather Data**: Fetches up-to-date weather information using the OpenWeather API.
- **Global Coverage**: Search for weather details in any city worldwide.
- **Responsive Design**: Optimized for mobile and desktop platforms.
- **Autocomplete Functionality**: Smart country input with autocomplete and highlighted suggestions.
- **Dynamic Weather Icons**: Displays weather conditions with corresponding icons.
- **Detailed Metrics**: Provides temperature, humidity, wind speed, and weather descriptions.
- **Error Handling**: User-friendly messages for invalid inputs or network issues.

---

## 📸 Screenshots

### Mobile View

![Mobile View](/images/mobile-screenshot.png)

### Desktop View

![Desktop View](/images/desktop-screenshot.png)

_Note: Replace the image URLs with actual paths to your screenshots._

---

## 🛠️ Technology Stack

### Frontend

- **HTML5**
- **CSS3**
- **JavaScript (ES6)**
- **Font Awesome** for icons

### Backend

- **Node.js**
- **Express.js**

### APIs & Libraries

- **OpenWeather API** for weather data
- **REST Countries API** for country information

### Deployment & Version Control

- **Render.com** for hosting
- **Git & GitHub** for version control

---

## 🏁 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- **Node.js** (v12 or higher)
- **npm** (comes with Node.js)
- **Git** installed on your machine
- **OpenWeather API Key**: Sign up for a free account at [OpenWeather](https://openweathermap.org/) to obtain an API key.

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/weather-app-vanilla-js.git
   cd weather-app-vanilla-js
   ```

2. **Install Backend Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory with the following content:

   ```env
   API_KEY=your_openweather_api_key
   API_URL=https://api.openweathermap.org/data/2.5/weather
   ```

   Replace `your_openweather_api_key` with your actual OpenWeather API key.

### ▶️ Running the App

#### Starting the Backend Server

```bash
node server.js
```

The backend server will start on [http://localhost:3000](http://localhost:3000).

#### Serving the Frontend

Since the frontend consists of static files, you can open `index.html` directly in your browser or serve it using a static server.

- **Option 1**: Open Directly
  Open `index.html` in your preferred web browser.

- **Option 2**: Use a Static Server

  Install a simple static server globally:

  ```bash
  npm install -g serve
  ```

  Serve the frontend:

  ```bash
  serve
  ```

  The frontend will be available at [http://localhost:5000](http://localhost:5000) (or another port if specified).

---

## 📖 Usage

- **Enter City Name**: In the "Enter city" input field, type the name of the city you want to check the weather for.
- **Select Country**: In the "Enter country" input field, start typing the country name. An autocomplete list will appear; select the appropriate country.
- **Search**: Click the search button or press Enter to fetch the weather data. Weather information will be displayed below, including temperature, humidity, wind speed, and a weather icon.

---

## 🗺️ Roadmap

### Feature Enhancements

- Add 5-day weather forecasts.
- Include sunrise and sunset times.
- Implement user location detection for immediate weather data.

### Technological Upgrades

- Rebuild the app using React.js, Next.js, and Angular for comparison.
- Implement state management with Redux or Context API in the React version.

### UI/UX Improvements

- Dark mode support.
- Animations for weather transitions.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**
2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add some feature"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request**

---

## 📄 License

This project is licensed under the MIT License.

---

## 📬 Contact

Your Name  
Email: your.email@example.com  
GitHub: [your-username](https://github.com/your-username)

Feel free to reach out for any questions or suggestions!

---

## 🙏 Acknowledgments

- OpenWeather for providing the weather data API.
- REST Countries API for the comprehensive country data.
- Font Awesome for the iconography.
- Render.com for hosting services.
- Special thanks to all the open-source contributors whose libraries and tools made this project possible.
