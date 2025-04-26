import mongoose, { Schema } from "mongoose";

const RoomSchema = new Schema({
  roomId: {
    type: String,
    required: true, // fixed typo from "requied"
  },
  projectName: {
    type: String,
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institute",
  },
});

export const Room = mongoose.model("Room", RoomSchema);
