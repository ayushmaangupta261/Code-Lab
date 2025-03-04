import { myAi } from "../utils/ai/genAi.js";

const generateTestCases = async (req, res) => {
  try {
    const { message, code, input, output, exampleFormat } = req.body;

    if (!message || !code || !input || !output ||!exampleFormat) {
      return res
        .status(400)
        .json({ success: false, message: "All required fields are missing" });
    }

    const testCasePrompt = `
Generate **20 test cases** based on the given problem's input format.

### Requirements:
1. The test cases should be derived from **reliable sources** like **LeetCode, GeeksforGeeks, CodeChef**, etc.
2. Ensure that each test case follows the correct **input format** specified in the problem statement.
3. For each test case, generate the **expected correct output** based on the provided sample input.

### Output Format:
- The **input and output** should be stored as an **array of strings**.
- Each **test case input** should be formatted as a **single string**, where:
  - **Two input values** are **separated by a space**.
  - **Multiple test cases** are **separated by commas**.

### Example Format:
\`\`\`json
${exampleFormat}

the input and output values should be intrgers and not strings.
response should have response.input and resposne.output and response.explanation and nothing else and all the fields shold be separate
Ensure that the test cases cover **all possible edge cases**, including:
- **Minimum and maximum input values**
- **Boundary cases**
- **Special cases (if applicable)**
`;

    // console.log(testCasePrompt);

    const prompt =
      message + " " + code + " " + input + " " + output + " " + testCasePrompt;

    console.log("Message for generating test cases -> ", prompt);

    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: "Message prompt is required" });
    }

    const response = await myAi(prompt);
    console.log("AI Response -> ", response);

    if (!response) {
      return res.status(400).json({
        success: false,
        message: "Error in ai model",
      });
    }

    return res.status(200).json({
      success: true,
      response: response, // ✅ Send AI response
    });
  } catch (error) {
    console.log("Error generating test -> ", error);
  }
};

export { generateTestCases };
