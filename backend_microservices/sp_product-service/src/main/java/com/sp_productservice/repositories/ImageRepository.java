package com.sp_productservice.repositories;

import com.sp_productservice.modal.Book;
import com.sp_productservice.modal.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByBook(Book book);
}
