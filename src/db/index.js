import chalk from "chalk";
import mongoose from "mongoose";
// import "dotenv/config"

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(chalk.green("Database connected Successfullly."));
  } catch (error) {
    console.log(chalk.red("Connection Failed =>", error));
    process.exit(1);
  }
};

// connectDB();
export default connectDB;
