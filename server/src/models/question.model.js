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
    example: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Example",
      },
    ],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    collegeId: {
      type: mongoose.Types.ObjectId,
      ref: "Institute",
    },
    solvedBy: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    solved: {
      type: Boolean,
      default: false,
    },
    // subjectName:{
    //   type: String,
    //   required: true,
    // }
  },
  {
    timestamps: true,
  }
);

export const Question = mongoose.model("Question", questionSchema);
