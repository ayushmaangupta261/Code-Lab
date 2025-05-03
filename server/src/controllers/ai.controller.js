import { genAi } from "../utils/ai/genAi.js";

const giveMarks = async (code) => {
  try {
    const prompt = `
    You are an expert software engineer and strict coding examiner. I will give you a student's code submission. Grade the code using the criteria below and always assign the same marks for the same code — no randomness.
    
   Evaluation Criteria (Total: 10 Marks):
    
    - Correctness (4 marks):
      - Code must produce correct output for all inputs and edge cases.
      - Output must exactly match expected results.
      - No runtime errors.
    
    - Efficiency (2 marks):
      - Use optimal time and space complexity.
      - Avoid redundant logic or unnecessary steps.
    
    - Readability (2 marks): 
      - Proper indentation and formatting.
      - Clear and meaningful variable/function names.
      - Clean logical structure.
    
    - Best Practices (2 marks):
      - Avoid hardcoding unless necessary.
      - Handle edge cases.
      - Follow naming conventions.
      - Remove redundant code.
    
    Output Format (Must be EXACTLY like this — nothing more, nothing less):
    
    Return a single  array in the exact format below:
    
    [Total, Correctness, Efficiency, Readability, BestPractices, "Your code ..."]
    
    Important:
    - Total is the sum of the 4 criteria (max 10)
    - The comment must start with: "Your code"
    - The comment must be exactly 20 words
    - Return ONLY the array. Do NOT include any explanation, extra text, code, markdown, backticks, or formatting of any kind.
    
    Only return the array. Do not say anything else.
    
    Here is the student's code:
    `;

    const message = prompt + code;

    const marks = await genAi(message);

    console.log("Marks in ai controller -> ", marks);

    if (!marks) {
      return resizeBy.status(400).json({
        status: false,
        message: "Error generating marks",
      });
    }

    return marks;
  } catch (error) {
    console.log("Error in gveMarks -> ", error);
    return resizeBy.status(400).json({
      status: false,
      message: error?.message,
    });
  }
};

export { giveMarks };
