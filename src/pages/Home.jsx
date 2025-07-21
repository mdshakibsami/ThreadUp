import React from "react";
import SearchBar from "../components/Home/SearchBar/SearchBar";
import Tags from "../components/Home/Tags/Tags";
import Posts from "../components/Home/Posts/Posts";
import SearchProvider from "../contexts/search/SearchProvider";
import Announcement from "../components/Home/Announcement/Announcement";
const Home = () => {
  return (
    <div>
      <SearchProvider>
        <SearchBar></SearchBar>
        <Tags></Tags>
        <Announcement></Announcement>
        <Posts></Posts>
      </SearchProvider>
    </div>
  );
}

export default Home;
