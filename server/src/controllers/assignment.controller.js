import { populate } from "dotenv";
import { Question } from "../models/question.model.js";
import { SampleCode } from "../models/sampleCode.model.js";
import { Solution } from "../models/solution.model.js";

import { giveMarks } from "./ai.controller.js";
import { compileCode } from "./compiler.controller.js";
import fs from "fs";
import path from "path";
import { Student } from "../models/user.model.js";

const getAllAssignments = async (req, res) => {
  try {
    // const { instructor } = req.body;
    const user = req.user; // decoded token is attached in req.decoded

    // console.log("req body in get assignments -> ",req.body)
    // console.log("user -> ",user)

    if (!user) {
      return res.status(400).json({
        message: "User  is missing",
        success: false,
      });
    }

    console.log("Going to fetch the user");

    // fetch the user
    const loggedInUser = await Student.findById(user._id);

    console.log("loggedInUser -> ", loggedInUser);

    const assignments = await Question.find({
      createdBy: loggedInUser.instructor.toString(),
    }).populate([
      { path: "sampleCode" }, // Select relevant fields from SampleCode
      { path: "example" }, // Select relevant fields from Example
    ]);

    // console.log("Assignments -> ", assignments);

    if (!assignments) {
      return res.status(404).json({
        message: "No assignments found",
        success: false,
      });
    }

    const updatedAssignments = assignments.map((question) => {
      const solvedByUser = question.solvedBy?.some(
        (id) => id.toString() === user._id
      );

      return {
        ...question._doc,
        solved: solvedByUser, // override with true/false
      };
    });

    // console.log("updates assignments -> ", updatedAssignments);

    if (!updatedAssignments) {
      return res.status(404).json({
        message: "No updates assignments found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedAssignments,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

// submit assignment
const submitAssignment = async (req, res) => {
  try {
    const { code, language, assignmentId } = req.body.data;
    const user = req.user;

    // console.log("User id -> ", user._id);

    if (!code || !language || !assignmentId) {
      return res.status(400).json({
        message: "Data is incomplete",
        success: false,
      });
    }

    // Check if temp.<language> file exists
    // const tempFilePath = path.join("temp", `temp.${language}`);
    if (!fs.existsSync(path.join("temp", `temp.${language}`))) {
      console.log("Tell to compile");
      return res.status(400).json({
        success: false,
        message: `Please compile your code first.`,
      });
    }

    const marks = await giveMarks(code);

    const cleanedResponse = marks.replace(/```/g, "").trim();
    const result = JSON.parse(cleanedResponse);

    if (!result) {
      return res.status(400).json({
        success: false,
        message: "error in generating marks",
      });
    }

    console.log("Marks-> ", result);

    if (marks[0] < 5) {
      return res.status(201).json({
        success: false,
        message: "Ypu have scored too low marks",
        data: result,
      });
    }

    // submit your answer
    const submittedSolution = await Solution.findOneAndUpdate(
      { questionId: assignmentId, solvedBy: user?._id }, // filter
      {
        $set: {
          questionId: assignmentId,
          language,
          code,
          accepted: true,
          marks: result[0],
          solvedBy: user?._id,
          comment: result[5],
        }, // update fields
      },
      {
        new: true, // return the modified document
        upsert: true, // create if it doesn't exist
      }
    );

    // console.log("Submitted soltion -> ", submittedSolution);

    if (!submittedSolution) {
      return res.status(400).json({
        success: false,
        message: "Error in submitting your answer",
      });
    }

    //update the user
    const updatedUser = await Student.findByIdAndUpdate(
      user?._id,
      {
        $addToSet: { questionsSolved: assignmentId },
      },
      { new: true }
    );

    // console.log("updated user -> ", updatedUser);

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "Error in updating the user",
      });
    }

    // update the question
    //update the user
    const updatedQuestion = await Question.findByIdAndUpdate(
      assignmentId,
      {
        $addToSet: { solvedBy: user?._id },
      },
      { new: true }
    );

    // console.log("Updated question -> ", updatedQuestion);

    if (!updatedQuestion) {
      return res.status(400).json({
        success: false,
        message: "Error in updating the question",
      });
    }

    // server cleanup
    const deletPath = path.join("temp", `temp.${language}`);
    if (fs.existsSync(deletPath)) {
      await fs.promises.unlink(deletPath);
      console.log(`Deleted temp file: ${deletPath}`);
    }
    // Delete all folders inside the temp directory
    const tempDir = path.join("temp");

    if (fs.existsSync(tempDir)) {
      const entries = await fs.promises.readdir(tempDir, {
        withFileTypes: true,
      });

      for (const entry of entries) {
        const fullPath = path.join(tempDir, entry.name);
        if (entry.isDirectory()) {
          await fs.promises.rm(fullPath, { recursive: true, force: true });
          console.log(`Deleted folder: ${fullPath}`);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Submitted 👍",
      data: result,
    });
  } catch (error) {
    console.log("Error in submit assignment -> ", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// get completed assignments
const completedAssignments = async (req, res) => {
  try {
    const user = req?.user;

    console.log("Find User in db -> ", user._id);

    const findUser = await Student.findById(user._id).populate({
      path: "instructor",
    });

    console.log("User -> ", findUser.instructor.questions.length);

    const solvedQuestions = await Solution.find({
      solvedBy: user._id,
    }).populate("questionId");

    // console.log("Find solution in db -> ", solvedQuestions);

    if (solvedQuestions.length <= 0) {
      return res.status(400).json({
        success: false,
        message: "Not able to fetch the questions",
      });
    }

    // fetch total number of questions/assignments

    return res.status(200).json({
      success: true,
      questionsSolved: solvedQuestions,
      totalQuestions: findUser.instructor.questions.length,
    });
  } catch (error) {
    console.log("error in completed assignments -> ", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export { getAllAssignments, submitAssignment, completedAssignments };
