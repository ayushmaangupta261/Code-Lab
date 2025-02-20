import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log("Successfully connected to Mongo DB");
  } catch (error) {
    console.log(`Error connecting to Mongo ${error}`);
  }
};


export default connectToDB;