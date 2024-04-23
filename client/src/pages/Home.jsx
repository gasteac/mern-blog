import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Spinner } from "flowbite-react";
import axios from "axios";
import { PostCard } from "../components/PostCard";
export const Home = () => {
  const { postSlug } = useParams();
  const [recentPosts, setRecentPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const getRecentPosts = async () => {
        const res = await axios.get("/api/post/getposts?limit=9");
        if (res.status === 200) {
          setIsLoading(false);
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
      setIsLoading(false);
      console.log(error);
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
    <div className="w-screen flex flex-col gap-5 items-center justify-center mt-12">
      <h1 className="text-5xl mb-2 text-center mb-5">
        Hello{" "}
        {currentUser ? (
          <span
            onClick={() =>
              navigate(
                currentUser.isAdmin
                  ? "/dashboard?tab=profile"
                  : "/userDashboard?tab=profile"
              )
            }
            className="hiText capitalize font-bold cursor-pointer hover:brightness-150 transition duration-300 ease-in-out"
          >
            {currentUser.username}!
          </span>
        ) : (
          <span className="hiText capitalize font-bold">Visitor!</span>
        )}
      </h1>
      {currentUser && (
        <div
          onClick={() =>
            navigate(
              currentUser.isAdmin
                ? "/dashboard?tab=profile"
                : "/userDashboard?tab=profile"
            )
          }
          className="h-40 w-40 cursor-pointer rounded-full overflow-hidden shadow-black shadow-2xl hover:scale-105 transition duration-300 ease-in-out"
        >
          <img
            src={currentUser.profilePic}
            alt={currentUser.username}
            className="object-cover w-full h-full hover:scale-105 transition duration-300 ease-in-out"
          />
        </div>
      )}

      {!currentUser && (
        <span
          className="cursor-pointer text-2xl rounded-lg hiText font-semibold"
          onClick={() => navigate("/signup")}
        >
          {" "}
          Sign Up!
        </span>
      )}
      {recentPosts && (
        <div className="mt-5 flex flex-wrap items-center justify-center">
          {recentPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
      <Link to={`/all-posts`}>
        <span className="font-semibold italic text-gray-700 dark:text-gray-300 text-2xl hover:underline pb-12">
          See all posts
        </span>
      </Link>
    </div>
  );
};
