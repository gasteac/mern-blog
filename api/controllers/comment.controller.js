import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;
    if (req.user.id !== userId) {
      return next(errorHandler(401, "Unauthorized"));
    }
    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes = comment.likes.filter((id) => id !== req.user.id);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const look4comment = await Comment.findById(req.params.commentId);
    if (req.user.id !== look4comment.userId && !req.user.isAdmin) {
      return next(errorHandler(401, "Unauthorized"));
    }
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
};
