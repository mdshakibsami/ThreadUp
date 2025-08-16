import React from "react";
import SearchProvider from "../contexts/search/SearchProvider";
import SearchBar from "../components/Home/SearchBar/SearchBar";
import Tags from "../components/Home/Tags/Tags";
import Posts from "../components/Home/Posts/Posts";

const AllPost = () => {
  return (
    <div>
      <SearchProvider>
        <SearchBar></SearchBar>
        <Tags></Tags>
        <Posts></Posts>
      </SearchProvider>
    </div>
  );
};

export default AllPost;
