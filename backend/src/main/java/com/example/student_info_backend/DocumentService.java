package com.example.student_info_backend;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class DocumentService {
    private final DocumentRepository repository;

    public DocumentService(DocumentRepository repository) {
        this.repository = repository;
    }

    public Document save(Document doc) {
        Optional<Document> existing = repository.findByTitleAndSource(doc.getTitle(), doc.getSource());
        return existing.orElseGet(() -> repository.save(doc));
    }

    public List<Document> getAll() {
        return repository.findAll();
    }

    public List<Document> search(String keyword, String category, String field) {
        if ((keyword == null || keyword.isEmpty()) &&
            (category == null || category.isEmpty()) &&
            (field == null || field.isEmpty())) {
            return repository.findAll();
        }
        return repository.findByKeywordCategoryField(keyword, category, field);
    }

    public Optional<Document> getById(Long id) {
        return repository.findById(id);
    }

	public void deleteById(Long id) {
		repository.deleteById(id);
	}

}
