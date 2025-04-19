import fs from "fs";
import path from "path";
import { Solution } from "../models/solution.model.js";
import compiler from "compilex";

const options = { stats: true };
compiler.init(options);

const compileCode = async (req,res) => {
  try {
    const { code, input, lang } = req.body;
    if (!code || !lang) {
      return res
        .status(400)
        .json({ success: false, message: "Code and language are required" });
    }

    let envData = { OS: "windows" };
    if (lang === "cpp") envData.cmd = "g++";
    if (lang === "java") envData.cmd = "javac";

    // Create the temp directory if it doesn't exist
    const tempDir = path.resolve("temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    // File path is fixed: temp/temp.code
    const filePath = path.join(tempDir, `temp.${lang}`);

    // Overwrite the file with the new code
    fs.writeFileSync(filePath, code, "utf8");

    console.log(`📁 Code saved at: ${filePath}`);

    const callback = async (data) => {
      console.log("🔹 Full Response from Compilation ->", data);

      if (data.error) {
        return res.status(400).json({ success: false, output: data.error });
      }

      console.log("✅ Extracted Output ->", data.output);

      return res.status(200).json({ success: true, result: data.output });
    };

    // Compile using compilex
    if (lang === "java") {
      input
        ? compiler.compileJavaWithInput(envData, code, input, callback)
        : compiler.compileJava(envData, code, callback);
    } else if (lang === "cpp") {
      input
        ? compiler.compileCPPWithInput(envData, code, input, callback)
        : compiler.compileCPP(envData, code, callback);
    } else if (lang === "python") {
      input
        ? compiler.compilePythonWithInput(envData, code, input, callback)
        : compiler.compilePython(envData, code, callback);
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
