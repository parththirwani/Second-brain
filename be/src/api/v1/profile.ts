import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { DocumentModel, ProfileModel, UserModel } from "../../model/dbSchema";
import { ProfileUpdateSchema, ProfileStatusSchema } from "../../model/schema";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const profile = await ProfileModel.findOne({ userId })
      .select("-__v")
      .lean();
    if (!profile) {
      return res.status(500).json({ success: false, message: "Profile not found" });
    }

    const documents = await DocumentModel.find({ userId })
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    res.status(200).json({
      success: true,
      profile,
      documents: documents || [],
      totalDocuments: documents.length,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /profile - Update own profile
router.put("/", authMiddleware, async (req, res) => {
  const parsedData = ProfileUpdateSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid input data",
      errors: parsedData.error.format(),
    });
  }

  const updateProfileData = parsedData.data;

  try {
    const userId = req.userId;

    // Always sync username from UserModel
    const user = await UserModel.findById(userId).select("username").lean();
    if (!user?.username) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Enforce correct username
    updateProfileData.username = user.username;

    const updatedProfile = await ProfileModel.findOneAndUpdate(
      { userId },
      { $set: updateProfileData },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    )
      .select("-__v")
      .lean();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /profile/visibility - Toggle public/private
router.put("/visibility", authMiddleware, async (req, res) => {
  const parsedData = ProfileStatusSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({ success: false, message: "Invalid input data" });
  }

  const { publicProfile } = parsedData.data;

  try {
    const userId = req.userId;

    await ProfileModel.updateOne(
      { userId },
      { publicProfile },
      { upsert: true }
    );

    // Fetch fresh profile with username
    const profile = await ProfileModel.findOne({ userId })
      .select("username publicProfile")
      .lean();

    if (!profile?.username) {
      return res.status(500).json({ success: false, message: "Username not found" });
    }

    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const sharableLink = publicProfile
      ? `${baseUrl}/profile/${profile.username}`
      : null;

    res.status(200).json({
      success: true,
      message: "Profile visibility updated",
      profile: {
        username: profile.username,
        publicProfile,
      },
      sharableLink,
    });
  } catch (error) {
    console.error("Profile visibility error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /profile/:username - PUBLIC: View anyone's public profile
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const profile = await ProfileModel.findOne({
      username,
      publicProfile: true,
    })
      .select("-__v")  
      .lean();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found or is private",
      });
    }

    const documents = await DocumentModel.find({
      userId: profile.userId,
      sharable: true,
    })
      .sort({ createdAt: -1 })
      .select("-userId -__v")
      .lean();

    const { userId, ...safeProfile } = profile;

    res.status(200).json({
      success: true,
      profile: safeProfile,        
      documents: documents || [],
      totalDocuments: documents.length,
    });
  } catch (error) {
    console.error("Public profile fetch error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;