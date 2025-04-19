import mongoose, { Schema } from "mongoose";

const solutionSchema = Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
  },
  language: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  accepted: {
    type: Boolean,
    default: false,
  },
  marks: {
    type: Number,
    default: 0,
  },
  comment: {
    type: String,
    required: true,
  },
  solvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Solution = mongoose.model("Solution", solutionSchema);
