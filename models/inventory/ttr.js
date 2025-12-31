import mongoose from "mongoose";

let ttrSchema = new mongoose.Schema({}, {strict: false});
let Ttr = mongoose.model("Ttr", ttrSchema);

export default Ttr;