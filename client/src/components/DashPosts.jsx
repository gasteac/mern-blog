import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";
export const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `api/post/getposts?userId=${currentUser._id}`
        );
        if (res.statusText === "OK") {
          setUserPosts(res.data.posts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  return (
    <div className="p-4  table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <Table hoverable className="bg-white dark:bg-slate-800 rounded-xl">
          <Table.Head>
            <Table.HeadCell>Post Image</Table.HeadCell>
            <Table.HeadCell>Post Title</Table.HeadCell>
            <Table.HeadCell>Date updated</Table.HeadCell>

            <div className="hidden sm:block">
              <Table.HeadCell>Category</Table.HeadCell>
            </div>

            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell>Edit</Table.HeadCell>
          </Table.Head>

          {userPosts.map((post) => (
            <Table.Body key={post._id} className="divide-y-2 ">
              <Table.Row>
                <Table.Cell as="div">
                  <Link to={`/posts/${post.slug}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="min-w-20 w-32 h-auto object-cover rounded-lg"
                    />
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link className="font-medium" to={`/posts/${post.slug}`}>
                    {post.title}
                  </Link>
                </Table.Cell>
                <Table.Cell className="font-medium ">
                  {" "}
                  {new Date(post.updatedAt).toLocaleDateString()}
                </Table.Cell>

                <div className="hidden sm:block px-6 py-4">
                  <Table.Cell className="font-medium">
                    {post.category}
                  </Table.Cell>
                </div>

                <Table.Cell>
                  <Link to={`/deletepost/${post._id}`}>
                    <span className="text-red-500 font-medium hover:underline">
                      Delete
                    </span>
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/updatepost/${post._id}`}>
                    <span className="text-teal-500 font-medium hover:underline">
                      Edit
                    </span>
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      ) : (
        <div className="w-full h-full">You have no posts yet.</div>
      )}
    </div>
  );
};
