package com.example.student_info_backend;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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
public class DocumentController {

    private final DocumentService service;

    public DocumentController(DocumentService service) {
        this.service = service;
    }

	// GET /api/documents
    @GetMapping
    public List<Map<String, Object>> getSummaries() {
        return service.getAll().stream()
                .map(doc -> {
                    Map<String, Object> summary = new LinkedHashMap<>();
                    summary.put("id", doc.getId());
                    summary.put("title", doc.getTitle());
                    summary.put("field", doc.getField());
                    return summary;
                })
                .collect(Collectors.toList());
    }

	// GET /api/documents/{id}
    @GetMapping("/{id}")
    public Optional<Document> getById(@PathVariable Long id) {

		return service.getById(id);
	}

	@PostMapping
	public Document save(@RequestBody Map<String, Object> body) {
		Document doc = extractDocument(body);
		return service.save(doc);
    }

	private Document extractDocument(Map<String, Object> body) {
		Document doc = new Document();

		doc.setTitle((String) body.get("title"));
		doc.setImage((String) body.get("image"));
		doc.setHost((String) body.get("host"));
		doc.setCategory((String) body.get("category"));
		doc.setTarget((String) body.get("target"));
		doc.setSubmission_period((String) body.get("submission_period"));
		doc.setEvaluation_period((String) body.get("evaluation_period"));
		doc.setLocation((String) body.get("location"));
		doc.setPrize((String) body.get("prize"));
		doc.setSource((String) body.get("source"));
		doc.setSubmission_method((String) body.get("submission_method"));
		doc.setEntry_fee((String) body.get("entry_fee"));
		Object detailsObj = body.get("details");
		if (detailsObj instanceof Map) {
			Map<String, Object> details = (Map<String, Object>) detailsObj;
			StringBuilder sb = new StringBuilder();
			for (Map.Entry<String, Object> entry : details.entrySet()) {
				sb.append(entry.getKey()).append(": ").append(entry.getValue()).append("\n");
			}
			doc.setContent(sb.toString().trim());
		}
		return doc;
	}

    @GetMapping("/search")
    public List<Document> search(@RequestParam(required = false) String keyword,
                                 @RequestParam(required = false) String category,
                                 @RequestParam(required = false) String field) {
        return service.search(keyword, category, field);
    }

	@DeleteMapping("/{id}")
	public void deleteById(@PathVariable Long id) {
		service.deleteById(id);
	}

}