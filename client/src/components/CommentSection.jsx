import { Button, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { Comment } from "./Comment";
export const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState(null);
  const [commentMsgSuccess, setCommentMsgSuccess] = useState(null);

  useEffect(() => {
    if (comments.length > 0) return;
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/comment/getPostComments/${postId}`);
        if (res.status !== 200) {
          return;
        }
        if (res.status === 200) {
          setComments(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 369) {
      setCommentError("Comment must be less than 369 characters");
      return;
    }
    setCommentError(null);
    try {
      const res = await axios.post("/api/comment/create", {
        postId,
        content: comment,
        userId: currentUser._id,
      });
      if (res.status === 201) {
        setComment("");
        setCommentError(null);
        setComments([res.data, ...comments])
        setCommentMsgSuccess("Comment posted!")
        setTimeout(() => {
          setCommentMsgSuccess(null)
        }, 1000);
      }
    } catch (error) {
      setCommentError(error);
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
         <div className="flex justify-between mb-4">
           <div className="flex gap-2 items-center">
             <p>Signed in as:</p>
             <Link
               to={`/dashboard?tab=profile`}
               className="flex items-center gap-2"
             >
               <img
                 src={currentUser.profilePic}
                 alt={currentUser.username}
                 className="w-6 h-6 object-cover rounded-full"
               />
               <span className="text-blue-500 font-bold hover:underline">
                 {currentUser.username}
               </span>
             </Link>
           </div>

           {commentError && (
             <p className="text-red-500 ">{commentError}</p>
           )}
           {commentMsgSuccess && (
             <p className="text-green-500 ">{commentMsgSuccess}</p>
           )}
         </div>
       )}

       <form onSubmit={handleSubmit}>
         <Textarea
           placeholder="Write your comment here"
           className="w-full mb-2 resize-none"
           rows={3}
           maxLength={369}
           value={comment}
           onChange={(e) => setComment(e.target.value)}
         />
         <div className="flex justify-between items-center mt-4">
           <p className="text-xs">
             {369 - comment.length} characters remaining
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
      <hr className="m-6"/>
       {comments?.length === 0 ? (
         <p className="text-sm my-5">No comments yet</p>
       ) : (
         <div className="flex flex-col h-full">
           {comments?.map((comment) => (
             <Comment comment={comment} key={comment._id}/>
           ))}
         </div>
       )}
     </div>
   );
};

