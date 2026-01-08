import mongoose from "mongoose";
import { MONGODB_URI } from "./constants";

// Establish a connection to MongoDB using the URI from constants.
export const dbConnection = async () => {
  try {
    // Connect to the database
    const conn = await mongoose.connect(MONGODB_URI as string);
    // Log the host of the connected MongoDB instance
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log any connection errors
    console.error("MongoDB connection error:", error);
  }
};
