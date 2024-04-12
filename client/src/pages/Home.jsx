
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <div className="h-full w-screen flex flex-col gap-5 items-center justify-center">
      <h1 className="text-5xl mb-2">
        Hey, hello{" "}
        {currentUser && (
          <span className="text-emerald-700">{currentUser.username}</span>
        )}
      </h1>

      {currentUser ? (
        <span
          className="cursor-pointer text-2xl rounded-lg text-white px-2 py-2 bg-gradient-to-r from-emerald-500 via-emerald-800 to-teal-800"
          onClick={() => navigate("/dashboard?tab=profile")}
        >
          Go to profile
        </span>
      ) : (
        <span
          className="cursor-pointer text-2xl rounded-lg text-white px-2 py-2 bg-gradient-to-r from-emerald-500 via-emerald-800 to-teal-800"
          onClick={() => navigate("/sign-up")}
        >
          {" "}
          Sign Up!
        </span>
      )}

      {!currentUser ? (
        <>
          <h1 className="text-3xl">
            This page is in progress, sorry for the mess
          </h1>
          <ul className="text-center text-lg">
            <li>You will be able to make posts and like other posts.</li>
            <li>Follow other users and see their posts.</li>
            <li>Comment on posts.</li>
            <li>Change your profile picture and username.</li>
            <li>And it will have admin functions too</li>
          </ul>
        </>
      ) : (
        ""
      )}
    </div>
  );
};
