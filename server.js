// server.js

// Import necessary modules
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { fetchWeather, fetchCountries } from "./apiCalls.js"; // API logic in a separate file
import path from "path";
import { fileURLToPath } from "url";
import favicon from "serve-favicon";

// ES module workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS configuration
const whitelist = [
  "http://127.0.0.1",
  "http://127.0.0.1:5500",
  "https://gurgant.github.io",
  "https://weather-app-vanilla-js.onrender.com",
]; // Make both frontend and backend URLs whitelisted

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Serve favicon using serve-favicon middleware
app.use(
  favicon(path.join(__dirname, "backend-assets", "favicon.ico"), (err) => {
    if (err) {
      console.error("Failed to load favicon:", err);
    } else {
      console.log("Favicon loaded successfully.");
    }
  })
);

// Serve static files (including favicon)
app.use(express.static(path.join(__dirname, "backend-assets")));

// In-memory store for blocked IPs
const blockedIPs = new Set();

// Middleware to check if IP is blocked
const checkBlocked = (req, res, next) => {
  const ip = req.ip;
  if (blockedIPs.has(ip)) {
    return res.status(429).json({
      message: "You have been blocked for 15 minutes due to too many requests.",
    });
  }
  next();
};

// Apply the blocked check first
app.use(checkBlocked);

// Initial rate limiter: 1 request per second (60 requests per minute)
const initialLimiter = rateLimit({
  windowMs: 1 * 1000, // 1 second window
  max: 1, // 1 request per second
  standardHeaders: true,
  legacyHeaders: false,
});

// Burst limiter: After 30 requests in 5 minutes, block for 15 minutes
const burstLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // 30 requests
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const ip = req.ip;

    // Add IP to blocked list
    blockedIPs.add(ip);
    console.log(`Rate limit reached for ${ip}, blocking for 15 minutes.`);

    // Set a timeout to remove the IP from blocked list after 15 minutes
    setTimeout(() => {
      blockedIPs.delete(ip);
      console.log(`Unblocked ${ip} after 15 minutes.`);
    }, 15 * 60 * 1000); // 15 minutes

    // Send the "Too many requests" response
    res.status(429).json({
      message: "Too many requests. You have been blocked for 15 minutes.",
    });
  },
});

// Apply the rate limiters
app.use(initialLimiter);
app.use(burstLimiter);

// Example API route for testing (serving HTML with favicon reference)
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Additional API routes
app.get("/countries", fetchCountries);

// API call route directly in server.js (example)
app.get("/fetchWeather", async (req, res) => {
  const { city, country } = req.query;
  if (!city)
    return res.status(400).json({ error: "Please enter a city name." });

  try {
    const data = await fetchWeather(city, country); // Using the imported function
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// CommonJS syntax

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const app = express();
// const port = process.env.PORT || 3000;
// const weatherRouter = require("./weather");

// app.use(express.json());

// app.use(cors());

// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
