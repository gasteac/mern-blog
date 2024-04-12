import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <div className="h-full w-screen flex flex-col gap-5 items-center justify-center mt-12">
      <h1 className="text-5xl mb-2">
        Hey, hello{" "}
        {currentUser ? (
          <span className="text-emerald-700 capitalize">
            {currentUser.username}!
          </span>
        ) : (
          <span className="text-emerald-700">Visitor!</span>
        )}
      </h1>

      {currentUser ? (
        <span
          className="cursor-pointer text-2xl rounded-lg text-white px-2 py-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 rounded-xl hover:from-emerald-500 hover:via-emerald-600 hover:to-teal-500"
          onClick={() => navigate("/dashboard?tab=profile")}
        >
          Go to profile
        </span>
      ) : (
        <span
          className="cursor-pointer text-2xl rounded-lg text-white px-2 py-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 rounded-xl hover:from-emerald-500 hover:via-emerald-600 hover:to-teal-500"
          onClick={() => navigate("/sign-up")}
        >
          {" "}
          Sign Up!
        </span>
      )}

      {!currentUser ? (
        <>
          <h1 className="text-3xl">
            This page is in progress, you will be able to:
          </h1>
          <ul className="text-lg list-disc">
            <li>Have an admin account to manage the site</li>
            <li>Follow other users and see their posts.</li>
            <li>Change your profile pic, email, pass.</li>
            <li>Comment on posts and give likes.</li>
            <li>Maybe more, we'll see :)</li>
          </ul>
        </>
      ) : (
        ""
      )}
    </div>
  );
};
