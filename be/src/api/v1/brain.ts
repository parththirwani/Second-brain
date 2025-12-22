import express from "express";
import { DocumentModel } from "../../model/user";
import { generateUUID } from "../../utils/uuid";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = express.Router();

//POST : Make content sharable
router.put("/share/:id", authMiddleware, async (req, res) => {
  const doc = await DocumentModel.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });

  if (!doc.sharable) {
    doc.sharable = true;
    doc.sharableId = generateUUID();
  }

  await doc.save();

  res.json({
    sharableLink: `http://localhost:3000/api/v1/brain/${doc.sharableId}`
  });
});

//POST : Make content unsharable
router.put("/unshare/:id", authMiddleware, async (req, res) => {
  const doc = await DocumentModel.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });

  doc.sharable = false;
  doc.sharableId = undefined;
  await doc.save();

  res.json({ message: "Unshared successfully" });
});

//GET: Get shared content
router.get("/:uuid",authMiddleware, async (req, res) => {
  const doc = await DocumentModel.findOne({
    sharableId: req.params.uuid,
    sharable: true
  });

  if (!doc) {
    return res.status(404).json({ message: "Invalid link" });
  }

  res.json({ document: doc });
});

export default router;
