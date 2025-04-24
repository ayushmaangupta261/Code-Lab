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
      isInstitute: true,
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

const generateInstituteTokens = async (instituteId) => {
  const institute = await Institute.findById(instituteId);
  if (!institute) throw new Error("Institute not found");

  const accessToken = institute.generateAccessToken();
  const refreshToken = institute.generateRefreshToken();

  institute.accessToken = accessToken;
  institute.refreshToken = refreshToken;
  await institute.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const loginInstitute = async (req, res) => {
  const { email, password } = req.body;

  const institute = await Institute.findOne({ email });
  if (!institute || !(await institute.isPasswordCorrect(password))) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const { accessToken, refreshToken } = await generateInstituteTokens(
    institute._id
  );

  // Convert to plain JS object
  const instituteData = institute.toObject();

  // Populate required fields one by one
  await institute.populate("instructorsPresent");
  await institute.populate("studentsEnrolled");

  // Clean up sensitive info
  delete instituteData.password;
  delete instituteData.refreshToken;
  instituteData.accessToken = accessToken;

  await new Promise((resolve) => setTimeout(resolve, 5000));

  res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "None",
      secure: false,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: false,
    })
    .json({ success: true, user: instituteData });
};

const logoutInstitute = async (req, res) => {
  const institute = await Institute.findById(req.user._id);
  if (!institute)
    return res
      .status(400)
      .json({ success: false, message: "Already logged out" });

  institute.accessToken = null;
  institute.refreshToken = null;
  await institute.save();

  res
    .status(200)
    .json({ success: true, message: "Institute logged out successfully" });
};

//edit details
const editInstituteDetails = async (req, res) => {
  try {
    const user = req.user;
    const { subjects } = req.body;

    console.log("req body -> ", req.body);

    // Ensure subject is an array
    const subjectsToAdd = Array.isArray(subjects) ? subjects : [subjects];

    const updatedUser = await Institute.findByIdAndUpdate(
      user._id,
      {
        $addToSet: {
          subjects: { $each: subjectsToAdd },
        },
      },
      { new: true } // returns the updated document
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    // Clean up sensitive info
    delete updatedUser.password;
    delete updatedUser.refreshToken;

    res.status(200).json({
      message: "Subjects updated successfully",
      updatedUser: updatedUser,
      sucess: true,
    });
  } catch (error) {
    console.error("Error updating subjects:", error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

export {
  registerInstitute,
  loginInstitute,
  logoutInstitute,
  editInstituteDetails,
};
