package com.sp_productservice.repositories;

import com.sp_productservice.dto.GenreCountDTO;
import com.sp_productservice.modal.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    @Query("SELECT new com.sp_productservice.dto.GenreCountDTO(b.genre, COUNT(b)) FROM Book b GROUP BY b.genre")
    List<GenreCountDTO> countBooksByGenre();

    Optional<Book> findByTitle(String title);
}
