import express, { json } from "express";
// import asyncHandler from "express-async-handler";
import Client from "../models/users/client.js";
import Username from "../models/users/username.js";
import Label from "../models/inventory/labels.js";
import Ttr from "../models/inventory/ttr.js";
import Tape from "../models/inventory/tape.js";
import SystemId from "../models/system/systemId.js";
import Carelead from "../models/carelead.js";
import Calculator from "../models/utilities/calculator.js";
import Block from "../models/utilities/block_model.js";
import Die from "../models/utilities/die_model.js";
const router = express.Router();

// ----------------------------------RateCalculator---------------------------------->
// Route for rate calculator.

router.get("/form/ratecalculator", async (req, res) => {
  let clients = await Username.distinct("clientName");
  res.render("utilities/rateCalculator.ejs", { clients });
});

// Route to handle rate calculator form submission
router.post("/form/ratecalculator", async (req, res) => {
  let formData = req.body;

  await Order.create(formData);
  res.send("Order created successfully!");
});

// ----------------------------------Client---------------------------------->
// route for client form.
router.get("/form/client", async (req, res) => {
  let clients = await Client.distinct("clientName");
  let userCount = await Username.countDocuments();
  let clientCount = clients.length;
  res.render("users/clientForm.ejs", {
    JS: "clientForm.js",
    CSS: "tabOpt.css",
    title: "Client Form",
    clientCount,
    userCount,
    clients,
    notification: req.flash("notification"),
  });
});

// Route to handle CLIENT form submission
router.post("/form/client", async (req, res) => {
  let formData = req.body;

  await Client.create(formData);

  req.flash("notification", "Client created successfully!");
  res.redirect("/fairdesk/form/client");
});

router.get("/form/client/:name", async (req, res) => {
  let clientData = await Client.findOne({ clientName: req.params.name });
  let clientName = clientData;
  res.status(200).json(clientName);
});

// ----------------------------------Username---------------------------------->
// Route to handle USER form submission
router.post("/form/user", async (req, res) => {
  let { objectId } = req.body;
  let newUser = await Username.create(req.body);
  // console.log(formData.objectId);
  let client = await Client.findOne({ _id: objectId });

  client.users.push(newUser);
  await client.save();

  req.flash("notification", "User created successfully!");
  res.redirect("/fairdesk/form/client");
});

// ----------------------------------Labels---------------------------------->
// route for datasheet form.
router.get("/form/labels", async (req, res) => {
  let clients = await Client.distinct("clientName");
  let labelsCount = (await Label.countDocuments()) + 1;
  console.log(clients);

  res.render("inventory/labels.ejs", {
    title: "Labels",
    JS: "labels.js",
    CSS: false,
    clients,
    labelsCount,
    notification: req.flash("notification"),
  });
});

// Route to handle datasheet form submission.
router.post("/form/labels", async (req, res) => {
  let { userObjId } = req.body;
  let savedLabel = await Label.create(req.body);
  console.log(userObjId);
  let user = await Username.findOne({ _id: userObjId });
  console.log(user);
  user.label.push(savedLabel);
  await user.save();

  req.flash("notification", "Label created successfully!");
  res.redirect("/fairdesk/form/labels");
});

router.get("/form/labels/:name", async (req, res) => {
  let clientData = await Client.findOne({ clientName: req.params.name }).populate("users");
  let clientName = clientData;
  console.log(clientName.users);
  console.log(clientName);
  res.status(200).json(clientName);
});

// ----------------------------------CareLead---------------------------------->
// route for carelead form.
router.get("/form/carelead", (req, res) => {
  res.render("careLead.ejs");
});

// Route to handle carelead form submission.
router.post("/form/carelead", async (req, res) => {
  let formData = req.body;

  await Carelead.create(formData);
  res.send("care lead created successfully!");
});

// ----------------------------------CareCallReport---------------------------------->
// route for carecallreport form.
router.get("/form/carecallreport", (req, res) => {
  res.render("careCallReport.ejs");
});

// Route to handle carecallreport form submission.
router.post("/form/carecallreport", async (req, res) => {
  let formData = req.body;

  await Carelead.create(formData);
  res.send("care call report created successfully!");
});

// ----------------------------------SystemId---------------------------------->
// route for systemid form.
router.get("/form/systemid", async (req, res) => {
  let systemIdCount = await SystemId.countDocuments();
  res.render("systemId.ejs", { systemIdCount });
  res.render("systemId.ejs");
});

// Route to handle systemid form submission.
router.post("/form/systemid", async (req, res) => {
  let formData = req.body;

  await SystemId.create(formData);
  res.send("care call report created successfully!");
});

// ----------------------------------WorkshopReport---------------------------------->
// route for careworkshopreport form.
router.get("/form/careworkshopreport", (req, res) => {
  res.render("careWokshopReport.ejs");
});

