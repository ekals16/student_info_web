package com.example.student_info_backend;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String host;
    private String category;
    private String target;

    @JsonProperty("image")
    private String imageUrl;

    @JsonProperty("application_period")
    private String applicationPeriod;

    @JsonProperty("evaluation_period")
    private String evaluationPeriod;

    @JsonProperty("activity_period")
    private String activityPeriod;

    private String location;
    private String benefits;
    private String prize;

    @JsonProperty("source")
    private String sourceUrl;

    @JsonProperty("application_method")
    private String applicationMethod;

    @JsonProperty("apply")
    private String applyUrl;

    @JsonProperty("entry_fee")
    private String entryFee;

    private String keyword;
	@CreationTimestamp
    private LocalDateTime cTime;

    public Document() {}

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getHost() { return host; }
    public String getCategory() { return category; }
    public String getTarget() { return target; }
    public String getImageUrl() { return imageUrl; }
    public String getApplicationPeriod() { return applicationPeriod; }
    public String getEvaluationPeriod() { return evaluationPeriod; }
    public String getActivityPeriod() { return activityPeriod; }
    public String getLocation() { return location; }
    public String getBenefits() { return benefits; }
    public String getPrize() { return prize; }
    public String getSourceUrl() { return sourceUrl; }
    public String getApplicationMethod() { return applicationMethod; }
    public String getApplyUrl() { return applyUrl; }
    public String getEntryFee() { return entryFee; }
    public String getKeyword() { return keyword; }
    public LocalDateTime getCTime() { return cTime; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setHost(String host) { this.host = host; }
    public void setCategory(String category) { this.category = category; }
    public void setTarget(String target) { this.target = target; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setApplicationPeriod(String applicationPeriod) { this.applicationPeriod = applicationPeriod; }
    public void setEvaluationPeriod(String evaluationPeriod) { this.evaluationPeriod = evaluationPeriod; }
    public void setActivityPeriod(String activityPeriod) { this.activityPeriod = activityPeriod; }
    public void setLocation(String location) { this.location = location; }
    public void setBenefits(String benefits) { this.benefits = benefits; }
    public void setPrize(String prize) { this.prize = prize; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }
    public void setApplicationMethod(String applicationMethod) { this.applicationMethod = applicationMethod; }
    public void setApplyUrl(String applyUrl) { this.applyUrl = applyUrl; }
    public void setEntryFee(String entryFee) { this.entryFee = entryFee; }
    public void setKeyword(String keyword) { this.keyword = keyword; }
    public void setCTime(LocalDateTime cTime) { this.cTime = cTime; }
}
