import mongoose from "mongoose";

let clientSchema = new mongoose.Schema({
    clientId: { type: Number, required: true },
    clientName: { type: String, required: true },
    clientType: { type: String, required: true },
    clientStatus: { type: String, required: true },
    hoLocation: { type: String, required: true },
    accountHead: { type: String, required: true },
    // ownerName: { type: String, required: true },
    // ownerMobNo: { type: String, required: true },
    // ownerEmail: { type: String, required: true },
    clientGst: { type: Number, required: true },
    clientMsme: { type: Number, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "Username" }],
});
let Client = mongoose.model("Client", clientSchema);

export default Client;