import { Button, Textarea } from "flowbite-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
export const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState("");
  const [commentError, setCommentError] = useState(null)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comments.length > 330) {
      setCommentError("Comment must be less than 369 characters");
      return}
    setCommentError(null);
    try {
      const res = await axios.post("/api/comment/create", {
        postId,
        content: comments,
        userId: currentUser._id,
      });
      if (res.status === 201) {
        setComments("");
        setCommentError(null)
      }
    } catch (error) {
      setCommentError(error.response.data.message);
    }
  };
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center flex-col gap-4">
        <h1 className="text-xl">You must be signed to comment</h1>
        <Link to="/signin" className="text-xl text-blue-500">
          Sign In
        </Link>
      </div>
    );
  }
  return (
    <div className="w-full mb-6 border border-gray-600 rounded-xl p-3">
      {currentUser && (
        <div>
          <div className="flex justify-between">
            <div className="flex mb-2 gap-2 p-2">
              <p className="text-nowrap">Signed as:</p>
              <Link
                to={`/dashboard?tab=profile`}
                className="flex max-h-6 max-w-6 gap-1"
              >
                <img
                  src={currentUser.profilePic}
                  alt={currentUser.username}
                  className="w-full h-full object-cover rounded-full"
                />
                <span className="text-blue-500 font-bold hover:underline">
                  {currentUser.username}
                </span>
              </Link>
            </div>

            {commentError && <p className="text-red-500 font-bold">{commentError}</p>}
          </div>
          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder="Write your comment here"
              className="w-full mb-2 resize-none"
              rows={3}
              maxLength={369}
              value={comments}
              onChange={(e) => {
                setComments(e.target.value);
              }}
            ></Textarea>
            <div className="flex flex-row justify-between items-center mt-4 p-2">
              <p className="text-xs ">
                {369 - comments.length} characters remaining
              </p>
              <Button
                outline
                gradientDuoTone="purpleToBlue"
                type="submit"
                className="self-end"
              >
                Post Comment
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
