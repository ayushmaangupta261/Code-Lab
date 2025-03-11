import { Solution } from "../models/solution.model.js";
import compiler from "compilex";

const options = { stats: true };

compiler.init(options);

// Function to compile code
const compileCode = async (req, res) => {
  try {
    console.log("🔹 Compilation request received -> ", req.body);

    const { code, input, lang } = req.body;
    if (!code || !lang) {
      return res
        .status(400)
        .json({ success: false, message: "Code and language are required" });
    }

    let envData = { OS: "windows" };
    if (lang === "cpp") envData.cmd = "g++";
    if (lang === "java") envData.cmd = "javac";

    const callback = async (data) => {
      console.log(
        "🔹 Full Response from Compilation ->",
        JSON.stringify(data, null, 2)
      );

      if (data.error) {
        return res.status(400).json({ success: false, output: data.error });
      }

      // Check all available keys inside data
      console.log("🔹 Checking Possible Keys in Data:", Object.keys(data));

    

      console.log("✅ Extracted Output ->",  data.output);

      // Save compiled result to database
      // const newCode = new Solution({ language: lang, code, accepted: true });
      // await newCode.save();

      return res.status(200).json({ success: true, result:data.output });
    };


    // Compile Java with Scanner Input
    if (lang === "java") {
      console.log("🔹 Java compilation started...");
      input
        ? compiler.compileJavaWithInput(envData, code, input, callback) // ✅ Corrected function
        : compiler.compileJava(envData, code, callback); // ✅ Corrected function
    } else if (lang === "cpp") {
      input
        ? compiler.compileCPPWithInput(envData, code, input, callback) // ✅ Corrected function
        : compiler.compileCPP(envData, code, callback); // ✅ Corrected function
    } else if (lang === "python") {
      input
        ? compiler.compilePythonWithInput(envData, code, input, callback) // ✅ Corrected function
        : compiler.compilePython(envData, code, callback); // ✅ Corrected function
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Unsupported language" });
    }
  } catch (error) {
    console.error("❌ Compilation error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during compilation" });
  }
};

export { compileCode };
