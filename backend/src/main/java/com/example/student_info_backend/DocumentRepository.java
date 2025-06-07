package com.example.student_info_backend;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DocumentRepository extends JpaRepository<Document, Long> {

	// 제목+출처(URL)를 기준으로 중복 체크
	Optional<Document> findByTitleAndSourceUrl(String title, String sourceUrl);

	// 키워드, 카테고리, 대상(target)으로 검색
	@Query("SELECT d FROM Document d WHERE " + "(:keyword IS NULL OR d.keyword LIKE CONCAT('%', :keyword, '%')) AND "
			+ "(:category IS NULL OR d.category = :category) AND " + "(:target IS NULL OR d.target = :target) "
			+ "ORDER BY d.cTime DESC")
	List<Document> findByKeywordCategoryTarget(String keyword, String category, String target);
}