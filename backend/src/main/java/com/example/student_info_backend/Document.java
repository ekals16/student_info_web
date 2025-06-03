package com.example.student_info_backend;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@JsonIgnoreProperties(ignoreUnknown = true) // 선언된 변수만 사용하게 함.
@Entity
public class Document {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;
	private String image;
	private String category;
	private String target;
	private String host;
	private String field;
	private String submission_period;
	private String evaluation_period;
	private String location;
	private String prize;

	private String source;
	private String submission_method;
	private String entry_fee;
	private String keyword;
	@Column(columnDefinition = "MEDIUMTEXT")
	private String content;

	private LocalDateTime cTime; // 정렬을 위해(최신순)

	public Document() {
	}

	public Document(String title, String image, String category, String target, String host, String field,
			String submission_period, String evaluation_period, String location, String prize, String source,
			String submission_method, String entry_fee, String keyword, String content, LocalDateTime cTime) {
		super();
		this.title = title;
		this.image = image;
		this.category = category;
		this.target = target;
		this.host = host;
		this.field = field;
		this.submission_period = submission_period;
		this.evaluation_period = evaluation_period;
		this.location = location;
		this.prize = prize;
		this.source = source;
		this.submission_method = submission_method;
		this.entry_fee = entry_fee;
		this.keyword = keyword;

		this.content = content;
		this.cTime = cTime;
	}


	public Long getId() {
		return id;
	}

	public String getCategory() {
		return category;
	}

	public String getTitle() {
		return title;
	}

	public String getHost() {
		return host;
	}

	public String getField() {
		return field;
	}

	public String getContent() {
		return content;
	}

	public String getSource() {
		return source;
	}

	public String getKeyword() {
		return keyword;
	}

	public LocalDateTime getCTime() {
		return cTime;
	}
	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getSubmission_period() {
		return submission_period;
	}

	public void setSubmission_period(String submission_period) {
		this.submission_period = submission_period;
	}

	public String getEvaluation_period() {
		return evaluation_period;
	}

	public void setEvaluation_period(String evaluation_period) {
		this.evaluation_period = evaluation_period;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getPrize() {
		return prize;
	}

	public void setPrize(String prize) {
		this.prize = prize;
	}

	public String getSubmission_method() {
		return submission_method;
	}

	public void setSubmission_method(String submission_method) {
		this.submission_method = submission_method;
	}

	public String getEntry_fee() {
		return entry_fee;
	}

	public void setEntry_fee(String entry_fee) {
		this.entry_fee = entry_fee;
	}

    public void setId(Long id) { this.id = id; }
    public void setCategory(String category) { this.category = category; }
    public void setTitle(String title) { this.title = title; }
    public void setHost(String host) { this.host = host; }
    public void setField(String field) { this.field = field; }



    public void setContent(String content) { this.content = content; }
    public void setSource(String source) { this.source = source; }
    public void setKeyword(String keyword) { this.keyword = keyword; }

	public void setCTime(LocalDateTime cTime) {
		this.cTime = cTime;
	}

	public String getTarget() {
		return target;
	}

	public void setTarget(String target) {
		this.target = target;
	}

}
