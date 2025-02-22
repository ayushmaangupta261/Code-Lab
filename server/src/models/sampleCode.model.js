import mongoose, { mongo, Schema } from "mongoose";

const sampleCodeSchema = Schema(
  {
    java: {
      type: String,
      required: true,
    },
    cpp: {
      type: String,
      required: true,
    },
    python: {
      type: String,
      required: true,
    },
    // example:{
    //   type:mongoose.Types.ObjectId,
    //   ref: "Example"
    // }
  },
  {
    timestamps: true,
  }
);

export const SampleCode = mongoose.model("SampleCode", sampleCodeSchema);
