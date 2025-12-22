import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserSchema } from "../../model/schema";
import { ProfileModel, UserModel } from "../../model/dbSchema";

const router = express.Router();

//POST : Signup endpoint
router.post("/signup", async (req, res) => {
  const parsed = UserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(411).json({ message: "Invalid inputs" });
  }

  const { username, password } = parsed.data;

  const exists = await UserModel.findOne({ username });
  if (exists) {
    return res.status(403).json({ message: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  await UserModel.create({ username, password: hashed });

  res.json({ message: "Signup successful" });
});

//POST : Signin endpoint
// POST /signin
router.post("/signin", async (req, res) => {
  const parsed = UserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid inputs" });
  }

  const { username, password } = parsed.data;

  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(403).json({ message: "User not found" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(403).json({ message: "Wrong password" });
  }

  await ProfileModel.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      username: user.username,  // Sync username
      publicProfile: false,     // Default to private
    },
    {
      upsert: true,             
      setDefaultsOnInsert: true 
    }
  );
  // =========================================

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || "SUPER_SECRET_KEY"
  );

  res.json({ token });
});

export default router;
