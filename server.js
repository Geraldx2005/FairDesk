import express from "express";
import ejsMate from 'ejs-mate'
import connectDB from "./config/db.js";
import fairdeskRoute from "./routes/fairdesk_route.js";
import AppError from "./utils/AppError.js";
import { configDotenv } from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
const app = express();
const port = 3000;

// Configuring environment variables.
configDotenv({ quiet: true });
// Connecting to the database.
connectDB();

// Getting the current file and directory names.
let file_name = fileURLToPath(import.meta.url);
let dir_name = path.dirname(file_name);

// Setting up the view engine and parsing middleware.
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setting the path for views and static files.
app.set("views", path.join(dir_name, "views"));
app.use(express.static(path.join(dir_name, "public")));
// serving bootstrap.
app.use('/bootstrap', express.static(dir_name + '/node_modules/bootstrap/dist'));


// Setting up the routes.
app.use("/fairdesk", fairdeskRoute);

// Middleware for handling 404 errors - this should be last
app.all("*", (req, res) => {
  console.warn(`404 triggered for ${req.method} ${req.originalUrl}`);
  res.status(404).send("404 - Page Not Found");
});

// Global error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  console.log(err);
  res.status(statusCode).send(message);
});

app.listen(port, () => {
  console.log(`server started at port: ${port}`);
});