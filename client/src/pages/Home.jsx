import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <div className="w-screen flex flex-col gap-5 items-center justify-center mt-12">
      <h1 className="text-5xl mb-2 text-center">
        Hello{" "}
        {currentUser ? (
          <span className="hiText capitalize font-bold">
            {currentUser.username}!
          </span>
        ) : (
          <span className="hiText capitalize font-bold">Visitor!</span>
        )}
      </h1>
      {currentUser &&   <div className="h-80 w-80  rounded-full overflow-hidden">
        <img src={currentUser.profilePic} alt={currentUser.username}  className="object-cover w-full h-full"/>
      </div>}
    
      {!currentUser ? (
        <>
          <h1 className="text-3xl">
            This page is still in progress
          </h1>
        
        </>
      ) : (
        ""
      )}
      {currentUser ? (
        <span
          className="cursor-pointer text-2xl rounded-lg hiText font-semibold"
          onClick={() => navigate(currentUser.isAdmin ? '/dashboard?tab=profile' : '/userDashboard?tab=profile')}
        >
          Go to profile
        </span>
      ) : (
        <span
          className="cursor-pointer text-2xl rounded-lg hiText font-semibold"
          onClick={() => navigate("/signup")}
        >
          {" "}
          Sign Up!
        </span>
      )}
    </div>
  );
};
