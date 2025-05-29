package com.sp_adminservice.Controller;


import com.sp_adminservice.client.BookClient;
import com.sp_adminservice.dto.BookDTO;
import com.sp_adminservice.dto.FAQDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/admin-proxy/books")
public class AdminBookController {

    @Autowired
    private BookClient bookClient;

    private boolean isAdmin(List<String> roles) {
        return roles.contains("ROLE_ADMIN");
    }

    @PostMapping
    public ResponseEntity<?> proxyCreateBook(@RequestBody BookDTO bookDTO, @RequestHeader("roles") List<String> roles) {
        if (!isAdmin(roles)) return ResponseEntity.status(403).body("Access denied");
        return bookClient.createBook(bookDTO);
    }

    @PutMapping("/{bookId}")
    public ResponseEntity<?> proxyUpdateBook(@PathVariable Long bookId, @RequestBody BookDTO bookDTO, @RequestHeader("roles") List<String> roles) {
        if (!isAdmin(roles)) return ResponseEntity.status(403).body("Access denied");
        return bookClient.updateBook(bookId, bookDTO);
    }

    @DeleteMapping("/{bookId}")
    public ResponseEntity<?> proxyDeleteBook(@PathVariable Long bookId, @RequestHeader("roles") List<String> roles) {
        if (!isAdmin(roles)) return ResponseEntity.status(403).body("Access denied");
        return bookClient.deleteBook(bookId);
    }

    @PostMapping("/{bookId}/images")
    public ResponseEntity<?> proxyUploadImages(
            @PathVariable Long bookId,
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "mainImageIndex", defaultValue = "0") int mainImageIndex,
            @RequestParam(value = "altTexts", required = false) List<String> altTexts,
            @RequestHeader("roles") List<String> roles) {
        if (!isAdmin(roles)) return ResponseEntity.status(403).body("Access denied");
        return bookClient.uploadBookImages(bookId, files, mainImageIndex, altTexts);
    }

    @PostMapping("/{bookId}/faq")
    public ResponseEntity<?> proxyAddFAQ(
            @PathVariable Long bookId,
            @RequestBody FAQDTO faqDTO,
            @RequestHeader("roles") List<String> roles) {
        if (!isAdmin(roles)) return ResponseEntity.status(403).body("Access denied");
        return bookClient.addFAQ(bookId, faqDTO);
    }
}
