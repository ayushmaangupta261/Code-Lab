import { Question } from "../models/question.model.js";
import { SampleCode } from "../models/sampleCode.model.js";
import { User } from "../models/user.model.js";

const getAllAssignments = async (req, res) => {
  try {
    // const { instructor } = req.body;
    const user = req.user; // decoded token is attached in req.decoded

    // console.log("req body in get assignments -> ",req.body)
    // console.log("user -> ",user)

    if (!user) {
      return res.status(400).json({
        message: "User  is missing",
        success: false,
      });
    }

    console.log("Going to fetch the user");

    // fetch the user
    const loggedInUser = await User.findById(user._id);

    console.log("loggedInUser -> ", loggedInUser);

    const assignments = await Question.find({
      createdBy: loggedInUser.instructor.toString(),
    }).populate([
      { path: "sampleCode" }, // Select relevant fields from SampleCode
      { path: "example" }, // Select relevant fields from Example
    ]);

    console.log("Assignments -> ", assignments);

    if (!assignments) {
      return res.status(404).json({
        message: "No assignments found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

export { getAllAssignments };
