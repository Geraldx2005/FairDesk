import express from "express";
import ejsMate from 'ejs-mate';
import cors from "cors";
import connectDB from "./config/db.js";
import fairdeskRoute from "./routes/fairdesk_route.js";
import payrollRoute from "./routes/payroll.js";
import loanRoute from "./routes/loan.js";
import advanceRoute from "./routes/advance.js";
import AppError from "./utils/AppError.js";
import { configDotenv } from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

import session from "express-session";
import flash from "connect-flash";
const app = express();
const port = 3000;

// Configuring environment variables.
configDotenv({ quiet: true });
// Connecting to the database.
connectDB();

app.use(cors());

app.use(session({
    secret: "yoursecretkey",
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

// Make flash messages available to all views & layouts
app.use((req, res, next) => {
  res.locals.notification = req.flash("notification");
  res.locals.error = req.flash("error");
  next();
});

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
app.use("/fairdesk/payroll", payrollRoute);
app.use("/fairdesk/loan", loanRoute)
app.use("/fairdesk/advance", advanceRoute)

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

// IP Address: "192.168.10.119", -----! put this before the port below
app.listen(port, () => {
  console.log(`server started at port: ${port}`);
});