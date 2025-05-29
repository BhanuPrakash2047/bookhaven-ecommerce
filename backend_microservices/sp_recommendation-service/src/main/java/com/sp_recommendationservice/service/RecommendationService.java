package com.sp_recommendationservice.service;

import com.sp_recommendationservice.dto.CheckoutDTO;
import com.sp_recommendationservice.dto.RecommendationDTO;
import com.sp_recommendationservice.modal.UserPreference;
import com.sp_recommendationservice.repository.UserPreferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private UserPreferenceRepository userPreferenceRepository;

    // Popular fallback recommendations (you can make these configurable)
    private final List<String> POPULAR_GENRES = Arrays.asList("Fiction", "Mystery", "Romance", "Fantasy", "Thriller");
    private final List<String> POPULAR_AUTHORS = Arrays.asList("Stephen King", "J.K. Rowling", "Agatha Christie");
    private final List<String> POPULAR_PUBLISHERS = Arrays.asList("Penguin", "Harper Collins", "Random House");

    /**
     * Process checkout event and update user preferences
     */
    public void processCheckoutEvent(CheckoutDTO checkoutDTO) {
        String username = checkoutDTO.getUsername();

        // Process each book in the checkout
        for (CheckoutDTO.BookDTO book : checkoutDTO.getBooks()) {
            // Calculate weight based on recency (checkout happened now, so weight = 1.0)
            double weight = 1.0;

            // Update genre preference
            updatePreference(username, "GENRE", book.getGenre(), weight);

            // Update author preference
            updatePreference(username, "AUTHOR", book.getAuthor(), weight);

            // Update publisher preference
            updatePreference(username, "PUBLISHER", book.getPublisher(), weight);
        }
    }

    /**
     * Update user preference with weighted scoring
     */
    private void updatePreference(String username, String type, String value, double weight) {
        if (value == null || value.trim().isEmpty()) {
            return; // Skip if value is null or empty
        }

        Optional<UserPreference> existingPreference =
                userPreferenceRepository.findByUsernameAndPreferenceTypeAndPreferenceValue(username, type, value);

        if (existingPreference.isPresent()) {
            // Update existing preference
            UserPreference preference = existingPreference.get();
            preference.setScore(preference.getScore() + weight);
            preference.setLastUpdated(LocalDateTime.now());
            userPreferenceRepository.save(preference);
        } else {
            // Create new preference
            UserPreference newPreference = new UserPreference(username, type, value, weight);
            userPreferenceRepository.save(newPreference);
        }
    }

    /**
     * Get recommendations for a user
     */
    public RecommendationDTO getRecommendationsForUser(String username) {
        // Get top preferences for each category
        List<String> topGenres = getTopPreferences(username, "GENRE", 5);
        List<String> topAuthors = getTopPreferences(username, "AUTHOR", 5);
        List<String> topPublishers = getTopPreferences(username, "PUBLISHER", 5);

        // If user has no preferences, return popular items
        if (topGenres.isEmpty() && topAuthors.isEmpty() && topPublishers.isEmpty()) {
            System.out.println("empty not working");
            return new RecommendationDTO(
                    POPULAR_GENRES.subList(0, Math.min(3, POPULAR_GENRES.size())),
                    POPULAR_AUTHORS.subList(0, Math.min(3, POPULAR_AUTHORS.size())),
                    POPULAR_PUBLISHERS.subList(0, Math.min(3, POPULAR_PUBLISHERS.size())),
                    "New user - showing popular recommendations"
            );
        }

        // Fill with popular items if needed
        fillWithPopularItems(topGenres, POPULAR_GENRES, 3);
        fillWithPopularItems(topAuthors, POPULAR_AUTHORS, 3);
        fillWithPopularItems(topPublishers, POPULAR_PUBLISHERS, 3);

        return new RecommendationDTO(topGenres, topAuthors, topPublishers, "Personalized recommendations");
    }

    /**
     * Get top N preferences for a user by type
     */
    private List<String> getTopPreferences(String username, String type, int limit) {
        List<UserPreference> preferences = userPreferenceRepository.findTopPreferences(
                username,
                type,
                PageRequest.of(0, limit) // ✅ This is important
        );

        return preferences.stream()
                .map(UserPreference::getPreferenceValue)
                .collect(Collectors.toList());
    }


    /**
     * Fill list with popular items if it's not full
     */
    private void fillWithPopularItems(List<String> currentList, List<String> popularItems, int targetSize) {
        for (String item : popularItems) {
            if (currentList.size() >= targetSize) break;
            if (!currentList.contains(item)) {
                currentList.add(item);
            }
        }
    }

    /**
     * Apply time-based weight decay (call this periodically if needed)
     */
    public void applyTimeDecay() {
        List<UserPreference> allPreferences = userPreferenceRepository.findAll();

        for (UserPreference preference : allPreferences) {
            long daysSinceUpdate = ChronoUnit.DAYS.between(preference.getLastUpdated(), LocalDateTime.now());

            double decayFactor;
            if (daysSinceUpdate <= 30) {
                decayFactor = 1.0; // Recent
            } else if (daysSinceUpdate <= 90) {
                decayFactor = 0.7; // Medium age
            } else {
                decayFactor = 0.4; // Old
            }

            // Only update if decay factor has changed significantly
            if (Math.abs(preference.getScore() - (preference.getScore() * decayFactor)) > 0.1) {
                preference.setScore(preference.getScore() * decayFactor);
                userPreferenceRepository.save(preference);
            }
        }
    }
}