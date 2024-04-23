import { set } from "mongoose";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { PostCard } from "../components/PostCard";
import { Spinner } from "flowbite-react";
export const Search = () => {
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "unselected",
  });
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const searchTermFromUrl = urlParams.get("searchTerm");
  const [searchedPosts, setSearchedPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setSearchData({
      ...searchData,
      searchTerm: searchTermFromUrl,
    });
  }, [searchTermFromUrl]);

  useEffect(() => {
    try {
      const getPosts = async () => {
        const res = await axios.get(
          `api/post/getposts?searchTerm=${searchData.searchTerm}&sort=${searchData.sort}&category=${searchData.category}`
        );
        if (res.status === 200) {
          setIsLoading(false);
          setSearchedPosts(res.data.posts)
        }
      };
      getPosts()
    } catch (error) {setIsLoading(false)}
  }, [searchData]);

    if (isLoading) {
      return (
        <div className="flex items-start justify-center mt-12 min-h-screen">
          <Spinner size="xl" />
        </div>
      );
    }
  return (
    <div className="min-h-screen ">
      <div className="mt-5 flex flex-wrap items-center justify-center">
        {searchedPosts.length !== 0 ? searchedPosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))
      : <h1 className="text-3xl mt-5">No posts found :(</h1>}
      </div>
    </div>
  );
};
