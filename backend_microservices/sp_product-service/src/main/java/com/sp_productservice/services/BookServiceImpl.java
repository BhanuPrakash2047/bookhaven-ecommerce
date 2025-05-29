package com.sp_productservice.services;

import com.sp_productservice.dto.*;
import com.sp_productservice.modal.Book;
import com.sp_productservice.modal.FAQ;
import com.sp_productservice.modal.Image;
import com.sp_productservice.modal.RatingReview;
import com.sp_productservice.repositories.BookRepository;
import com.sp_productservice.repositories.FAQRepository;
import com.sp_productservice.repositories.ImageRepository;
import com.sp_productservice.repositories.RatingReviewRepository;
import jakarta.persistence.EntityNotFoundException;
//import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final ImageRepository imageRepository;
    private final FAQRepository faqRepository;
    private final RatingReviewRepository ratingReviewRepository;

    @Autowired
    public BookServiceImpl(
            BookRepository bookRepository,
            ImageRepository imageRepository,
            FAQRepository faqRepository,
            RatingReviewRepository ratingReviewRepository) {
        this.bookRepository = bookRepository;
        this.imageRepository = imageRepository;
        this.faqRepository = faqRepository;
        this.ratingReviewRepository = ratingReviewRepository;
    }

    @Override
    @Transactional
    public BookDTO createBook(BookDTO bookDTO) {
        Book book = convertToEntity(bookDTO);

        // Set timestamps
        LocalDateTime now = LocalDateTime.now();
        book.setCreatedAt(now);
        book.setUpdatedAt(now);

        Book savedBook = bookRepository.save(book);
        return convertToDTO(savedBook);
    }

    @Override
    @Transactional
    public BookDTO updateBook(String id, BookDTO bookDTO) {
        String title="";
        Book existingBook = bookRepository.findByTitle(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

        // Update book fields
        existingBook.setTitle(bookDTO.getTitle());
        existingBook.setAuthor(bookDTO.getAuthor());
        existingBook.setGenre(bookDTO.getGenre());
        existingBook.setPrice(bookDTO.getPrice());
        existingBook.setQuantity(bookDTO.getQuantity());
        existingBook.setDescription(bookDTO.getDescription());
        existingBook.setYearPublished(bookDTO.getYearPublished());
        existingBook.setLanguage(bookDTO.getLanguage());
        existingBook.setPublisher(bookDTO.getPublisher());
        existingBook.setIsbn(bookDTO.getIsbn());

        // Only update imageBlob if provided
        if (bookDTO.getImageBlob() != null && bookDTO.getImageBlob().length > 0) {
            existingBook.setImageBlob(bookDTO.getImageBlob());
        }

        // Update timestamp
        existingBook.setUpdatedAt(LocalDateTime.now());

        Book updatedBook = bookRepository.save(existingBook);
        return convertToDTO(updatedBook);
    }

    @Override
    @Transactional
    public void deleteBook(String id) {
        Book book = bookRepository.findByTitle(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

        bookRepository.delete(book);
    }

    @Override
    @Transactional
    public void uploadBookImages(   String bookId, List<MultipartFile> files, int mainImageIndex, List<String> altTexts) {
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("No image files provided");
        }

        Book book = bookRepository.findByTitle(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + bookId));

        // Process the first image as the main card image for the book
        try {
            if (files.size() > 0) {
                book.setImageBlob(files.get(0).getBytes());
                book.setUpdatedAt(LocalDateTime.now());
                bookRepository.save(book);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to process main image: " + e.getMessage());
        }

        // Reset existing main image if there are existing images
        if (mainImageIndex >= 0 && mainImageIndex < files.size()) {
            List<Image> existingImages = book.getImages();
            if (existingImages != null) {
                for (Image img : existingImages) {
                    img.setMain(false);
                }
            }
        }

        // Process all images
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);

            try {
                Image image = new Image();
                image.setBook(book);
                image.setImageBlob(file.getBytes());
                image.setMain(i == mainImageIndex);
                image.setCreatedAt(LocalDateTime.now());

                // Set alt text if provided
                if (altTexts != null && i < altTexts.size()) {
                    image.setAltText(altTexts.get(i));
                } else {
                    image.setAltText("Image for " + book.getTitle());
                }

                imageRepository.save(image);
            } catch (IOException e) {
                throw new RuntimeException("Failed to process image: " + e.getMessage());
            }
        }
    }

    @Override
    @Transactional
    public FAQDTO addFAQ(String bookId, FAQDTO faqDTO) {
        Book book = bookRepository.findByTitle(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + bookId));

        FAQ faq = new FAQ();
        faq.setBook(book);
        faq.setQuestion(faqDTO.getQuestion());
        faq.setAnswer(faqDTO.getAnswer());
        faq.setCreatedAt(LocalDateTime.now());

        FAQ savedFAQ = faqRepository.save(faq);

        return convertToFAQDTO(savedFAQ);
    }

    private Book convertToEntity(BookDTO bookDTO) {
        Book book = new Book();
        book.setTitle(bookDTO.getTitle());
        book.setAuthor(bookDTO.getAuthor());
        book.setGenre(bookDTO.getGenre());
        book.setPrice(bookDTO.getPrice());
        book.setQuantity(bookDTO.getQuantity());
        book.setDescription(bookDTO.getDescription());
        book.setYearPublished(bookDTO.getYearPublished());
        book.setLanguage(bookDTO.getLanguage());
        book.setPublisher(bookDTO.getPublisher());
        book.setIsbn(bookDTO.getIsbn());
        book.setDiscountedPrice(bookDTO.getDiscountedPrice());
        book.setTag(bookDTO.getTag());
        book.setAverageRating(bookDTO.getAverageRating());
        book.setTotalRatings(1);
        System.out.println("this is isbn"+book.getDescription());
        book.setImageBlob(bookDTO.getImageBlob());
        return book;
    }

    private BookDTO convertToDTO(Book book) {
        BookDTO bookDTO = new BookDTO();
        bookDTO.setId(book.getId());
        bookDTO.setTitle(book.getTitle());
        bookDTO.setAuthor(book.getAuthor());
        bookDTO.setGenre(book.getGenre());
        bookDTO.setPrice(book.getPrice());
        bookDTO.setQuantity(book.getQuantity());
        bookDTO.setDescription(book.getDescription());
        bookDTO.setYearPublished(book.getYearPublished());
        bookDTO.setLanguage(book.getLanguage());
        bookDTO.setPublisher(book.getPublisher());
        bookDTO.setIsbn(book.getIsbn());
        bookDTO.setCreatedAt(book.getCreatedAt());
        bookDTO.setUpdatedAt(book.getUpdatedAt());
        bookDTO.setImageBlob(book.getImageBlob());
        bookDTO.setTag(book.getTag());
        bookDTO.setDiscountedPrice(book.getDiscountedPrice());

        // Convert images
        List<ImageDTO> imageDTOs = new ArrayList<>();
        if (book.getImages() != null) {
            for (Image image : book.getImages()) {
                imageDTOs.add(convertToImageDTO(image));
            }
        }
        bookDTO.setImages(imageDTOs);

        // Convert FAQs
        List<FAQDTO> faqDTOs = new ArrayList<>();
        if (book.getFaqs() != null) {
            for (FAQ faq : book.getFaqs()) {
                faqDTOs.add(convertToFAQDTO(faq));
            }
        }
        bookDTO.setFaqs(faqDTOs);

        return bookDTO;
    }

    private ImageDTO convertToImageDTO(Image image) {
        ImageDTO imageDTO = new ImageDTO();
        imageDTO.setId(image.getId());
        imageDTO.setImageBlob(image.getImageBlob());
        imageDTO.setAltText(image.getAltText());
        imageDTO.setMain(image.isMain());
        imageDTO.setCreatedAt(image.getCreatedAt());
        return imageDTO;
    }

    private FAQDTO convertToFAQDTO(FAQ faq) {
        FAQDTO faqDTO = new FAQDTO();
        faqDTO.setId(faq.getId());
        faqDTO.setQuestion(faq.getQuestion());
        faqDTO.setAnswer(faq.getAnswer());
        faqDTO.setCreatedAt(faq.getCreatedAt());
        return faqDTO;
    }
    private RatingReviewDTO convertToRatingReviewDTO(RatingReview ratingReview) {
        RatingReviewDTO dto = new RatingReviewDTO();
        dto.setId(ratingReview.getId());
        dto.setUserId(ratingReview.getUserId());
        dto.setRating(ratingReview.getRating());
        dto.setReview(ratingReview.getReview());
        dto.setCreatedAt(ratingReview.getCreatedAt());
        return dto;
    }

    private BookDTO convertToFullBookDTO(Book book) {
        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setGenre(book.getGenre());
        dto.setPrice(book.getPrice());
        dto.setQuantity(book.getQuantity());
        dto.setDescription(book.getDescription());
        dto.setYearPublished(book.getYearPublished());
        dto.setLanguage(book.getLanguage());
        dto.setPublisher(book.getPublisher());
        dto.setIsbn(book.getIsbn());
        dto.setCreatedAt(book.getCreatedAt());
        dto.setUpdatedAt(book.getUpdatedAt());
        dto.setImageBlob(book.getImageBlob());
        dto.setTag(book.getTag());
        dto.setDiscountedPrice(book.getDiscountedPrice());
        dto.setTotalRatings(book.getTotalRatings());
        dto.setAverageRating(book.getAverageRating());
        return dto;
    }

    private BookDTO convertToSimpleBookDTO(Book book) {
        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setGenre(book.getGenre());
        dto.setPrice(book.getPrice());
        dto.setYearPublished(book.getYearPublished());
        dto.setImageBlob(book.getImageBlob());
        dto.setDiscountedPrice(book.getDiscountedPrice());
        dto.setTag(book.getTag());
        dto.setTotalRatings(book.getTotalRatings());
        dto.setAverageRating(book.getAverageRating());
        dto.setQuantity(book.getQuantity());
        System.out.println(dto.toString());
        return dto;
    }

    @Override
    @Transactional
    public List<BookDTO> getAllBooks(String genre, BigDecimal minPrice, BigDecimal maxPrice, Float minRating,
                                     String author, String language, Integer yearPublished) {
        // First, get all books
        List<Book> books = bookRepository.findAll();

        // Apply filters
        if (genre != null && !genre.isEmpty()) {
            books = books.stream()
                    .filter(book -> genre.equalsIgnoreCase(book.getGenre()))
                    .collect(Collectors.toList());
        }

        if (minPrice != null) {
            books = books.stream()
                    .filter(book -> book.getPrice().compareTo(minPrice) >= 0)
                    .collect(Collectors.toList());
        }

        if (maxPrice != null) {
            books = books.stream()
                    .filter(book -> book.getPrice().compareTo(maxPrice) <= 0)
                    .collect(Collectors.toList());
        }

        if (author != null && !author.isEmpty()) {
            books = books.stream()
                    .filter(book -> book.getAuthor().toLowerCase().contains(author.toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (language != null && !language.isEmpty()) {
            books = books.stream()
                    .filter(book -> language.equalsIgnoreCase(book.getLanguage()))
                    .collect(Collectors.toList());
        }

        if (yearPublished != null) {
            books = books.stream()
                    .filter(book -> book.getYearPublished() == yearPublished)
                    .collect(Collectors.toList());
        }

        // If minRating filter is applied, we need to join with rating reviews
        if (minRating != null) {
            books = books.stream()
                    .filter(book -> {
                        // Calculate average rating for this book
                        Double avgRating = ratingReviewRepository.findByBook(book).stream()
                                .filter(rr -> rr.getRating() != null)
                                .mapToDouble(RatingReview::getRating)
                                .average()
                                .orElse(0.0);
                        return avgRating >= minRating;
                    })
                    .collect(Collectors.toList());
        }

        // Convert to DTOs with minimal information for listing
        return books.stream()
                .map(this::convertToSimpleBookDTO)
                .collect(Collectors.toList());
    }
    @Override
    @Transactional
    public BookDTO getBookById(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with ID: " + bookId));
        return convertToFullBookDTO(book);
    }
    @Override
    @Transactional
    public List<ImageDTO> getBookImages(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with ID: " + bookId));

        List<Image> images = imageRepository.findByBook(book);
        return images.stream()
                .map(this::convertToImageDTO)
                .collect(Collectors.toList());
    }
    @Override
    @Transactional
    public List<FAQDTO> getBookFAQs(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with ID: " + bookId));

        List<FAQ> faqs = faqRepository.findByBook(book);
        return faqs.stream()
                .map(this::convertToFAQDTO)
                .collect(Collectors.toList());
    }
    @Override
    @Transactional
    public List<RatingReviewDTO> getBookRatingsAndReviews(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with ID: " + bookId));

        List<RatingReview> ratingReviews = ratingReviewRepository.findByBook(book);
        return ratingReviews.stream()
                .map(this::convertToRatingReviewDTO)
                .collect(Collectors.toList());
    }


    @Override
    @Transactional(readOnly = true)
    public HashMap<String, Long> getBookgenres() {
        List<GenreCountDTO> genreCounts = bookRepository.countBooksByGenre();
        HashMap<String, Long> result = new HashMap<>();

        for (GenreCountDTO dto : genreCounts) {
            result.put(dto.getGenre(), dto.getCount());
        }

        return result;
    }

}