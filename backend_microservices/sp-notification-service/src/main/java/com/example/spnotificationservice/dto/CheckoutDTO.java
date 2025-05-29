package com.example.spnotificationservice.dto;





import com.example.spnotificationservice.modal.Address;
import com.example.spnotificationservice.modal.Book;

import java.time.LocalDateTime;
import java.util.List;

public class CheckoutDTO {
    private String username;
    private List<BookDTO> books;
    private Address shippingAddress;
    private Integer totalAmount;
    private LocalDateTime checkoutTime;

    // Default constructor
    public CheckoutDTO() {
    }

    // Constructor with all fields
    public CheckoutDTO(String username, List<BookDTO> books, Address shippingAddress,
                       Integer totalAmount, LocalDateTime checkoutTime) {
        this.username = username;
        this.books = books;
        this.shippingAddress = shippingAddress;
        this.totalAmount = totalAmount;
        this.checkoutTime = checkoutTime;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<BookDTO> getBooks() {
        return books;
    }

    public void setBooks(List<BookDTO> books) {
        this.books = books;
    }

    public Address getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(Address shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public  Integer getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Integer totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDateTime getCheckoutTime() {
        return checkoutTime;
    }

    public void setCheckoutTime(LocalDateTime checkoutTime) {
        this.checkoutTime = checkoutTime;
    }

    // Static inner class for book details to include in checkout
    public static class BookDTO {
        private Long id;
        private String title;
        private String author;
        private Integer price;
        private int quantity;
        private byte[] image;
        private String isbn;
        private String genre;
        private String publisher;

        public byte[] getImage() {
            return image;
        }

        public void setImage(byte[] image) {
            this.image = image;
        }

        public String getGenre() {
            return genre;
        }

        public void setGenre(String genre) {
            this.genre = genre;
        }

        public String getPublisher() {
            return publisher;
        }

        public void setPublisher(String publisher) {
            this.publisher = publisher;
        }

        // Default constructor
        public BookDTO() {
        }

        // Constructor with all fields
        public BookDTO(Long id, String title, String author,byte[] image, Integer price, int quantity, String isbn,String genre,String publisher) {
            this.id = id;
            this.title = title;
            this.author = author;
            this.price = price;
            this.quantity = quantity;
            this.isbn = isbn;
            this.image=image;
            this.genre=genre;
            this.publisher=publisher;
        }

        // Static method to create BookDTO from Book entity
        public static BookDTO fromBook(Book book, int quantity) {
            return new BookDTO(
                    book.getId(),
                    book.getTitle(),
                    book.getAuthor(),
                    book.getImageBlob(),
                    book.getDiscountedPrice(),
                    quantity,
                    book.getIsbn(),
                    book.getGenre(),
                    book.getPublisher()
            );
        }

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getAuthor() {
            return author;
        }

        public void setAuthor(String author) {
            this.author = author;
        }

        public Integer getPrice() {
            return price;
        }

        public void setPrice(Integer price) {
            this.price = price;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        public String getIsbn() {
            return isbn;
        }

        public void setIsbn(String isbn) {
            this.isbn = isbn;
        }
    }
}