// Route to handle careworkshopreport form submission.
router.post("/form/careworkshopreport", async (req, res) => {
  let formData = req.body;

  await Carelead.create(formData);
  res.send("care call report created successfully!");
});

// ----------------------------------CareQuote---------------------------------->
// route for carequote form.
router.get("/form/carequote", (req, res) => {
  res.render("careQuote.ejs");
});

// Route to handle carequote form submission.
router.post("/form/carequote", async (req, res) => {
  let formData = req.body;

  await Carelead.create(formData);
  res.send("care quote created successfully!");
});

// ----------------------------------TTR---------------------------------->
// route for ttr form.
router.get("/form/ttr", async (req, res) => {
  let clients = await Client.distinct("clientName");
  let ttrCount = await Ttr.countDocuments() + 1;
  console.log(ttrCount);

  res.render("inventory/ttr.ejs", {
    JS: "ttr.js",
    CSS: false,
    title: "TTR",
    clients,
    ttrCount,
    notification: req.flash("notification"),
  });
});

// Route to handle ttr form submission.
router.post("/form/ttr", async (req, res) => {
  let { userId } = req.body;
  let ttrData = await Ttr.create(req.body);

  let user = await Username.findOne({ _id: userId });
  user.ttr.push(ttrData);
  await user.save();

  req.flash("notification", "TTR created successfully!");
  res.redirect("/fairdesk/form/ttr");
});

// ----------------------------------Tape---------------------------------->
// route for tape form.
// router.get("/form/tape", async (req, res) => {
//   let clients = await Client.distinct("clientName");
//   let tapeCount = await Tape.countDocuments();

//   res.render("forms/tape.ejs", {
//     JS: "ttr.js",
//     CSS: false,
//     title: "Tape",
//     clients,
//     tapeCount,
//     notification: req.flash("notification"),
//   });
// });

// Route to handle tape form submission.
// router.post("/form/tape", async (req, res) => {
//   let { userId } = req.body;
//   let tapeData = await Tape.create(req.body);

//   let user = await Username.findOne({ _id: userId });
//   user.tape.push(tapeData);
//   await user.save();

//   req.flash("notification", "Tape created successfully!");
//   res.redirect("/fairdesk/form/tape");
// });

// ----------------------------------Tape Master---------------------------------->

// GET: Tape Master form
router.get("/form/tape-master", async (req, res) => {
  const tapeCount = await Tape.countDocuments() + 1;

  res.render("inventory/tape.ejs", {
    JS: false,
    CSS: false,
    title: "Tape Master",
    tapeCount,
    notification: req.flash("notification"),
  });
});

// POST: Tape Master submission
router.post("/form/tape-master", async (req, res) => {
  console.log("TAPE MASTER BODY", req.body);
  try {
    const data = {
      tapeProductId: req.body.tapeProductId,
      tapePaperCode: req.body.tapePaperCode,
      tapeGsm: Number(req.body.tapeGsm),
      tapePaperType: req.body.tapePaperType,
      tapeWidth: Number(req.body.tapeWidth),
      tapeMtrs: Number(req.body.tapeMtrs),
      tapeCoreId: Number(req.body.tapeCoreId),
      tapeAdhesiveGsm: Number(req.body.tapeAdhesiveGsm),
      tapeFinish: req.body.tapeFinish,
      createdBy: req.user?.username || "SYSTEM",
    };

    await Tape.create(data);

    req.flash("notification", "Tape Master created successfully!");
    res.redirect("/fairdesk/form/tape-master");
  } catch (err) {
    console.error(err);
    req.flash("notification", err.message);
    res.redirect("back");
  }
});

// ----------------------------------Sales Order---------------------------------->
// route for salesorder form.
router.get("/form/salesorder", async (req, res) => {
  let clients = await Client.find();
  res.render("utilities/salesOrder.ejs", { clients });
});

// Route to handle salesorder form submission.
router.post("/form/salesorder", async (req, res) => {
  let formData = req.body;

  await Carelead.create(formData);
  res.send("Sales Order created successfully!");
});

// ----------------------------------Sales Calculator---------------------------------->
// route for salescalc form.
router.get("/form/salescalc", async (req, res) => {
  let clients = await Client.distinct("clientName");
  res.render("utilities/salesCalc.ejs", { clients });
});

// Route to handle salescalc form submission.
router.post("/form/salescalc", async (req, res) => {
  let formData = req.body;

  await Calculator.create(formData);
  res.send("Sales Calculation created successfully!");
});

// ----------------------------------Production Calculator---------------------------------->
// route for prodcalc form.
router.get("/form/prodcalc", async (req, res) => {
  let clients = await Client.distinct("clientName");
  res.render("utilities/prodCalc.ejs", { title: "Production Calculator", CSS: false, JS: "prodCalc.js", clients, notification: req.flash("notification") });
});

