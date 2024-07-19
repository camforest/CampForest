package com.campforest.backend.product.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campforest.backend.product.dto.ProductDetailDto;
import com.campforest.backend.product.dto.ProductRegistDto;
import com.campforest.backend.product.dto.ProductUpdateDto;
import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.model.ProductImage;
import com.campforest.backend.product.repository.ProductImageRepository;
import com.campforest.backend.product.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

	private final ProductRepository productRepository;

	private final ProductImageRepository productImageRepository;

	public void createProduct(ProductRegistDto productRegistDto) {

		Product product = productRegistDto.toEntity();

		Product savedProduct = productRepository.save(product);

		List<ProductImage> productImages = new ArrayList<>();
		for (String imageUrl : productRegistDto.getImageUrls()) {
			ProductImage productImage = new ProductImage();
			productImage.setProduct(savedProduct);
			productImage.setImageUrl(imageUrl);
			productImages.add(productImage);
		}
		productImageRepository.saveAll(productImages);
	}

	//게시물 조회기능
	public ProductDetailDto getProduct(Long productId) {
		Product findProduct = productRepository.findById(productId)
			.orElseThrow(() -> new IllegalArgumentException("상품 없음요"));

		List<String> imageUrls = findProduct.getProductImages()
			.stream().map(productImage -> productImage.getImageUrl())
			.collect(Collectors.toList());

		return new ProductDetailDto(findProduct, imageUrls);
	}

	//게시물 수정 기능
	@Transactional
	public void updateProduct(Long productId, ProductUpdateDto productUpdateDto) {
		Product product = productRepository.findById(productId)
			.orElseThrow(() -> new IllegalArgumentException("상품 없음요"));

		product.update(productUpdateDto);

		// 기존 이미지 삭제
		productImageRepository.deleteByProductId(productId);

		// 새로운 이미지 추가
		List<ProductImage> productImages = new ArrayList<>();
		for (String imageUrl : productUpdateDto.getImageUrls()) {
			ProductImage productImage = new ProductImage();
			productImage.setProduct(product);
			productImage.setImageUrl(imageUrl);
			productImages.add(productImage);
		}
		productImageRepository.saveAll(productImages);
	}
}
