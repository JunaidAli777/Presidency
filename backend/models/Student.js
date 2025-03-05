import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    branch: { type: String, required: true },
    year: {type: String, required: true},
    registerNo: { type: String, required: true, unique: true },
    mathematics: { type: String},
    physics: { type: String},
    chemistry: { type: String},
    computerScience: { type: String},
    technicalEnglish: { type: String},
    engineeringGraphics: { type: String},
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;