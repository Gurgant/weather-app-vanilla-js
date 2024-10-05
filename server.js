// Es module syntax is not supported in Node.js by default. To use it, we need to add "type": "module" in package.json

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { fetchWeather, fetchCountries } from "./apiCalls.js"; // API logic in a separate file

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

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

// Initial rate limiter: 1 request per second (60 requests per minute)
const initialLimiter = rateLimit({
  windowMs: 1 * 1000, // 1 second window
  max: 1, // Start with 1 request per second (60 requests per minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Burst limiter: After 30 requests in 5 minutes, block for 15 minutes
const burstLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minute window
  max: 30, // Allow 30 requests in 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    const ip = req.ip;

    // Add IP to blocked list
    blockedIPs.add(ip);
    console.log(`Rate limit reached for ${ip}, blocking for 15 minutes.`);

    // Set a timeout to remove the IP from blocked list after 15 minutes
    setTimeout(() => {
      blockedIPs.delete(ip);
      console.log(`Unblocked ${ip} after 15 minutes.`);
    }, 15 * 60 * 1000); // 15 minutes in milliseconds

    // Send the "Too many requests" response
    res.status(429).json({
      message: "Too many requests. You have been blocked for 15 minutes.",
    });
  },
});

// Apply the blocked check first
app.use(checkBlocked);

// Apply the rate limiters
app.use(initialLimiter); // Use initial limiter first
app.use(burstLimiter); // Use burst limiter after

// Handle favicon request to avoid 404
app.get("/favicon.ico", (req, res) => res.status(204)); // No Content

app.get("/countries", fetchCountries);

// Example API route for testing
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

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
