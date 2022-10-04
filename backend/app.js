require("dotenv").config();

const mongoose = require("mongoose");

const mongodbURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.4nsox.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose
  .connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection to MongoDB succeeded"))
  .catch(() => console.log("Connection to MongoDB failed"));

const express = require("express");

const app = express();

const helmet = require("helmet");
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

app.use(express.json());

const mongoSanitize = require("express-mongo-sanitize");
app.use(mongoSanitize());

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

const userRoutes = require("./routes/user");
app.use("/api/auth", userRoutes);

const sauceRoutes = require("./routes/sauce");
app.use("/api/sauces", sauceRoutes);

const path = require("path");
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
