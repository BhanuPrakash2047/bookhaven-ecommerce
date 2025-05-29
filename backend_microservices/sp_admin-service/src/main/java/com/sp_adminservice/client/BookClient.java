package com.sp_adminservice.client;


import com.sp_adminservice.dto.BookDTO;
import com.sp_adminservice.dto.FAQDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@FeignClient(name = "SP-PRODUCT-SERVICE")
public interface BookClient {

    @PostMapping("/api/admin/books")
    ResponseEntity<?> createBook(@RequestBody BookDTO bookDTO);

    @PutMapping("/api/admin/books/{bookId}")
    ResponseEntity<?> updateBook(@PathVariable("bookId") Long bookId, @RequestBody BookDTO bookDTO);

    @DeleteMapping("/api/admin/books/{bookId}")
    ResponseEntity<?> deleteBook(@PathVariable("bookId") Long bookId);

    @PostMapping("/api/admin/books/{bookId}/images")
    ResponseEntity<?> uploadBookImages(
            @PathVariable("bookId") Long bookId,
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("mainImageIndex") int mainImageIndex,
            @RequestParam(value = "altTexts", required = false) List<String> altTexts);

    @PostMapping("/api/admin/books/{bookId}/faq")
    ResponseEntity<?> addFAQ(@PathVariable("bookId") Long bookId, @RequestBody FAQDTO faqDTO);
}