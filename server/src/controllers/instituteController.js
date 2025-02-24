import { Institute } from "../models/institute.model.js";

// function to register institute
const registerInstitute = async (req, res, next) => {
  console.log("Request body -> ", req.body);

  try {
    // Extract user details
    const { name, email, password } = req.body;
    // images are pending

    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // Check if the email already exists
    const existingUser = await Institute.findOne({ email });

    console.log("Existing isntitute ->", existingUser);

    if (existingUser) {
      return res.status(409).json({
        message: "Institute with this email already exists",
        success: false,
      });
    }

    // Create user in the database
    const institute = await Institute.create({
      name,
      email,
      password,
    });

    if (!institute) {
      return res
        .status(500)
        .json({ message: "Failed to register user", success: false });
    }

    // Remove sensitive fields
    const createdInstitute = institute.toObject();
    delete createdInstitute.password;

    setTimeout(() => {
      return res
        .status(201)
        .json({ institute: createdInstitute, success: true });
    }, 5000);
  } catch (error) {
    console.error("Error in register college:", error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "An error occurred during registration",
      success: false,
    });
  }
};

export { registerInstitute };
