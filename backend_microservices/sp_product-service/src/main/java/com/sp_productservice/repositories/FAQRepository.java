package com.sp_productservice.repositories;

import com.sp_productservice.modal.Book;
import com.sp_productservice.modal.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface FAQRepository extends JpaRepository<FAQ, Long> {
    List<FAQ> findByBook(Book book);
}
