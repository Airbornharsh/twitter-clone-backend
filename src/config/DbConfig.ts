import mongoose, { Error } from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bnnzqre.mongodb.net/?retryWrites=true&w=majority`
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: Error | any | unknown) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
