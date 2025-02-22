import mongoose, { Schema } from "mongoose";

const exampleSchema = Schema(
  {
    input: {
      type: [String],
      required: true,
    },
    output: {
      type: [String],
      required: true,
    },
    explanation: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Example = mongoose.model("Example", exampleSchema);