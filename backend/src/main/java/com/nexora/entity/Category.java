package com.nexora.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "categories", indexes = {
    @Index(name = "idx_category_name", columnList = "category_name", unique = true),
    @Index(name = "idx_category_slug", columnList = "slug", unique = true)
})
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @NotBlank(message = "Category name is required")
    @Column(name = "category_name", nullable = false, unique = true, length = 80)
    private String categoryName;

    @NotBlank(message = "Slug is required")
    @Column(name = "slug", nullable = false, unique = true, length = 80)
    private String slug;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_name", length = 50)
    private String iconName;

    @Column(name = "featured_image", length = 500)
    private String featuredImage;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    public Category() {
    }

    public Category(String categoryName, String slug, String description, String iconName, String featuredImage) {
        this.categoryName = categoryName;
        this.slug = slug;
        this.description = description;
        this.iconName = iconName;
        this.featuredImage = featuredImage;
        this.active = true;
    }

    // Getters and Setters
    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    public String getFeaturedImage() {
        return featuredImage;
    }

    public void setFeaturedImage(String featuredImage) {
        this.featuredImage = featuredImage;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
