import { useTheme } from "../context/ThemeContext";
import { useDispatch,useSelector } from "react-redux";
import { selectBooksByAuthor,selectRecommendedGenres,selectRecommendedAuthors,selectRecommendationsLoading,selectBooksByGenre,fetchRecommendations,fetchBooksByGenre,fetchBooksByAuthor } from "../store/slices/recommendationSlice";
import { useEffect } from "react";
import SectionHeader from "../components/recommendations/SectionHeader";
import HorizontalScrollContainer from "../components/recommendations/HorizontalScrollContainer";
import GenreCard from "../components/recommendations/GenreCard";
import AuthorCard from "../components/recommendations/AuthorCard";
import SkeletonCard from "../components/recommendations/SkeletonLoader";


const BookRecommendations = () => {
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  
  // Selectors
  const recommendedGenres = useSelector(selectRecommendedGenres);
  const recommendedAuthors = useSelector(selectRecommendedAuthors);
  const isLoading = useSelector(selectRecommendationsLoading);
  const booksByGenre = useSelector(selectBooksByGenre);
  const booksByAuthor = useSelector(selectBooksByAuthor);

  // Fetch recommendations on component mount
  useEffect(() => {
    dispatch(fetchRecommendations());
  }, [dispatch]);


  // Handle genre click
  const handleGenreClick = (genre) => {
if (!booksByGenre || !booksByGenre[genre] || booksByGenre[genre].length === 0) {
  dispatch(fetchBooksByGenre(genre));
}
    // You can add navigation logic here
    console.log(`Navigating to ${genre} books`);
  };

  // Handle author click
  const handleAuthorClick = (author) => {
    if (!booksByAuthor[author]) {
      dispatch(fetchBooksByAuthor(author));
    }
    // You can add navigation logic here
    console.log(`Navigating to ${author} books`);
  };

  if (isLoading) {
    return (
      <section className={`py-12 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="Recommendations"
            description="Discovering your perfect next read based on your previous purchases..."
          />
          
          {/* Genre Skeletons */}
          <div className="mb-12">
            <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Recommended Genres
            </h3>
            <HorizontalScrollContainer ariaLabel="Loading recommended genres">
              {[...Array(5)].map((_, index) => (
                <SkeletonCard key={`genre-skeleton-${index}`} />
              ))}
            </HorizontalScrollContainer>
          </div>

          {/* Author Skeletons */}
          <div className="mb-12">
            <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Recommended Authors
            </h3>
            <HorizontalScrollContainer ariaLabel="Loading recommended authors">
              {[...Array(5)].map((_, index) => (
                <SkeletonCard key={`author-skeleton-${index}`} />
              ))}
            </HorizontalScrollContainer>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader 
          title="Recommendations"
          description="Discover your perfect next read based on your previous purchases and reading preferences."
        />
        
        {/* Recommended Genres Section */}
        {recommendedGenres.length > 0 && (
          <div className="mb-12">
            <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Recommended Genres
            </h3>
            <HorizontalScrollContainer ariaLabel="Recommended book genres">
              {recommendedGenres.map((genre) => (
                <GenreCard
                  key={genre}
                  genre={genre}
                  books={!booksByGenre ? [] : booksByGenre[genre]}
                  onGenreClick={handleGenreClick}
                />
              ))}
            </HorizontalScrollContainer>
          </div>
        )}

        {/* Recommended Authors Section */}
        {recommendedAuthors.length > 0 && (
          <div className="mb-12">
            <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Recommended Authors
            </h3>
            <HorizontalScrollContainer ariaLabel="Recommended book authors">
              {recommendedAuthors.map((author) => (
                <AuthorCard
                  key={author}
                  author={author}
                  books={booksByAuthor[author]}
                  onAuthorClick={handleAuthorClick}
                />
              ))}
            </HorizontalScrollContainer>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && recommendedGenres.length === 0 && recommendedAuthors.length === 0 && (
          <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">No Recommendations Yet</h3>
            <p>Start browsing and purchasing books to get personalized recommendations!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookRecommendations;