import express from "express";
import ejsMate from "ejs-mate";
import connectDB from "./config/db.js";
import fairdeskRoute from "./routes/fairdesk_route.js";
import payrollRoute from "./routes/payroll.js";
import loanRoute from "./routes/loan.js";
import advanceRoute from "./routes/advance.js";
import employeeRoute from "./routes/employee.js";
import pettycashRoute from "./routes/pettycash.js";
import { configDotenv } from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

import session from "express-session";
import flash from "connect-flash";

const app = express();
const port = 3000;

/* ================= ENV + DB ================= */
configDotenv({ quiet: true });
connectDB();

/* ================= PATH SETUP ================= */
const file_name = fileURLToPath(import.meta.url);
const dir_name = path.dirname(file_name);

/* ================= VIEW ENGINE ================= */
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(dir_name, "views"));

/* ================= BODY PARSERS ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= STATIC ================= */
app.use(express.static(path.join(dir_name, "public")));
app.use("/bootstrap", express.static(dir_name + "/node_modules/bootstrap/dist"));


app.use("/employeeImages", express.static(path.join(process.cwd(), "employeeImages")));

/* ================= SESSION (THIS IS THE KEY) ================= */
app.use(
  session({
    name: "fairdesk.sid",
    secret: "fairdesk-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,      // localhost
      sameSite: "lax",
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

/* ================= FLASH ================= */
app.use(flash());

/* ================= GLOBAL LOCALS ================= */
app.use((req, res, next) => {
  res.locals.notification = req.session.flash?.notification || [];
  res.locals.error = req.session.flash?.error || [];
  next();
});

/* ================= ROUTES ================= */
app.use("/fairdesk", fairdeskRoute);
app.use("/fairdesk/payroll", payrollRoute);
app.use("/fairdesk/loan", loanRoute);
app.use("/fairdesk/advance", advanceRoute);
app.use("/fairdesk/employee", employeeRoute);
app.use("/fairdesk/pettycash", pettycashRoute);

/* ================= 404 ================= */
app.all("*", (req, res) => {
  res.status(404).send("404 - Page Not Found");
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message || "Something went wrong");
});

/* ================= START ================= */
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
