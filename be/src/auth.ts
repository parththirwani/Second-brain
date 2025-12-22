import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"
import { UserSchema } from './schema';
import { UserModel } from './model/user';
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });


const app = express();
app.use(express.json())
const port = process.env.port || 3000;

app.post('/signup', async (req, res) => {
  const parsedData = UserSchema.safeParse(req.body)
  if (!parsedData.success) {
    res.status(411).json({ message: "Error in inputs" })
    return;
  }

  const { username, password } = parsedData.data;

  const existingUser = await UserModel.findOne({ username });

  if (existingUser) {
    res.status(403).json({ message: "User already exists with this username" })
    return
  }

  const hashedPassword = await bcrypt.hash(password,10)

  await UserModel.create({
    username: username,
    password: hashedPassword
  });

  res.status(200).json({ message: "Signed up successfully" })
});

app.post('/signin', async (req, res) => {
  const parsedData = UserSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({ message: "Invalid inputs" });
  }

  const { username, password } = parsedData.data;

  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(403).json({ message: "User does not exist" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(403).json({ message: "Incorrect password" });
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET|| "SUPER_SECRET_KEY"
  );

  res.status(200).json({message:"Signup successful", token: token });
});




app.listen(port, () => {
  console.log(`App running on ${port}`);
});
