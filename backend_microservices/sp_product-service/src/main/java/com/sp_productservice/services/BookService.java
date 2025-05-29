package com.sp_productservice.services;



import com.sp_productservice.dto.BookDTO;
import com.sp_productservice.dto.FAQDTO;
import com.sp_productservice.dto.ImageDTO;
import com.sp_productservice.dto.RatingReviewDTO;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;

public interface BookService {
    BookDTO createBook(BookDTO bookDTO);
    BookDTO updateBook(String id, BookDTO bookDTO);
    void deleteBook(String id);
    void uploadBookImages(String bookId, List<MultipartFile> files, int mainImageIndex, List<String> altTexts);
    FAQDTO addFAQ(String bookId, FAQDTO faqDTO);

    List<BookDTO> getAllBooks(String genre, BigDecimal minPrice, BigDecimal maxPrice, Float minRating, String author, String language, Integer yearPublished);

    BookDTO getBookById(Long bookId);

    List<FAQDTO> getBookFAQs(Long bookId);

    List<ImageDTO> getBookImages(Long bookId);

    List<RatingReviewDTO> getBookRatingsAndReviews(Long bookId);


    @Transactional
    HashMap<String,Long> getBookgenres();
}