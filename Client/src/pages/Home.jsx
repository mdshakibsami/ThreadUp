import SearchProvider from "../contexts/search/SearchProvider";
import Banner from "../components/Banner/Banner";
import Contact from "../components/contact/Contact";
import LatestAnnouncement from "../components/latest annoucement/LatestAnnouncement";
import PopularPosts from "../components/popular posts/PopularPosts";
const Home = () => {
  return (
    <div>
      <SearchProvider>
        <Banner></Banner>
        <LatestAnnouncement></LatestAnnouncement>
        <PopularPosts></PopularPosts>

        <hr className="text-white" />
        <Contact></Contact>
      </SearchProvider>
    </div>
  );
};

export default Home;
