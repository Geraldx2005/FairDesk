import express from "express";
import Tape from "../models/tape.js";
import TapeBinding from "../models/tapeBinding.js";
import Client from "../models/client.js";
import Username from "../models/username.js";

const router = express.Router();

/* ================= GET : Load Tape Binding Form ================= */
router.get("/form/tape-binding", async (req, res) => {
  try {
    const clients = await Client.distinct("clientName");

    // Specs from Tape Master (single source of truth)
    const paperCodes = await Tape.distinct("tapePaperCode", { status: "ACTIVE" });
    const paperTypes = await Tape.distinct("tapePaperType", { status: "ACTIVE" });
    const gsms = await Tape.distinct("tapeGsm", { status: "ACTIVE" });
    const widths = await Tape.distinct("tapeWidth", { status: "ACTIVE" });
    const mtrsList = await Tape.distinct("tapeMtrs", { status: "ACTIVE" });

    res.render("forms/tapeBinding.ejs", {
      title: "Client Tape",
      clients,
      CSS: false,
      JS: false,
      notification: req.flash("notification"),
      paperCodes,
      paperTypes,
      gsms,
      widths,
      mtrsList,
    });
  } catch (err) {
    console.error(err);
    req.flash("notification", "Failed to load Tape Binding");
    res.redirect("back");
  }
});

/* ================= POST : Save Tape Binding ================= */
router.post("/form/tape-binding", async (req, res) => {
  try {
    if (!req.body.tapeId) {
      req.flash("notification", "Please select valid tape specifications.");
      return res.redirect("back");
    }

    if (Array.isArray(req.body.tapeId)) {
      req.body.tapeId = req.body.tapeId.at(-1);
    }

    if (!req.body.userName) {
      req.flash("notification", "User name not resolved. Please reselect user.");
      return res.redirect("back");
    }

    const payload = {
      tapeId: req.body.tapeId,
      tapeProductId: req.body.tapeProductId,

      clientName: req.body.clientName,
      userName: req.body.userName,
      userContact: req.body.userContact,
      location: req.body.location,

      tapePaperCode: req.body.tapePaperCode,
      tapePaperType: req.body.tapePaperType,
      tapeGsm: Number(req.body.tapeGsm),
      tapeWidth: Number(req.body.tapeWidth),
      tapeMtrs: Number(req.body.tapeMtrs),
      tapeCoreId: Number(req.body.tapeCoreId),
      tapeFinish: req.body.tapeFinish,

      tapeClientPaperCode: req.body.tapeClientPaperCode,
      clientTapeGsm: Number(req.body.clientTapeGsm),

      tapeMtrsDel: Number(req.body.tapeMtrsDel),
      tapeRatePerRoll: Number(req.body.tapeRatePerRoll),
      tapeSaleCost: Number(req.body.tapeSaleCost),

      tapeMinQty: Number(req.body.tapeMinQty),
      tapeOdrQty: Number(req.body.tapeOdrQty),
      tapeOdrFreq: req.body.tapeOdrFreq,
      tapeCreditTerm: req.body.tapeCreditTerm,
    };

    const binding = await TapeBinding.create(payload);

    await Username.findByIdAndUpdate(
      req.body.userId,
      { $addToSet: { tape: binding._id } }
    );

    req.flash("notification", "Tape binding saved successfully!");
    res.redirect("/fairdesk/form/tape-binding");
  } catch (err) {
    console.error(err);
    req.flash("notification", "Failed to save Tape Binding");
    res.redirect("back");
  }
});


/* ================= GET : Fetch Users by Client (AJAX) ================= */
router.get("/form/tape-binding/client/:name", async (req, res) => {
  try {
    const clientData = await Client
      .findOne({ clientName: req.params.name })
      .populate("users");

    res.status(200).json(clientData);
  } catch (err) {
    console.error(err);
    res.status(500).json(null);
  }
});

/* ================= GET : Resolve Tape from Specifications ================= */
router.get("/form/tape-binding/resolve-tape", async (req, res) => {
  try {
    const {
      tapePaperCode,
      tapePaperType,
      tapeGsm,
      tapeWidth,
      tapeMtrs,
      tapeCoreId,
      finish,
    } = req.query;

    if (
      !tapePaperCode ||
      !tapePaperType ||
      !tapeGsm ||
      !tapeWidth ||
      !tapeMtrs ||
      !tapeCoreId ||
      !finish
    ) {
      return res.status(400).json(null);
    }

    const tape = await Tape.findOne({
      tapePaperCode,
      tapePaperType,
      tapeGsm: Number(tapeGsm),
      tapeWidth: Number(tapeWidth),
      tapeMtrs: Number(tapeMtrs),
      tapeCoreId: Number(tapeCoreId),
      tapeFinish: finish,
      status: "ACTIVE",
    });

    if (!tape) {
      return res.status(404).json(null);
    }

    res.status(200).json({
      tapeId: tape._id,
      tapeProductId: tape.tapeProductId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(null);
  }
});

/* ================= GET : Display Bound Tapes ================= */
router.get("/disp/tapebind/:id", async (req, res) => {
  try {
    const userData = await Username
      .findById(req.params.id)
      .populate("tape");

    res.render("display/tapeDisp.ejs", {
      jsonData: userData?.tape || [],
      CSS: false,
      JS: false,
      title: "Tape Display",
      notification: req.flash("notification"),
    });
  } catch (err) {
    console.error(err);
    res.redirect("back");
  }
});

export default router;
