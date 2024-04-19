import React, { useState } from "react";
import { useEffect } from "react";

import axios from "axios";
import { Table } from "flowbite-react";

import { Link } from "react-router-dom";

export const AllPosts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);

  const handleShowMore = async () => {
    const startIndex = allPosts.length;
    try {
      const res = await axios.get(`api/post/getposts?startIndex=${startIndex}`);
      if (res.statusText === "OK") {
        setTimeout(() => {
          setAllPosts([...allPosts, ...res?.data?.posts]);
        }, 200);

        if (res.data.posts.length < 5) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`api/post/getposts`);

        const { data } = res;
        if (res.status === 200) {
          setAllPosts(data.posts);
          if (data.posts.length < 5) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="p-12 table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-transparent dark:scrollbar-thumb-transparent">
      {allPosts.length > 0 ? (
        <>
          <Table hoverable className="bg-white dark:bg-slate-800 rounded-xl">
            <Table.Head>
              <Table.HeadCell className="text-nowrap">
                Post Image
              </Table.HeadCell>
              <Table.HeadCell className="text-nowrap">
                Post Title
              </Table.HeadCell>
              <Table.HeadCell className="text-nowrap">
                Date updated
              </Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {allPosts?.map((post) => (
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
                  <Table.Cell className="font-medium">
                    {post.category}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full my-5 self-center font-bold "
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <div className="w-full h-full">You have no posts yet.</div>
      )}
    </div>
  );
};
