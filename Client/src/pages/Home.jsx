import SearchProvider from "../contexts/search/SearchProvider";
import Banner from "../components/Home/Banner/Banner";
import Contact from "../components/contact/Contact";
import LatestAnnouncement from "../components/Home/latest annoucement/LatestAnnouncement";
import PopularPosts from "../components/Home/popular posts/PopularPosts";
import RecentPosts from "../components/Home/recent posts/RecentPosts";
import Newsletter from "../components/Home/newsletter/Newsletter";
const Home = () => {
  return (
    <div>
      <SearchProvider>
        <Banner></Banner>
        <RecentPosts></RecentPosts>
        <LatestAnnouncement></LatestAnnouncement>
        <PopularPosts></PopularPosts>
        <Newsletter></Newsletter>

        <hr className="text-white" />
        <div className="px-4 sm:px-10">
          <Contact></Contact>
        </div>
      </SearchProvider>
    </div>
  );
};

export default Home;
