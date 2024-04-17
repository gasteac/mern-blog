import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();
import { createPost, deletePost, getposts } from "../controllers/post.controller.js";

router.post("/create", verifyToken, createPost);
router.get("/getposts", getposts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletePost);

export default router;