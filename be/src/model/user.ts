import mongoose from "mongoose";
import { maxLength, minLength, required } from "zod/mini";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 30,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Document", "Tweet", "Youtube", "Link"]
  },
  link: {
    type: String,
    required: true,
    match: [
      /^(ftp|http|https):\/\/[^ "]+$/,
      'Please enter a valid URL'
    ]
  },
  title: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 64
  },
  tags: {
  type: [String],
  index: true

}

})

export const UserModel = mongoose.model("User", userSchema);
export const DocumentModel = mongoose.model("Document", documentSchema);
