package com.example.student_info_backend;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {
    private final DocumentService service;

    public DocumentController(DocumentService service) {
        this.service = service;
    }

    @GetMapping
	public List<Map<String, Object>> getAll() {
		return service.getAll().stream().map(this::toSummary).toList();
	}

	private Map<String, Object> toSummary(Document doc) {
		return Map.of("id", doc.getId(), "title", doc.getTitle(), "category", doc.getCategory());
    }

	@GetMapping("/search")
	public List<Document> search(@RequestParam(required = false) String keyword,
			@RequestParam(required = false) String category, @RequestParam(required = false) String title) {
		return service.search(keyword, category, title);
	}

    @GetMapping("/{id}")
    public Optional<Document> getById(@PathVariable Long id) {
        return service.getById(id);
    }


    @PostMapping
    public Document save(@RequestBody Document doc) {
        return service.save(doc);
    }

    @PostMapping("/bulk")
    public List<Document> saveAll(@RequestBody List<Document> docs) {
        return service.saveAll(docs);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteById(id);
    }
}
