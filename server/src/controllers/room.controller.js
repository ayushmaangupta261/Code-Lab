// import { Room } from "../models/room.model.js";
// import { Student } from "../models/user.model.js"; // Ensure you're importing the Mongoose model

// const createAndJoinRoom = async (req, res) => {
//   try {
//     const { roomId, email, projectName } = req.body.data;

//     if (!roomId || !email || !projectName) {
//       return res.status(400).json({ message: "roomId and email are required" });
//     }

//     console.log("Data -> ", req.body.data);

//     const StudentInDB = await Student.findOne({ email });
//     if (!StudentInDB) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     let existingRoom = await Room.findOne({ roomId });

//     if (existingRoom) {
//       const alreadyPresent = existingRoom.students.some(
//         (studentId) => studentId.toString() === StudentInDB._id.toString()
//       );

//       if (!alreadyPresent) {
//         existingRoom.students.push(StudentInDB._id);
//         await existingRoom.save();
//       }

//       const populatedRoom = await Room.findById(existingRoom._id)
//         .populate("students", "fullName email _id")
//         .populate("instructor", "fullName email _id");

//       console.log("Sending response in already present");

//       return res.status(200).json({
//         message: "Student added to existing room",
//         roomData: populatedRoom,
//         success: true,
//       });
//     } else {
//       const newRoom = await Room.create({
//         roomId,
//         students: [StudentInDB._id],
//         instructor: StudentInDB?.instructor,
//         college: StudentInDB?.collegeId,
//         projectName: projectName,
//       });

//       const populatedRoom = await Room.findById(newRoom._id)
//         .populate("students", "fullName email -_id")
//         .populate("instructor", "fullName email -_id");

//       console.log("Sending response in new");

//       return res.status(201).json({
//         message: "Room created and Student added",
//         room: populatedRoom,
//         success: true,
//       });
//     }
//   } catch (error) {
//     console.error("Error creating room:", error);
//     return res.status(500).json({ message: "Server error", success: false });
//   }
// };

// const findRoomByEmail = async (req, res) => {
//   try {
//     const { email } = req.body;
//     console.log("Email body -> ", req.body);

//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     // Find the student by email
//     const student = await Student.findOne({ email });
//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     // Find all rooms where the student is present
//     const rooms = await Room.find({ students: student._id })
//       .populate("students", "fullName email _id")
//       .populate("instructor", "fullName email _id");

//     if (!rooms || rooms.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No rooms found for this student" });
//     }

//     console.log("Returning room data");

//     return res.status(200).json({
//       message: "Rooms found",
//       rooms: rooms,
//       success: true,
//     });
//   } catch (error) {
//     console.error("Error finding room:", error);
//     return res.status(500).json({ message: "Server error", success: false });
//   }
// };

// export { createAndJoinRoom, findRoomByEmail };

import fs from "fs";
import path from "path";
import { Room } from "../models/room.model.js";
import { Student } from "../models/user.model.js"; // Ensure you're importing the Mongoose model
import { fileURLToPath } from "url"; // Import the required function from the url module

// Get the directory name equivalent of __dirname in ES Modules

const createAndJoinRoom = async (req, res) => {
  try {
    const { roomId, email, projectName } = req.body.data;

    if (!roomId || !email || !projectName) {
      return res.status(400).json({ message: "roomId and email are required" });
    }

    console.log("Data -> ", req.body.data);

    const StudentInDB = await Student.findOne({ email });
    if (!StudentInDB) {
      return res.status(404).json({ message: "Student not found" });
    }

    let existingRoom = await Room.findOne({ roomId });

    if (existingRoom) {
      const alreadyPresent = existingRoom.students.some(
        (studentId) => studentId.toString() === StudentInDB._id.toString()
      );

      if (!alreadyPresent) {
        existingRoom.students.push(StudentInDB._id);
        await existingRoom.save();
      }

      const populatedRoom = await Room.findById(existingRoom._id)
        .populate("students", "fullName email _id")
        .populate("instructor", "fullName email _id");

      console.log("Sending response in already present");

      return res.status(200).json({
        message: "Student added to existing room",
        roomData: populatedRoom,
        success: true,
      });
    } else {
      // Create a new room and create folder for the roomId

      // Create folder with the roomId inside server/projects
      const projectFolderPath =
        "projects/" + roomId;
      console.log("Hardcoded Path -> ", projectFolderPath); // Check resolved path

      // Create the directory if it doesn't exist

      if (!fs.existsSync(projectFolderPath)) {
        console.log("Folder does not exist. Creating...");
        fs.mkdirSync(projectFolderPath, { recursive: true });
      } else {
        console.log("Folder already exists.");
      }

      const newRoom = await Room.create({
        roomId,
        students: [StudentInDB._id],
        instructor: StudentInDB?.instructor,
        college: StudentInDB?.collegeId,
        projectName: projectName, 
      });

      const populatedRoom = await Room.findById(newRoom._id)
        .populate("students", "fullName email -_id")
        .populate("instructor", "fullName email -_id");

      console.log("Sending response in new");

      return res.status(201).json({
        message: "Room created and Student added",
        room: populatedRoom,
        success: true,
      });
    }
  } catch (error) {
    console.error("Error creating room:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const findRoomByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Email body -> ", req.body);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find the student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find all rooms where the student is present
    const rooms = await Room.find({ students: student._id })
      .populate("students", "fullName email _id")
      .populate("instructor", "fullName email _id");

    if (!rooms || rooms.length === 0) {
      return res
        .status(404)
        .json({ message: "No rooms found for this student" });
    }

    console.log("Returning room data");

    return res.status(200).json({
      message: "Rooms found",
      rooms: rooms,
      success: true,
    });
  } catch (error) {
    console.error("Error finding room:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export { createAndJoinRoom, findRoomByEmail };
