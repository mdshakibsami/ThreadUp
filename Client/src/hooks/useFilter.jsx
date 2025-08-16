import { useContext } from "react";
import { SearchContext } from "../contexts/search/SearchContext";

// Hook to use in other components
export const useSearch = () => useContext(SearchContext);
