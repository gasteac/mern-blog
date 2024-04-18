import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button, Modal, Table } from "flowbite-react";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
export const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdtoDelete, setPostIdtoDelete] = useState("");
  const [postTitletoDelete, setPostTitletoDelete] = useState("");
  const [imageToDelete, setImageToDelete] = useState(null);
  const storage = getStorage();
  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await axios.get(
        `api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      if (res.statusText === "OK") {
        setUserPosts([...userPosts, ...res.data.posts]);
        if (res.data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `api/post/deletepost/${postIdtoDelete}/${currentUser._id}`
      );

      if (response.status === 200) {
        setUserPosts(userPosts.filter((post) => post._id !== postIdtoDelete));
        const desertRef = ref(storage, imageToDelete);
        try {
          const imgDel = await deleteObject(desertRef);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      return status(400).json({ message: error.message });
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `api/post/getposts?userId=${currentUser._id}`
        );
        if (res.statusText === "OK") {
          setUserPosts(res.data.posts);
          if (res.data.posts.length < 9) {
            setShowMore(false);
          }
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
    <div className="p-4 table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-transparent dark:scrollbar-thumb-transparent">
      {currentUser.isAdmin && userPosts.length > 0 ? (
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
                  <Table.Cell className="font-medium">
                    {post.category}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdtoDelete(post._id);
                        setPostTitletoDelete(post.title);
                        setImageToDelete(post.image);
                      }}
                      className="cursor-pointer text-red-500 font-medium hover:underline"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <span className="text-teal-500 font-medium hover:underline">
                        Edit
                      </span>
                    </Link>
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
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body className="flex items-center justify-center flex-col gap-3">
          <HiOutlineExclamationCircle className="text-red-500 text-6xl" />
          <h1 className="text-center text-2xl font-semibold">
            Delete "{postTitletoDelete}" ?
          </h1>
          <div className="flex justify-between gap-5">
            <Button
              color="failure"
              onClick={() => {
                handleDelete();
                setShowModal(false);
              }}
            >
              delete it
            </Button>
            <Button
              onClick={() => setShowModal(false)}
              gradientDuoTone="greenToBlue"
            >
              cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
