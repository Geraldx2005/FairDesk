import express from "express";
import mongoose from "mongoose";
import Employee from "../models/employee_model.js";
import Loan from "../models/Loan.js";
import LoanLog from "../models/LoanLog.js";

const router = express.Router();

/* ===== SHOW LOAN FORM ===== */
router.get("/create", async (req, res) => {
  const employees = await Employee.find({ isActive: true });

  res.render("forms/loan", {
    employees,
    CSS: false,
    JS: false,
    title: "Loan",
    navigator: "loan",
    notification: req.flash("notification"),
    error: req.flash("error"),
  });
});

/* ===== ADD / UPDATE LOAN ===== */
router.post("/create", async (req, res) => {
  try {
    const { employeeId, loanAmount } = req.body;
    const amount = Number(loanAmount) || 0;

    if (!employeeId || amount <= 0) {
      req.flash("error", "Invalid loan amount");
      return res.redirect("back");
    }

    const empObjectId = new mongoose.Types.ObjectId(employeeId);

    let loan = await Loan.findOne({ employee: empObjectId });

    // ================= CREATE NEW LOAN =================
    if (!loan) {
      const newLoan = await Loan.create({
        employee: empObjectId,
        currentBalance: amount,
        emi: 0,
        status: "ACTIVE",
      });

      // ✅ LOG ENTRY (CREDIT)
      await LoanLog.create({
        employee: empObjectId,
        loan: newLoan._id,
        openingBalance: 0,
        amount: amount,
        closingBalance: amount,
        type: "CREDIT",
        source: "MANUAL",
      });

    } 
    // ================= UPDATE EXISTING LOAN =================
    else {
      const openingBalance = loan.currentBalance;
      const closingBalance = openingBalance + amount;

      loan.currentBalance = closingBalance;
      loan.status = "ACTIVE";
      await loan.save();

      // ✅ LOG ENTRY (CREDIT)
      await LoanLog.create({
        employee: empObjectId,
        loan: loan._id,
        openingBalance,
        amount,
        closingBalance,
        type: "CREDIT",
        source: "MANUAL",
      });
    }

    req.flash("notification", "Loan saved successfully");
    res.redirect("/fairdesk/loan/create");

  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to save loan");
    res.redirect("back");
  }
});

/* ================= LOAN DISPLAY ================= */
router.get("/view", async (req, res) => {
  const loans = await Loan.find()
    .populate("employee", "empName empId")
    .sort({ updatedAt: -1 })
    .lean();

  const jsonData = loans.map(l => ({
    employeeName: l.employee?.empName || "-",
    empId: l.employee?.empId || "-",
    currentBalance: l.currentBalance,
    emi: l.emi || 0,
    status: l.status,
    updatedAt: new Date(l.updatedAt).toLocaleDateString(),
  }));

  res.render("display/loanDisp", {
    jsonData,
    title: "Loan View",
    CSS: false,
    JS: false,
    navigator: "loan",
  });
});


export default router;
