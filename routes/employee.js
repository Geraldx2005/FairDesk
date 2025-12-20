import express from "express";
import mongoose from "mongoose";
import Employee from "../models/employee_model.js";
import multer from "multer";
import path from "path";
const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "employeeImages");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// Allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only images allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// ----------------------------------Employee Master---------------------------------->
// route for rendering employee form.
router.get("/create", async (req, res) => {
  let employeeCount = (await Employee.countDocuments()) + 1;
  res.render("forms/employee.ejs", {
    CSS: false,
    title: "Employee Details",
    JS: false,
    employeeCount,
    notification: req.flash("notification"),
  });
});

// route for rendering employee display.
router.get("/view", async (req, res) => {
  
  let jsonData = await Employee.find();

  res.render("display/employeeDisp.ejs", {
    jsonData,
    CSS: false,
    title: "Employee View",
    JS: false,
    notification: req.flash("notification"),
  });
});

// Route to handle employee form submission.
router.post(
  "/form",
  upload.single("empPhoto"), // ⬅️ input name
  async (req, res) => {
    try {
      const employeeData = {
        ...req.body,
        empPhoto: req.file ? req.file.filename : null, // save filename
      };

      await Employee.create(employeeData);
      console.log("BODY", req.body);
      console.log("FILE", req.file);

      req.flash("notification", "Employee created successfully!");
      res.redirect("/fairdesk/employee/create");
    } catch (err) {
      console.error(err);
      req.flash("error", "Failed to create employee");
      res.redirect("/fairdesk/employee/create");
    }
  }
);

/* ================= EMPLOYEE DETAILED VIEW ================= */
router.get("/profile/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).lean();
    if (!employee) {
      return res.status(404).send("Employee not found");
    }

    res.render("display/employeeView.ejs", {
      employee,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


/* ================= FETCH EMPLOYEE (JSON) ================= */
router.get("/:id", async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id).lean();
    if (!emp) return res.status(404).json(null);
    res.json(emp);
  } catch (err) {
    res.status(500).json(null);
  }
});

export default router;