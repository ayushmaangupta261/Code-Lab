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

/**
 * Handles AI-generated content request
 */
const myAi = async (req, res) => {
  try {
    const { message } = req.body; // ✅ Extract input from request body

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message prompt is required",
      });
    }

    console.log("AI Request Message -> ", message);

    // ✅ Generate AI response
    const result = await model.generateContent(message);
    const responseText = result.response.text();

    console.log("AI Response -> ", responseText);

    return res.json({
      success: true,
      response: responseText, // ✅ Send AI response
    });
  } catch (error) {
    console.error("AI Error -> ", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { myAi }; // ✅ Export function
