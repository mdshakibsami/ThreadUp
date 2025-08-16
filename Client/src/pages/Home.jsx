import React from "react";
import SearchBar from "../components/Home/SearchBar/SearchBar";
import Tags from "../components/Home/Tags/Tags";
import Posts from "../components/Home/Posts/Posts";
import SearchProvider from "../contexts/search/SearchProvider";
import Banner from "../components/Banner/Banner";
const Home = () => {
  return (
    <div>
      <SearchProvider>
        <Banner></Banner>
      </SearchProvider>
    </div>
  );
};

export default Home;
