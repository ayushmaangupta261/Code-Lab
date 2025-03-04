import { User } from "../models/user.model.js";
import { Question } from "../models/question.model.js";
import { Example } from "../models/example.model.js";
import { SampleCode } from "../models/sampleCode.model.js";


// create a new Question
const createQuestion = async (req, res) => {
  try {
    const { question, sampleCode, examples } = req.body;
    const user = req.user;

    const {
      title,
      description,
      java,
      python,
      cpp,
      explanation,
      sampleInput,
      sampleOutput,
    } = req.body;

    console.log("🔹 Received Data:", req.body);

    // ✅ Ensure required fields exist
    // if (!user || !question || !sampleCode || !examples) {
    //   return res.status(400).json({ message: "All fields are required", success: false });
    // }

    // ✅ Ensure `examples` contains required fields
    // if (!examples.input || !examples.output || !examples.explanation) {
    //   return res
    //     .status(400)
    //     .json({ message: "Invalid examples format", success: false });
    // }

    // ✅ Ensure `sampleCode` has exactly 3 values (Java, C++, Python)
    // if (!Array.isArray(sampleCode) || sampleCode.length !== 3) {
    //   return res
    //     .status(400)
    //     .json({ message: "Invalid sample code format", success: false });
    // }

    // 🔹 Create Example Entry
    // ✅ Convert comma-separated strings into arrays
    const toArray = (value) =>
      value ? value.split(",").map((str) => str.trim()) : [];

    // ✅ Convert all comma-separated fields into arrays
    const sampleInputArray = toArray(sampleInput);
    const sampleOutputArray = toArray(sampleOutput);
    const explanationArray = toArray(explanation);

    console.log("Input array -> ", sampleInputArray);
    console.log("Output array -> ", sampleOutputArray);
    console.log("explanation array -> ", explanationArray);

    const exampleInDB = await Example.create({
      input: sampleInputArray,
      output: sampleOutputArray,
      explanation: explanationArray,
    });

    if (!exampleInDB) {
      return res
        .status(500)
        .json({ message: "Failed to create example", success: false });
    }

    console.log("✅ Example ID ->", exampleInDB._id.toString());

    // 🔹 Create Sample Code Entry
    const sampleCodeInDB = await SampleCode.create({
      java: java,
      cpp: cpp,
      python: python,
    });

    if (!sampleCodeInDB) {
      return res
        .status(500)
        .json({ message: "Failed to create sample code", success: false });
    }

    console.log("✅ Sample Code ID ->", sampleCodeInDB._id.toString());

    // 🔹 Create Question Entry
    const questionInDB = await Question.create({
      title: title,
      description: description,
      images: null,
      sampleCode: sampleCodeInDB._id, // Store ObjectId directly
      example: exampleInDB._id, // Store ObjectId directly
      createdBy: user._id, // Store ObjectId directly
    });

    if (!questionInDB) {
      return res
        .status(500)
        .json({ message: "Failed to create question", success: false });
    }

    console.log("✅ Question Created Successfully!");

    return res.status(201).json({
      message: "Question created successfully",
      success: true,
    });
  } catch (error) {
    console.error("❌ Error in createQuestion:", error);
    return res.status(500).json({
      message: "Server error while creating question",
      success: false,
    });
  }
};


// get questions solved by the students
const getSolvedQuestions = async (req, res) => {
  try {
    // user in the request
    const user = req.user;

    // validation on user
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    // question id
    const { questionId } = req.body;

    // validation on question
    if (!questionId) {
      return res.status(400).json({
        message: "Question ID is missing",
        success: false,
      });
    }

    // find questions solved
    const solvedQuestions = await Question.findById(questionId);
    if (!solvedQuestions) {
      return res.status(404).json({
        message: "Question not found",
        success: false,
      });
    }

    // questions solved
    const question = await Question.findById(questionId)
      .populate("solvedBy", "fullName _id")
      .exec();

    // validation
    if (!question) {
      return res.status(404).json({
        message: "Question not found",
        success: false,
      });
    }

    console.log("Question solved by students: -> ", question.solvedBy);

    const studentsArray = question.studentsSolvedTheQuestions.map(
      (student) => ({
        id: student._id,
        fullName: student.fullName,
      })
    );

    // log the details
    if (!studentsArray) {
      return res.status(404).json({
        message: "Error in studentsArray",
        success: false,
      });
    }

    console.log("Students solved the question: -> ", studentsArray);

    return res.status(200).json({
      message: "Solved questions by students",
      success: true,
      data: studentsArray,
    });

  } catch (error) {
    console.error("Error in getSolvedQuestions:", error);
    return res.status(500).json({
      message: "Server error while getting solved questions",
      success: false,
    });
  }

};


export { createQuestion, getSolvedQuestions };
