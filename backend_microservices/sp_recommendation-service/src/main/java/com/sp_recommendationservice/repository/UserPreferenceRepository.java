
package com.sp_recommendationservice.repository;

import com.sp_recommendationservice.modal.UserPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;


@Repository
public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {

    // Find specific preference for a user
    Optional<UserPreference> findByUsernameAndPreferenceTypeAndPreferenceValue(
            String username, String preferenceType, String preferenceValue);

    @Query("SELECT up FROM UserPreference up WHERE up.username = :username AND up.preferenceType = :preferenceType ORDER BY up.score DESC")
    List<UserPreference> findTopPreferences(
            @Param("username") String username,
            @Param("preferenceType") String preferenceType,
            Pageable pageable);


    // Get top N preferences for a user by type
    @Query(value = "SELECT * FROM user_preferences WHERE username = :username AND preference_type = :type ORDER BY score DESC LIMIT :limit", nativeQuery = true)
    List<UserPreference> findTopPreferences(
            @Param("username") String username, @Param("type") String preferenceType, @Param("limit") int limit);



}