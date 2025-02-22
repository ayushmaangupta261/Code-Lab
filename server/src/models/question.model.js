import mongoose, { Schema } from "mongoose";

const questionSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        // required: true,
      },
    ],
    sampleCode: [
      {
        type: mongoose.Types.ObjectId,
        ref: "SampleCode",
      },
    ],
    example:[
      {
        type:mongoose.Types.ObjectId,
        ref: "Example",
      }
    ],
    createdBY:{
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true,
  }
);

export const Question = mongoose.model("Question", questionSchema);
