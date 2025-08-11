import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  clientName: { type: String, required: true },
  clientType: { type: String, required: true },
  hoLocation: { type: String, required: true },
  accountHead: { type: String, required: true },
  userName: { type: String, required: true },
  location: { type: String, required: true },
  clientDepartment: { type: String, required: true },
  clientContact: { type: String, required: true },
  clientEmail: { type: String, required: true },
  transportName: { type: String },
  transportContact: { type: String },
  dropLocation: { type: String },
  deliveryMode: { type: String },
  deliveryLocation: { type: String },
  clientPayment: { type: String },
  SelfDispatch: { type: String },
  clientStatus: { type: String },
  ownerName: { type: String },
  ownerMobNo: { type: String },
  ownerEmail: { type: String },
  clientGst: { type: String },
  clientMsme: { type: String },

  // Multiple label per client
  label: [{
    type: Schema.Types.ObjectId,
    ref: 'Label'
  }],
  ttr: [{
    type: Schema.Types.ObjectId,
    ref: 'Ttr'
  }],
  tape: [{
    type: Schema.Types.ObjectId,
    ref: 'Tape'
  }]
});

const Username = mongoose.model("Username", userSchema);

export default Username;
