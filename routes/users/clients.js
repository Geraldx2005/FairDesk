import express from "express";
import Client from "../../models/users/client.js";

const router = express.Router();

/* ================= CLIENTS VIEW ================= */
router.get("/view", async (req, res) => {
  try {
    const clients = await Client.find(
      { clientStatus: "ACTIVE" },
      {
        _id: 0,
        clientId: 1,
        clientName: 1,
        clientType: 1,
        hoLocation: 1,
        accountHead: 1,
        clientGst: 1,
        clientPan: 1,
        clientMsme: 1,
        clientGumasta: 1,
        clientStatus: 1,
      }
    );

    res.render("users/clientsView.ejs", {
      title: "Client View",
      jsonData: clients,
      CSS: "tableDisp.css",
      JS: false,
      notification: req.flash("notification"),
    });
  } catch (err) {
    console.error(err);
    req.flash("notification", "Failed to load Clients");
    res.redirect("back");
  }
});

export default router;
