import express from "express"
import { DocumentSchema } from "./schema"
import mongoose from "mongoose";
import { DocumentModel } from "./model/user";
const app = express()
app.use(express.json())

mongoose.connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

const normalizeTags = (tags: string[]) => {
  return [...new Set(
    tags.map(tag =>
      tag.toLowerCase().trim()
    )
  )];
};


app.post("/content",async (req,res)=>{
    const parsedData = DocumentSchema.safeParse(req.body)

    if(!parsedData.success){
        res.status(411).json({ message: "Error in inputs" })
        return;
    }

    const document = parsedData.data;
    const normalizedTags = normalizeTags(document.tags);
    
    const addedDocument = await DocumentModel.create({
        title: document.title,
        link: document.link,
        type: document.type,
        tags: normalizedTags
    })

    res.status(200).json({message: `Document added ${addedDocument}`})
})

app.get("/content", async (req, res) => {
  try {
    const allDocuments = await DocumentModel.find({});
    
    return res.status(200).json({
      message: "All the documents retrieved",
      documents: allDocuments
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Failed to retrieve documents"
    });
  }
});

app.delete("/content/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDocument = await DocumentModel.findByIdAndDelete(id);

    if (!deletedDocument) {
      return res.status(404).json({
        message: "Document not found"
      });
    }

    return res.status(200).json({
      message: "Document deleted successfully",
      document: deletedDocument
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Failed to delete document"
    });
  }
});


app.listen(3000)