// Route to handle prodcalc form submission.
router.get("/form/prodcalc/data", async (req, res) => {
  let { w, h, client } = req.query;
  console.log(w, h, client);
  let clients = await Calculator.findOne({ companyName: client, labelWidth: w, labelHeight: h });
  console.log(clients);
  res.status(200).json(clients);
});

// Route to handle systemid form submission.
router.post("/form/prodcalc", async (req, res) => {
  let formData = req.body;

  await Calculator.create(formData);
  res.send("Production Calculation created successfully!");
});

// ----------------------------------Block Master---------------------------------->
// route for systemid form.
router.get("/form/block", async (req, res) => {
  let clients = await Client.distinct("clientName");
  console.log(clients);
  res.render("utilities/blockMaster.ejs", {
    CSS: false,
    title: "Block",
    JS: false,
    clients,
    notification: req.flash("notification"),
  });
});

// Route to handle systemid form submission.
router.post("/form/block", async (req, res) => {
  let formData = req.body;

  let savedBlockData = await Block.create(formData);
  console.log(savedBlockData);
  req.flash("notification", "Block created successfully!");
  res.redirect("/fairdesk/form/block");
});

// ----------------------------------Die Master---------------------------------->
// route for systemid form.
router.get("/form/die", async (req, res) => {
  let clients = await Client.distinct("clientName");
  console.log(clients);
  res.render("utilities/dieMaster.ejs", {
    CSS: "tabOpt.css",
    title: "Die",
    JS: "clientForm.js",
    clients,
    notification: req.flash("notification"),
  });
});

// Route to handle systemid form submission.
router.post("/form/die", async (req, res) => {
  let savedDieData = await Die.create(req.body);
  req.flash("notification", "Die created successfully!");
  res.redirect("/fairdesk/form/die");
});

// ---------------------------------------------------------------------------------------------------->>>>>

// ----------------------------------client display---------------------------------->
// route for client display page.
router.get("/edit/client", async (req, res) => {
  let clients = await Client.find();
  res.render("edit/clientDisp.ejs", {
    CSS: false,
    title: "Client Display",
    JS: false,
    clients,
    notification: req.flash("notification"),
  });
});

// ----------------------------------user display---------------------------------->
// route for user display page.
router.get("/edit/user/:id", async (req, res) => {
  let { id } = req.params;
  let clientData = await Client.findOne({ _id: id }).populate("users");
  let users = clientData.users;
  console.log(users);
  // res.send(users);
  res.render("edit/userDisp.ejs", {
    CSS: false,
    title: "Username Display",
    JS: false,
    users,
    notification: req.flash("notification"),
  });
});

// ----------------------------------Details display---------------------------------->
// route for details page.
router.get("/edit/details/:id", async (req, res) => {
  try {
    const userData = await Username.findById(req.params.id).populate("label").populate("ttr").populate("tape");
    console.log(userData);

    res.render("edit/detailsPage.ejs", { 
      userData: userData, 
      labels: userData.label || [], 
      ttrs: userData.ttr || [], 
      tapes: userData.tape || [], 
      CSS: false, 
      JS: false, 
      title: "Client Details",
      notification: req.flash("notification")
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ----------------------------------Master display---------------------------------->
// route for details page.
router.get("/master/view", async (req, res) => {
  let jsonData = await Username.find().sort({ clientName: 1 });

  // console.log(jsonData);
  res.render("users/masterDisp.ejs", { jsonData, CSS: "tableDisp.css", JS: false, title: "Client View", notification: req.flash("notification") });
});

// ----------------------------------Labels display---------------------------------->
// route for details page.
router.get("/disp/labels", async (req, res) => {
  let jsonData = await Label.find();
  
  res.render("inventory/labelsDisp.ejs", { jsonData, CSS: "tableDisp.css", JS: false, title: "Labels Display", notification: req.flash("notification") });
});

// ----------------------------------Labels display (individual)---------------------------------->
// route for details page.
router.get("/labels/view/:id", async (req, res) => {
  console.log(req.params.id);
  let userData = await Username.findById(req.params.id).populate("label");
  let jsonData = userData.label;

  console.log(jsonData);
  // res.send("hello");
  res.render("inventory/labelsDisp.ejs", { jsonData, CSS: "tableDisp.css", JS: false, title: "Labels Display", notification: req.flash("notification") });
});

// ----------------------------------TTR display---------------------------------->
// route for details page.
router.get("/ttr/view/:id", async (req, res) => {
  let userData = await Username.findById(req.params.id).populate("ttr");
  let jsonData = userData.ttr;
  
  // jsonData.push(itemsCount);
  console.log(jsonData);
  res.render("inventory/ttrDisp.ejs", { jsonData, CSS: false, JS: false, title: "TTR Display", notification: req.flash("notification") });
});

export default router;