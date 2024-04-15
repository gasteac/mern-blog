import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
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

  return <div>DashPost</div>;
};
