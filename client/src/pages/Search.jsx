import React from 'react'
import { useLocation } from "react-router-dom";
export const Search = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
  return <div className="min-h-screen ">{searchTermFromUrl}</div>;
}
