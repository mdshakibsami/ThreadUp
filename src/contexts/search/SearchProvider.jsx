import React, { useState } from "react";
import { SearchContext } from "./SearchContext";

const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [posts, setPosts] = useState(null);

  return (
    <SearchContext.Provider
      value={{ search, posts, setPosts, setSearch, tag, setTag }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
