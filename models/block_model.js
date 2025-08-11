import mongoose from "mongoose";

let blockSchema = new mongoose.Schema({
    blockDate: { type: String, required: true },
    blockMachineNo: { type: String, required: true },
    blockArtworkNo: { type: String, required: true },
    blockClientName: { type: String, required: true },
    blockJobName: { type: String, required: true },
    blockVersion: { type: String, required: true },
    blockWidth: { type: String, required: true },
    blockHeight: { type: String, required: true },
    blockGap: { type: String, required: true },
    blockFrontColor: { type: String, required: true },
    blockBackColor: { type: String, required: true },
    blockVarnish: { type: String, required: true },
    blockFoilNo: { type: String, required: true },
    blockStatus: { type: String, required: true },    
});
let Block = mongoose.model("Block", blockSchema);

export default Block;