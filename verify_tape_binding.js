import mongoose from "mongoose";
import Tape from "./models/inventory/tape.js";
import TapeBinding from "./models/inventory/tapeBinding.js";
import Username from "./models/users/username.js";
import connectDB from "./config/db.js";
import { configDotenv } from "dotenv";

configDotenv({ quiet: true });

const run = async () => {
  await connectDB();

  console.log("Connected to DB");

  // 1. Create Dummy Tape
  const tape = await Tape.create({
    tapeProductId: "TEST-TAPE-" + Date.now(),
    tapePaperCode: "TEST-CODE",
    tapeGsm: 100,
    tapePaperType: "TEST-TYPE",
    tapeWidth: 100,
    tapeMtrs: 100,
    tapeCoreId: 1,
    tapeFinish: "MATTE",
    tapeAdhesiveGsm: "20",
    createdBy: "TEST-SCRIPT",
  });
  console.log("Created Tape:", tape._id);

  // 2. Create Dummy User
  const user = await Username.create({
    clientId: "TEST-CLIENT-" + Date.now(),
    clientName: "TEST-CLIENT",
    clientType: "TEST",
    hoLocation: "TEST-LOC",
    accountHead: "TEST-HEAD",
    userName: "TEST-USER-" + Date.now(),
    userLocation: "TEST-LOC",
    userDepartment: "TEST-DEPT",
    userContact: "1234567890",
    userEmail: "test@example.com",
    dispatchAddress: "TEST-ADDR",
  });
  console.log("Created User:", user._id);

  // 3. Create First Binding
  const bindingData = {
    tapeId: tape._id,
    userId: user._id,
    tapeClientPaperCode: "TEST-BINDING-CODE",
    clientTapeGsm: 100,
    tapeMtrsDel: 0,
    tapeRatePerRoll: 500,
    tapeSaleCost: 400,
    tapeMinQty: 10,
    tapeOdrQty: 100,
    tapeOdrFreq: "Monthly",
    tapeCreditTerm: "30 Days",
  };

  const binding1 = await TapeBinding.create(bindingData);
  console.log("Created Binding 1:", binding1._id);

  // 4. Try Exact Duplicate (Should Fail with new logic, currently fails with old logic too)
  // The current logic checks userId, tapeId, tapeClientPaperCode.
  // If I use the same data, it should fail in BOTH old and new logic.
  // However, the GOAL is that if I change `tapeRatePerRoll`, it MUST FAIL in old logic (because it ignores rate)
  // and PASS in new logic (because rate is different).

  console.log("\n--- Testing Partial Duplicate (Same Code, Different Rate) ---");
  const bindingDataPartial = {
    ...bindingData,
    tapeRatePerRoll: 600, // Different rate!
  };

  // In current implementation, this check is done in the ROUTE, not the MODEL.
  // So I can't test validity via Model.create directly if the check is in the route.
  // But I can simulate the check logic here.

  // CURRENT LOGIC SIMULATION:
  const existingBindingOld = await TapeBinding.findOne({
    userId: user._id,
    tapeId: tape._id,
    tapeClientPaperCode: bindingData.tapeClientPaperCode,
  });

  if (existingBindingOld) {
    console.log("OLD LOGIC: Blocked partial duplicate (Expected behavior for CURRENT code)");
  } else {
    console.log("OLD LOGIC: Allowed partial duplicate (Unexpected for CURRENT code)");
  }

  // NEW LOGIC SIMULATION:
  const existingBindingNew = await TapeBinding.findOne({
    userId: user._id,
    tapeId: tape._id,
    tapeClientPaperCode: bindingData.tapeClientPaperCode,
    clientTapeGsm: bindingData.clientTapeGsm,
    tapeMtrsDel: bindingData.tapeMtrsDel, // wait, should mtrsDel be part of uniqueness? Probably not if it tracks delivery?
    // Actually the prompt says "exact like this".
    // looking at the user request:
    // tapeMtrsDel: 423
    // The user included it in the list.
    // But typically "Delivered" changes over time.
    // However, if it's "Agreed Delivery Terms" maybe?
    // The schema says: // Delivered meters (if partial roll etc.)
    // It defaults to 0.
    // I will include it as requested but it's suspicious.

    tapeRatePerRoll: bindingDataPartial.tapeRatePerRoll, // checking against the NEW rate
    tapeSaleCost: bindingData.tapeSaleCost,
    tapeMinQty: bindingData.tapeMinQty,
    tapeOdrQty: bindingData.tapeOdrQty,
    tapeOdrFreq: bindingData.tapeOdrFreq,
    tapeCreditTerm: bindingData.tapeCreditTerm,
  });

  if (existingBindingNew) {
    console.log("NEW LOGIC: Blocked partial duplicate (Unexpected for NEW code if key differs)");
  } else {
    console.log("NEW LOGIC: Allowed partial duplicate (Expected behavior for NEW code)");
  }

  // Cleanup
  await TapeBinding.deleteMany({ tapeClientPaperCode: "TEST-BINDING-CODE" });
  await Tape.deleteOne({ _id: tape._id });
  await Username.deleteOne({ _id: user._id });
  console.log("Cleanup complete");
  process.exit(0);
};

run().catch((err) => console.error(err));
