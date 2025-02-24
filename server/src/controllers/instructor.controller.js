import { User } from "../models/user.model.js";
import { Question } from "../models/question.model.js";
import { Example } from "../models/example.model.js";
import { SampleCode } from "../models/sampleCode.model.js";

const createQuestion = async (req, res) => {
  try {
    // const { user, question, sampleCode, examples } = req.body;

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
      title:title,
      description: description,
      images: null,
      sampleCode: sampleCodeInDB._id, // Store ObjectId directly
      example: exampleInDB._id, // Store ObjectId directly
      //   createdBy: user._id, // Store ObjectId directly
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

export { createQuestion };
