package com.example.student_info_backend;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    Optional<Document> findByTitleAndSource(String title, String source);

    @Query("SELECT d FROM Document d WHERE " +
			"(:keyword IS NULL OR d.keyword LIKE CONCAT('%', :keyword, '%')) AND "
			+
           "(:category IS NULL OR d.category = :category) AND " +
           "(:field IS NULL OR d.field = :field) " +
           "ORDER BY d.cTime DESC")
    List<Document> findByKeywordCategoryField(String keyword, String category, String field);
}
