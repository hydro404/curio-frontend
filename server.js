const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const routes = require("./routes");  // Assuming routes is an Express router
const cookieParser = require('cookie-parser');

app.use(cookieParser());  

// Middlewares
app.use(express.json());  // For parsing application/json
app.use(express.static(path.join(__dirname, "public")));  // Serve static files
app.use(cors());

// View engine setup
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");

// Routes
app.use("/", routes);  // Use the router for all routes if 'routes' is a configured Express router

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).send('Page not found!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Assuming routes.js exports a function or an Express router setup
// For example:
// const router = require('express').Router();
// router.get('/', (req, res) => res.render('index'));
// router.get('/products', (req, res) => res.render('products'));
// module.exports = router;
