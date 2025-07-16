import React from "react";
import SearchBar from "../components/Home/SearchBar/SearchBar";
import Tags from "../components/Home/Tags/Tags";
import Posts from "../components/Home/Posts/Posts";

const Home = () => {
  return (
    <div>
      <SearchBar></SearchBar>
      <Tags></Tags>
      <Posts></Posts>
    </div>
  );
};

export default Home;
