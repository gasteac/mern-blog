import { Button } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

export const PostCard = ({ post }) => {
  return (
    <div className="group relative lg:hover:scale-105  transition-all ease-in-out duration-150 rounded-3xl m-5 overflow-hidden shadow-lg">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt={post.title}
          className="w-screen rounded-xl h-52 lg:w-96 lg:h-96 object-cover transition-all ease-in-out duration-150"
        />

        <p className="line-clamp-1 font-bold text-white text-xl absolute bottom-8 p-4">
          {post.title}
        </p>
        <p className=" text-white text-sm absolute line-clamp-1 bottom-2 p-4">
          {post.content}
        </p>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-90 rounded-3xl lg:group-hover:bg-black lg:group-hover:bg-opacity-40 " />
        <Button
          pill
          color={'gray'}
          className="absolute shadow-2xl top-[40%] left-[50%] -translate-x-[50%] -translate-y-[50%]  lg:top-[50px] lg:left-[-100px] lg:group-hover:scale-[1.5]  border-none  lg:group-hover:-translate-x-[50%] lg:group-hover:-translate-y-[50%] lg:group-hover:top-[50%] lg:group-hover:left-[50%] lg:transition-all lg:ease-out lg:duration-150 hover:!scale-[1.33]"
        >
          See more
        </Button>
      </Link>
    </div>
  );
};
