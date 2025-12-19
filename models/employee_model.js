import mongoose from "mongoose";

const dependentSchema = new mongoose.Schema(
  {
    dependentsName: String,
    dependentsDOB: String,
    dependentsRelation: String
  },
  { _id: false }
);

const employeeSchema = new mongoose.Schema(
  {
    /* ================= EMPLOYMENT ================= */
    empId: { type: String, unique: true },
    empDateOfJoining: String,
    empType: String,
    empLoc: String,
    empDept: String,
    empReportingManager: String,
    empProfile: String,
    empOfficeMob: String,
    empOfficeEmailId: String,

    /* ================= PERSONAL ================= */
    empName: String,
    empDob: String,
    empGender: String,
    empMobile1: String,
    empMobile2: String,
    empEmergencyNo1: String,
    empEmergencyNo2: String,
    empEmail: String,
    empMartialStatus: String,
    empMarriageAnniversary: String,
    empPresentAddress: String,
    empPermanentAddress: String,
    empHobbies: String,

    /* ================= IDENTIFICATION ================= */
    empPhoto: String, // store file path
    empAadhaar: String,
    empPan: String,

    /* ================= BANKING ================= */
    empBankName: String,
    empAccountHolderName: String,
    empAccNo: String,
    empIfscCode: String,

    /* ================= DEDUCTIONS (STATIC) ================= */
    empPT: { type: Number, default: 0 },
    empTDS: { type: Number, default: 0 },
    empLIC: { type: Number, default: 0 },
    empMedical: { type: Number, default: 0 },
    empNSIC: { type: Number, default: 0 },
    empESIC: { type: Number, default: 0 },
    empPF: { type: Number, default: 0 },

    /* ================= SALARY STRUCTURE ================= */
    basicSalary: { type: Number, default: 0 },
    railwayPass: { type: Number, default: 0 },
    travelling: { type: Number, default: 0 },
    houseRent: { type: Number, default: 0 },
    staffQuarters: { type: Number, default: 0 },
    otRatePerHour: { type: Number, default: 0 },

    /* ================= DEPENDENTS ================= */
    dependentsCount: { type: Number, default: 0 },
    dependentsDetails: [dependentSchema],

    /* ================= META ================= */
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
