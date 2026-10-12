package com.nexora.service;

import com.nexora.entity.Category;
import com.nexora.exception.DuplicateResourceException;
import com.nexora.exception.ResourceNotFoundException;
import com.nexora.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllActiveCategories() {
        return categoryRepository.findByActiveTrue();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
    }

    public Category getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
    }

    @Transactional
    public Category createCategory(Category category) {
        if (categoryRepository.existsByCategoryName(category.getCategoryName())) {
            throw new DuplicateResourceException("Category '" + category.getCategoryName() + "' already exists.");
        }
        return categoryRepository.save(category);
    }

    @Transactional
    public Category deactivateCategory(Long id) {
        Category category = getCategoryById(id);
        category.setActive(false);
        return categoryRepository.save(category);
    }
}
