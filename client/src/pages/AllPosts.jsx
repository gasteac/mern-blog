import React, { useState } from "react";
import { useEffect } from "react";

import axios from "axios";
import { Spinner, Table } from "flowbite-react";

import { Link } from "react-router-dom";

export const AllPosts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [forceRender, setForceRender] = useState(1);

  const handleShowMore = async () => {
    const numberOfPosts = userPosts.length;
    const startIndex = numberOfPosts;
    const res = await axios.get(`api/post/getposts?startIndex=${startIndex}`);
    const { data } = res;
    if (res.statusText !== "OK") {
      return;
    }
    if (res.statusText === "OK") {
      setAllPosts([...allPosts, ...data.posts]);
      if (data.posts.length < 5) {
        setShowMore(false);
      }
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`api/post/getposts`);

        const { data } = res;
        if (res.status === 200) {
          setAllPosts(data.posts);
          setLoading(false);
          if (data.posts.length < 5) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);
  if (loading) {
    return (
      <div className="flex w-full h-screen items-start justify-center mt-12">
        <Spinner size="xl" />
      </div>
    );
  }
  return (
    <div className="py-6 px-4 md:max-w-[800px] table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-transparent dark:scrollbar-thumb-transparent">
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
                    <Link to={`/post/${post.slug}`}>
                      <div className="w-32 h-20 bg-transparent">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      </div>
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
        <div className="w-full h-full text-center text-2xl">
          There are no posts yet :(
        </div>
      )}
    </div>
  );
};
