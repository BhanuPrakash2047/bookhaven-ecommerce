import LegendSection from '../components/home/Legend';
import PopularGenres from '../components/home/PopularGenres';
import BrowseByCategory from '../components/home/BrowseByCategory';
import SpecialOffers from '../components/home/SpecialOffers';
import Newsletter from '../components/home/NewsLetter';
import BookRecommendations from './Recommendations';

const Home = () => {
  return (
    <div className="min-h-screen">
      <LegendSection />
      <PopularGenres />
      <BrowseByCategory />
      <div className="divider">
      <BookRecommendations />
      </div>
      <SpecialOffers />
      <Newsletter />
    </div>
  );
};

export default Home;