import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import axios from "axios";
import { CommentSection } from "../components/CommentSection";
import { PostCard } from "../components/PostCard";
import Tilt from "react-parallax-tilt";
export const PostPage = () => {
  const { postSlug } = useParams();
  const [post, setPost] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentPosts, setRecentPosts] = useState([]);
  const array = [1, 2, 3];

  useEffect(() => {
    try {
      const getRecentPosts = async () => {
        const res = await axios.get("/api/post/getposts?limit=4");
        if (res.status === 200) {
          setRecentPosts(res.data.posts);
          setRecentPosts((prev) =>
            prev.filter((post) => post.slug !== postSlug)
          );
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
      <main className="p-3 flex flex-col max-w-3xl mx-auto mt-5 min-h-screen ">
        <Tilt
          glareEnable
          glareBorderRadius={"1.5rem"}
          scale="0.9"
          perspective="2000"
          className="relative w-full h-96"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black opacity-90 rounded-3xl lg:group-hover:bg-black lg:group-hover:bg-opacity-40 " />
          <img
            src={post && post.image}
            alt={post && post.title}
            className="w-full h-full object-cover rounded-3xl shadow-md dark:shadow-none"
          />
          <div className="absolute top-0 left-0 w-full text-center p-4">
            <h1
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              className="text-3xl dark:text-white text-white font-bold uppercase
              lg:text-4xl drop-shadow-lg"
            >
              {post && post.title}
            </h1>
            <span
              style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 1)" }}
              className="dark:text-white text-white"
            >
              Created: {post && new Date(post.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </Tilt>

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
          <Button
            gradientDuoTone="purpleToBlue"
            outline
            className="w-full hover:brightness-90 dark:hover:brightness-115 p-1 mb-5 self-center "
          >
            See all posts
          </Button>
        </Link>
        {recentPosts && (
          <div className="mt-5 flex flex-wrap items-center justify-center">
            {recentPosts.slice(0, 3).map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
