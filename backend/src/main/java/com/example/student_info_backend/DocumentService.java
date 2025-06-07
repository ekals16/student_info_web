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
		Optional<Document> existing = repository.findByTitleAndSourceUrl(doc.getTitle(), doc.getSourceUrl());
        return existing.orElseGet(() -> repository.save(doc));
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
