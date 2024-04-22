import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import axios from "axios";
import { CommentSection } from "../components/CommentSection";
import { PostCard } from "../components/PostCard";
export const PostPage = () => {
  const { postSlug } = useParams();
  const [post, setPost] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    try {
      const getRecentPosts = async () => {
        const res = await axios.get("/api/post/getposts?limit=4");
        if (res.status === 200) {
          setRecentPosts(res.data.posts);
          setRecentPosts((prev) =>
            prev.filter((post) => post.slug !== postSlug)
          );
          if (recentPosts.length > 3) {
            recentPosts.pop();
          }
        }
      };
      getRecentPosts();
    } catch (error) {
      console.log(error);
    }
  }, [postSlug]);

  useEffect(() => {
    try {
      const getPostBySlug = async () => {
        setIsLoading(true);
        const res = await axios.get(`/api/post/getposts?slug=${postSlug}`);
        if (res.status === 200) {
          setIsLoading(false);
          setPost(res.data.posts[0]);
        } else {
          setError("Post not found");
          setIsLoading(false);
        }
      };
      getPostBySlug();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError("Post not found");
    }
  }, [postSlug]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-12">
        <Spinner size="xl" />
      </div>
    );
  }
  return (
    <>
      <main className="p-3 flex flex-col max-w-3xl mx-auto mt-5">
        <div className="flex flex-col gap-2 items-center align-middle justify-center">
          <h1 className="text-3xl font-bold uppercase lg:text-4xl">
            {post && post.title}
          </h1>
          <span className="mb-2">
            Created: {post && new Date(post.updatedAt).toLocaleDateString()}
          </span>
          <Link to={`/search?category=${post && post.category}`}>
            <Button color="gray" pill>
              {post && post.category}
            </Button>
          </Link>
        </div>

        <img
          src={post && post.image}
          alt={post && post.title}
          className="mt-5 p-3 max-h-full w-full object-cover self-center rounded-3xl shadow-md dark:shadow-none"
        />
        <div className="mt-5 mb-5 w-[90%] self-center bg-gray-300 rounded-xl dark:bg-slate-800 p-6">
          <p>{post && post.content}</p>
        </div>
        <div className="self-center w-[90%] flex items-center justify-center">
          <CommentSection postId={post._id} />
        </div>
      </main>
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-2xl mt-2 mb-5 font-semibold">
          It may interest you
        </h1>
        <Link to={`/all-posts`}>
          <span className="font-semibold italic text-gray-500 hover:underline">See all posts</span>
        </Link>
        {recentPosts && (
          <div className="mt-5 flex flex-wrap items-center justify-center">
            {recentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
