import express from "express";
import mongoose from "mongoose";
import Tape from "../../models/Tape.js";
import TapeStock from "../../models/TapeStock.js";
import TapeStockLog from "../../models/TapeStockLog.js";

const router = express.Router();

/* ================= RENDER ================= */
router.get("/", (req, res) => {
  res.render("stock/tapeStock", { title: "Tape Stock", CSS: false, JS: false, notification: req.flash("notification") });
});

/* ================= RESOLVE TAPE ================= */
/* ================= RESOLVE TAPE ================= */
router.post("/resolve", async (req, res) => {
  try {
    const {
      paperCode,
      gsm,
      paperType,
      width,
      mtrs,
      coreId,
      finish, // coming from UI
    } = req.body;

    console.log("Resolve request 👉", req.body);

    const tape = await Tape.findOne({
      tapePaperCode: paperCode?.trim(),
      tapeGsm: Number(gsm),
      tapePaperType: paperType?.trim(),
      tapeWidth: Number(width),
      tapeMtrs: Number(mtrs),
      tapeCoreId: Number(coreId),
      tapeFinish: finish, // ✅ SCHEMA FIELD
    }).lean();

    if (!tape) {
      return res.json({ found: false });
    }

    return res.json({
      found: true,
      tapeId: tape._id.toString(),
      TapeProductId: tape.tapeProductId,
    });

  } catch (err) {
    console.error("Resolve error ❌", err);
    return res.json({ found: false });
  }
});



/* ================= BALANCE ================= */
router.get("/balance/:tapeId/:location", async (req, res) => {
  const { tapeId, location } = req.params;

  const bal = await TapeStock.aggregate([
    { $match: { tape: new mongoose.Types.ObjectId(tapeId), location } },
    { $group: { _id: null, qty: { $sum: "$quantity" } } },
  ]);

  res.json({ stock: bal[0]?.qty || 0 });
});

/* ================= CREATE ================= */
/* ================= CREATE (INWARD ONLY) ================= */
router.post("/create", async (req, res) => {
  try {
    console.log("🟢 HIT TAPE STOCK CREATE ROUTE");
    console.log(req.body);

    const { tapeId, location, quantity, remarks } = req.body;
    const qty = Number(quantity);

    if (!tapeId || !location || qty <= 0) {
      req.flash("error", "Invalid stock entry");
      return res.redirect("back");
    }

    const tapeObjectId = new mongoose.Types.ObjectId(tapeId);

    /* ================= CURRENT STOCK ================= */
    const bal = await TapeStock.aggregate([
      { $match: { tape: tapeObjectId, location } },
      { $group: { _id: null, qty: { $sum: "$quantity" } } },
    ]);

    const openingStock = bal[0]?.qty || 0;
    const closingStock = openingStock + qty;

    /* ================= INSERT STOCK ================= */
    await TapeStock.create({
      tape: tapeObjectId,
      location,
      quantity: qty, // INWARD
      remarks,
    });

    /* ================= LOG ENTRY ================= */
    await TapeStockLog.create({
      tape: tapeObjectId,
      location,
      openingStock,
      quantity: qty,
      closingStock,
      type: "INWARD",
      source: "MANUAL",
      remarks,
      createdBy: req.user?.username || "SYSTEM",
    });

    req.flash("success", "Tape stock added successfully");
    res.redirect("/fairdesk/tapestock");

  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to add tape stock");
    res.redirect("back");
  }
});




export default router;
