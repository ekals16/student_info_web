package com.example.student_info_backend;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

@Service
public class DocumentService {
    private final DocumentRepository repository;

	private static final Set<String> CONTEST_CATEGORIES = Set.of("문학·문예", "네이밍·슬로건", "학문·과학·IT", "스포츠", "미술·디자인·웹툰",
			"음악·콩쿠르·댄스", "사진·영상·영화제", "아이디어·건축·창업", "요리·뷰티·배우·오디션", "The 다양한분야");

	private static final Set<String> ACTIVITY_CATEGORIES = Set.of("서포터즈·기사단", "체험·탐방·봉사·동아리", "서평단·참여단·평가단·자문단",
			"기획·홍보·마케팅", "교육·강연·멘토링·세미나", "전시·박람·행사·축제", "The 다양한대외활동");
    public DocumentService(DocumentRepository repository) {
        this.repository = repository;
    }

	public Document save(Document doc) {
		if (CONTEST_CATEGORIES.contains(doc.getCategory())) {
			doc.setCode("030110001");
		} else if (ACTIVITY_CATEGORIES.contains(doc.getCategory())) {
			doc.setCode("040110001");
		}

		Optional<Document> existing = repository.findByTitleAndSourceUrl(doc.getTitle(), doc.getSourceUrl());
        return existing.orElseGet(() -> repository.save(doc));
    }


	public List<Document> search(String keyword, String category, String title) {
		return repository.findByKeywordCategoryTitle(keyword, category, title);
	}

    public List<Document> saveAll(List<Document> docs) {
        return repository.saveAll(docs);
    }

    public List<Document> getAll() {
        return repository.findAll();
    }

    public Optional<Document> getById(Long id) {
        return repository.findById(id);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
