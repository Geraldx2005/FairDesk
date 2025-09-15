import mongoose from "mongoose";

const employeeSchem = new mongoose.Schema({}, {strict: false});

const Employee = mongoose.model("Employee", employeeSchem);

export default Employee;