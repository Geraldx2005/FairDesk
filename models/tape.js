import mongoose from "mongoose";

let tapeSchema = new mongoose.Schema({}, {strict: false});
let Tape = mongoose.model("Tape", tapeSchema);

export default Tape;