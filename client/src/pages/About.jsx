import React from "react";
import { useSelector } from "react-redux";
export const About = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="h-full w-screen flex flex-col gap-5 items-center justify-center mt-12">
      <h1 className="text-5xl text-center">About</h1>
      {currentUser ? (
        <h1 className="text-3xl">Working on it!</h1>
      ) : (
        <h1>You're not supposed to see this.</h1>
      )}
    </div>
  );
};
