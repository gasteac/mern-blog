import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
export const Comment = ({ comment }) => {
  const [user, setUser] = useState({});
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`/api/user/${comment.userId}`);
        if (res.status !== 200) {
          return;
        }
        setUser(res.data);
      } catch (error) {
        setUser({
          username: "Deleted-User",
          profilePic: "https://cdn-icons-png.flaticon.com/512/6543/6543638.png",
        });
      }
    };
    getUser();
  }, [comment]);

  return (
    <div className="flex p-2 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user?.profilePic}
          alt={user?.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="mr-1 truncate ">{user.username}</span>
          <span className="text-gray-600 dark:text-gray-400 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="pb-2">{comment.content}</p>
      </div>
    </div>
  );












};


