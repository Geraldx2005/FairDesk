import express from "express";
import mongoose from "mongoose";
import Employee from "../models/employee_model.js";
import Advance from "../models/Advance.js";
import AdvanceLog from "../models/AdvanceLog.js";

const router = express.Router();

/* ===== SHOW ADVANCE FORM ===== */
router.get("/create", async (req, res) => {
  const employees = await Employee.find({ isActive: true });

  res.render("forms/advance", {
    employees,
    CSS: false,
    JS: false,
    title: "Advance",
    navigator: "advance",
    notification: req.flash("notification"),
    error: req.flash("error"),
  });
});

/* ===== ADD / UPDATE ADVANCE (WITH 50% RULE + LOGS) ===== */
router.post("/create", async (req, res) => {
  try {
    const { employeeId, advanceAmount } = req.body;
    const amount = Number(advanceAmount) || 0;

    if (!employeeId || amount <= 0) {
      req.flash("error", "Invalid advance amount");
      return res.redirect("back");
    }

    const empObjectId = new mongoose.Types.ObjectId(employeeId);

    /* ================= FETCH EMPLOYEE ================= */
    const emp = await Employee.findById(empObjectId);
    if (!emp) {
      req.flash("error", "Employee not found");
      return res.redirect("back");
    }

    /* ================= 50% ADVANCE LIMIT ================= */
    const maxAllowedAdvance = emp.basicSalary * 0.5;

    /* ================= FETCH EXISTING ADVANCE ================= */
    let advance = await Advance.findOne({ employee: empObjectId });
    const currentBalance = advance?.currentBalance || 0;

    /* ================= LIMIT CHECK ================= */
    if (currentBalance + amount > maxAllowedAdvance) {
      req.flash(
        "error",
        `Advance limit exceeded. Max allowed is ₹${maxAllowedAdvance}`
      );
      return res.redirect("back");
    }

    /* ================= CREATE NEW ADVANCE ================= */
    if (!advance) {
      const newAdvance = await Advance.create({
        employee: empObjectId,
        currentBalance: amount,
        status: "ACTIVE",
      });

      await AdvanceLog.create({
        employee: empObjectId,
        advance: newAdvance._id,
        openingBalance: 0,
        amount,
        closingBalance: amount,
        type: "CREDIT",
        source: "MANUAL",
      });
    }
    /* ================= UPDATE EXISTING ADVANCE ================= */
    else {
      const openingBalance = advance.currentBalance;
      const closingBalance = openingBalance + amount;

      advance.currentBalance = closingBalance;
      advance.status = "ACTIVE";
      await advance.save();

      await AdvanceLog.create({
        employee: empObjectId,
        advance: advance._id,
        openingBalance,
        amount,
        closingBalance,
        type: "CREDIT",
        source: "MANUAL",
      });
    }

    req.flash("notification", "Advance saved successfully");
    res.redirect("/fairdesk/advance/create");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to save advance");
    res.redirect("back");
  }
});

/* ================= ADVANCE DISPLAY ================= */
router.get("/view", async (req, res) => {
  const advances = await Advance.find()
    .populate("employee", "empName empId")
    .sort({ updatedAt: -1 })
    .lean();

  const jsonData = advances.map(a => ({
    employeeName: a.employee?.empName || "-",
    empId: a.employee?.empId || "-",
    currentBalance: a.currentBalance,
    status: a.status,
    updatedAt: new Date(a.updatedAt).toLocaleDateString(),
  }));

  res.render("display/advanceDisp", {
    jsonData,
    title: "Advance View",
    CSS: false,
    JS: false,
    navigator: "advance",
  });
});


export default router;
