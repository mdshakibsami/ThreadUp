import SearchProvider from "../contexts/search/SearchProvider";
import Banner from "../components/Banner/Banner";
import Contact from "../components/contact/Contact";
import LatestAnnouncement from "../components/latest annoucement/LatestAnnouncement";
const Home = () => {
  return (
    <div>
      <SearchProvider>
        <Banner></Banner>
        <LatestAnnouncement></LatestAnnouncement>
        <hr className="text-white" />
        <Contact></Contact>
      </SearchProvider>
    </div>
  );
};

export default Home;
