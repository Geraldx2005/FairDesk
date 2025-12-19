import express from "express";
import Employee from "../models/employee_model.js";
import Payroll from "../models/Payroll.js";
import Loan from "../models/Loan.js";
import LoanLog from "../models/LoanLog.js";
import Advance from "../models/Advance.js";
import AdvanceLog from "../models/AdvanceLog.js";

const router = express.Router();

/* ================= SHOW PAYROLL FORM ================= */
router.get("/create", async (req, res) => {
  const employees = await Employee.find({ isActive: true }).sort({ empName: 1 });

  res.render("forms/payroll", {
    employees,
    CSS: false,
    JS: false,
    title: "Payroll",
    navigator: "payroll",
    notification: req.flash("notification"),
    error: req.flash("error"),
  });
});

/* ================= CREATE PAYROLL ================= */
router.post("/create", async (req, res) => {
  try {
    const {
      employeeId,
      month,
      year,
      presentDays,
      absentDays,
      othrs = 0,
      incentive = 0,
    } = req.body;

    const emiAmount = Math.max(Number(req.body.emi ?? 0), 0);

    /* ================= FETCH EMPLOYEE ================= */
    const emp = await Employee.findById(employeeId);
    if (!emp) {
      req.flash("error", "Employee not found");
      return res.redirect("back");
    }

    /* ================= BLOCK DUPLICATE PAYROLL ================= */
    const exists = await Payroll.findOne({
      employee: employeeId,
      month,
      year,
    });

    if (exists) {
      req.flash(
        "error",
        "Payroll already exists for this employee and month"
      );
      return res.redirect("back");
    }

    /* ================= ADVANCE (FULL DEDUCTION RULE) ================= */
    const advanceRecord = await Advance.findOne({ employee: employeeId });

    let advanceDeduction = 0;

    if (advanceRecord && advanceRecord.currentBalance > 0) {
      const maxAdvanceAllowed = emp.basicSalary * 0.5;

      // FULL deduction (advance itself is already capped at 50%)
      advanceDeduction = Math.min(
        advanceRecord.currentBalance,
        maxAdvanceAllowed
      );
    }

    /* ================= SALARY CALCULATION ================= */
    const totalDays = Number(presentDays) + Number(absentDays);
    const perDaySalary = totalDays ? emp.basicSalary / totalDays : 0;
    const absentAmount = Number(absentDays) * perDaySalary;

    const grossSalary =
      Number(emp.basicSalary) +
      Number(incentive) +
      Number(req.body.empOtAmount || 0);

    const totalDeduction =
      Number(emp.empPF || 0) +
      Number(emp.empESIC || 0) +
      Number(emp.empPT || 0) +
      Number(absentAmount) +
      Number(advanceDeduction) +
      Number(emiAmount);

    // 🔒 Guard: net salary should never be negative
    const netSalary = Math.max(grossSalary - totalDeduction, 0);

    /* ================= SAVE PAYROLL ================= */
    await Payroll.create({
      employee: emp._id,
      month,
      year,
      presentDays,
      absentDays,
      otHours: othrs,
      incentive,
      advance: advanceDeduction,
      grossSalary,
      totalDeduction,
      netSalary,
    });

    /* ================= LOAN EMI (LOGGED) ================= */
    if (emiAmount > 0) {
      const loan = await Loan.findOne({ employee: emp._id });

      if (loan) {
        const openingBalance = loan.currentBalance;
        const closingBalance = Math.max(openingBalance - emiAmount, 0);

        loan.currentBalance = closingBalance;
        loan.status = closingBalance === 0 ? "CLOSED" : "ACTIVE";
        await loan.save();

        await LoanLog.create({
          employee: emp._id,
          loan: loan._id,
          openingBalance,
          amount: emiAmount,
          closingBalance,
          type: "DEBIT",
          source: "PAYROLL",
          month,
          year,
        });
      }
    }

    /* ================= ADVANCE (LOGGED) ================= */
    if (advanceDeduction > 0 && advanceRecord) {
      const openingBalance = advanceRecord.currentBalance;
      const closingBalance = openingBalance - advanceDeduction;

      advanceRecord.currentBalance = closingBalance;
      advanceRecord.status = closingBalance === 0 ? "CLOSED" : "ACTIVE";
      await advanceRecord.save();

      await AdvanceLog.create({
        employee: emp._id,
        advance: advanceRecord._id,
        openingBalance,
        amount: advanceDeduction,
        closingBalance,
        type: "DEBIT",
        source: "PAYROLL",
        month,
        year,
      });
    }

    req.flash("notification", "Payroll created successfully");
    res.redirect("/fairdesk/payroll/create");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create payroll");
    res.redirect("back");
  }
});

/* ================= FETCH EMPLOYEE ================= */
router.get("/employee/:id", async (req, res) => {
  const emp = await Employee.findById(req.params.id).lean();
  res.json(emp);
});

/* ================= FETCH LOAN ================= */
router.get("/loan/:employeeId", async (req, res) => {
  const loan = await Loan.findOne({
    employee: req.params.employeeId,
  }).lean();

  res.json(loan || { currentBalance: 0 });
});

/* ================= FETCH ADVANCE ================= */
router.get("/advance/:employeeId", async (req, res) => {
  const advance = await Advance.findOne({
    employee: req.params.employeeId,
  }).lean();

  res.json(advance || { currentBalance: 0 });
});

/* ================= PAYROLL DISPLAY ================= */
router.get("/view", async (req, res) => {
  const payrolls = await Payroll.find()
    .populate("employee", "empName empId basicSalary")
    .sort({ createdAt: -1 })
    .lean();

  const monthMap = {
    1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr",
    5: "May", 6: "Jun", 7: "Jul", 8: "Aug",
    9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec",
  };

  const jsonData = payrolls.map(p => ({
    employeeName: p.employee?.empName || "-",
    empId: p.employee?.empId || "-",
    month: monthMap[p.month],
    year: p.year,
    presentDays: p.presentDays,
    absentDays: p.absentDays,
    otHours: p.otHours,
    basicSalary: p.employee?.basicSalary || 0,
    incentive: p.incentive || 0,
    advance: p.advance || 0,
    grossSalary: p.grossSalary,
    totalDeduction: p.totalDeduction,
    netSalary: p.netSalary,
    createdAt: new Date(p.createdAt).toLocaleDateString(),
  }));

  res.render("display/payrollDisp", {
    jsonData,
    CSS: false,
    JS: false,
    title: "Payroll View",
    navigator: "payroll",
  });
});


export default router;
