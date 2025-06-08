package com.example.student_info_backend;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DocumentRepository extends JpaRepository<Document, Long> {

	// 제목+출처(URL)를 기준으로 중복 체크
	Optional<Document> findByTitleAndSourceUrl(String title, String sourceUrl);

	@Query("SELECT d FROM Document d WHERE " + "(:keyword IS NULL OR d.keyword LIKE CONCAT('%', :keyword, '%')) AND "
			+ "(:category IS NULL OR d.category = :category) AND "
			+ "(:title IS NULL OR d.title LIKE CONCAT('%', :title, '%')) " + "ORDER BY d.cTime DESC")
	List<Document> findByKeywordCategoryTitle(String keyword, String category, String title);
}