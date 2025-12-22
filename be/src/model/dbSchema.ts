import mongoose from "mongoose";
const { Schema } = mongoose;

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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

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
    minlength: 3,  
    maxlength: 64  
  },
  description: {
    type: String,
    required: false,
    minlength: 3,
    maxlength: 300
  },
  tags: {
    type: [String],
    index: true
  },
  sharable: {
    type: Boolean,
    default: false
  },
  sharableId: {
    type: String,
    unique: true,
    sparse: true,
    required: false 
  }
});

const profileSchema = new mongoose.Schema({
  userId: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    index: true,
  },
  username: {  
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30,
    index: true,
  },
  profession: {
    type: String,
    required: false
  },
  avatar: {
    type: String,
    required: false 
  },
  socialLinks: {
    type: {
      XLink: { type: String, required: false },          
      InstagramLink: { type: String, required: false },
      Whatsapp: { type: String, required: false },       
      MediumLink: { type: String, required: false }
    },
    required: false,
    default: {},
    _id: false  
  },
  bio: {
    type: String,
    required: false,
    minlength: 3,
    maxlength: 300
  },
  publicProfile: {
    type: Boolean,
    default: false
  }
},
{ timestamps: true}
);

export const UserModel = mongoose.model("User", userSchema);
export const DocumentModel = mongoose.model("Document", documentSchema);
export const ProfileModel = mongoose.model("Profile", profileSchema);  