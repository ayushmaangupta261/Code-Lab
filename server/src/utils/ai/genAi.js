import dotenv from "dotenv";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Resolve directory path
const __dirname = dirname(fileURLToPath(import.meta.url));

// ✅ Load environment variables
dotenv.config({
  path: path.resolve(__dirname, "../../../.env"), // Adjust path as needed
});

console.log("Google API Key -> ", process.env.GOOGLE_API_KEY);

// ✅ Initialize Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//  Handles AI-generated content request
const genAi = async (message) => {
  try {
    // const { message } = req.body; // ✅ Extract input from request body

    // console.log("AI Request Message -> ", message);

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message prompt is required",
      });
    }

    // ✅ Generate AI response
    const result = await model.generateContent(message);
    // console.log("Result -> ", result);
    const responseText = result.response.text();

    // console.log("AI Response -> ", responseText);

   return responseText

  } catch (error) {
    console.error("AI Error -> ", error);

    return "Error from ai model"
  }
};

export { genAi }; // ✅ Export function
