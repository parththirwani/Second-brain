import express from "express"
import { DocumentSchema } from "./schema"
import mongoose from "mongoose";
import { DocumentModel } from "./model/user";


import crypto from "crypto";

const generateUUID = () => {
  return crypto.randomUUID(); 
};


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

app.put ("/brain/share/:id", async (req,res)=>{
    try {
    const { id } = req.params;

    const foundDocument = await DocumentModel.findById(id);

    if(!foundDocument){
      return res.status(404).json({message : "Document not found"})
    }
    
    if(!foundDocument.sharable){
    foundDocument.sharable = true;
    foundDocument.sharableId = generateUUID();
    }

    await foundDocument.save();

    return res.status(200).json({
      message: "Document updated successfully",
      sharableLink: `http://localhost:3000/brain/${foundDocument.sharableId}`
    });

  }catch(err){
    console.error(err);
    return res.status(500).json({
      message: "Failed to update document"
    });
  }
})

app.put ("/brain/unshare/:id", async (req,res)=>{
    try {
    const { id } = req.params;

    const foundDocument = await DocumentModel.findById(id);

    if(!foundDocument){
      return res.status(404).json({message : "Document not found"})
    }
    
    if(foundDocument.sharable){
    foundDocument.sharable = false;
    foundDocument.sharableId = undefined;
    }

    await foundDocument.save();

    return res.status(200).json({
      message: "Document no longer sharable"
    });

  }catch(err){
    console.error(err);
    return res.status(500).json({
      message: "Failed to update document"
    });
  }
})

app.get("/brain/:uuid",async (req,res)=>{
    try {
    const { uuid } = req.params;

    const foundDocument = await DocumentModel.findOne({
      sharableId: uuid,
      sharable: true
    });

    if(!foundDocument){
      return res.status(404).json({message : "Invalid link"})
    }

    res.status(200).json({message: "Document retrieved", document: foundDocument})

}catch(err){
    console.error(err);
    return res.status(500).json({
      message: "Failed to get document"
    });
  }
})


app.listen(3000)