import express from "express";
import { DocumentSchema, DocumentUpdateSchema } from "../../model/schema";
import { DocumentModel } from "../../model/user";
import { authMiddleware } from "../../middleware/authMiddleware";
import { normalizeTags } from "../../utils/normalizeTags";


const router = express.Router();

//POST : Post content
router.post("/", authMiddleware, async (req, res) => {
  const parsedData = DocumentSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(411).json({ message: "Error in inputs" });
  }

  const document = parsedData.data;

  const addedDocument = await DocumentModel.create({
    ...document,
    userId: req.userId,
    tags: normalizeTags(document.tags)
  });

  res.status(200).json({ message: "Document added", document: addedDocument });
});

//GET: Get all content
router.get("/", authMiddleware, async (req, res) => {
  const docs = await DocumentModel.find({
    userId: req.userId
  });
  res.status(200).json({ documents: docs });
});

//GET document by id
router.get("/:id", authMiddleware, async (req, res) => {
  const foundDoc = await DocumentModel.findOne({
    _id: req.params.id,
    userId: req.userId
  });

  if (!foundDoc) {
    return res.status(404).json({ message: "Document not found" });
  }

  res.status(200).json({ document: foundDoc });
});

//DELETE document by id 
router.delete("/:id", authMiddleware, async (req, res) => {
  const deleted = await DocumentModel.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId
  });
  if (!deleted) {
    return res.status(404).json({ message: "Document not found" });
  }
  res.status(200).json({ message: "Deleted", document: deleted });
});

//UPDATE document by id
router.patch("/:id", authMiddleware, async (req, res) => {
  const parsedData = DocumentUpdateSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(411).json({ message: "Error in inputs" });
  }

  const updates: any = { ...parsedData.data };

  // Normalize tags only if provided
  if (updates.tags) {
    updates.tags = normalizeTags(updates.tags);
  }

  const updatedDoc = await DocumentModel.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.userId
    },
    {
      $set: updates
    },
    { new: true }
  );

  if (!updatedDoc) {
    return res.status(404).json({ message: "Document not found" });
  }

  res.status(200).json({
    message: "Document updated successfully",
    document: updatedDoc
  });
});

export default router;
