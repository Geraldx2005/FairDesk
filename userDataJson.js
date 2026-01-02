import fs from "fs";

const raw = JSON.parse(fs.readFileSync("users.json", "utf-8"));

const finalData = raw.map((row, index) => ({
  // ---- Client ----
  clientId: `FS | CLIENT | ${index + 1}`, // auto-generate safely
  clientName: row["Client Name"]?.trim() || null,
  clientType: row.clientType || null,
  accountHead: row.accountHead || null,

  // ---- User ----
  userName: row["User Name"] || null,
  userLocation: row["Location"] || null,
  userDepartment: row["Department"] || null,
  userContact: row["Contact No"]
    ? String(row["Contact No"]).replace(/\s+/g, "")
    : null,
  userEmail: row["Email"] || null,
  dispatchAddress: row["Address"] || null,

  // ---- Commercial ----
  charge: row["Charge"] || null,

  // ---- Transport ----
  transportName: row["Transport Name"] || null,
  transportContact: row["Transport Contact"]
    ? String(row["Transport Contact"]).replace(/\s+/g, "")
    : null,
  transportDropLocation: row["Transport Drop Location"] || null,
  transportDeliveryMode: row["Transport Delivery Mode"] || null,
  transportDeliveryLocation: row["Transport Delivery Location"] || null,
  transportPayment: row["Transport Payment"] || null,

  // ---- System ----
  label: [],
  ttr: [],
  tape: [],
  __v: 0
}));

fs.writeFileSync(
  "clients.final.json",
  JSON.stringify(finalData, null, 2)
);

console.log("✅ clients.final.json created successfully");
