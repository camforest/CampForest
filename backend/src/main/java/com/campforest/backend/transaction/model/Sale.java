package com.campforest.backend.transaction.model;

import java.time.LocalDateTime;

import com.campforest.backend.product.model.Product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sale {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "sale_id")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_id")
	private Product product;

	@Column(name = "buyer_id")
	private Long buyerId;

	@Column(name = "seller_id")
	private Long sellerId;

	@Column(name = "requester_id")
	private Long requesterId;

	@Column(name = "receiver_id")
	private Long receiverId;

	@Enumerated(EnumType.STRING)
	@Column(name = "sale_status")
	private TransactionStatus saleStatus;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@Column(name = "modified_at")
	private LocalDateTime modifiedAt;

	@Column(columnDefinition = "boolean default false")
	private boolean confirmedByBuyer; // 추가된 필드: 구매자가 확인했는지 여부

	@Column(columnDefinition = "boolean default false")
	private boolean confirmedBySeller; // 추가된 필드: 판매자가 확인했는지 여부

	public void requestSale() {
		this.saleStatus = TransactionStatus.REQUESTED;
	}

	public void receiveSale() {
		this.saleStatus = TransactionStatus.RECEIVED;
		this.modifiedAt = LocalDateTime.now();
	}

	public void acceptSale() {
		this.saleStatus = TransactionStatus.RESERVED;
		this.modifiedAt = LocalDateTime.now();
	}

	public void confirmSale(String requestRole) {
		if ("buyer".equals(requestRole)) {
			this.confirmedByBuyer = true;
		} else if ("seller".equals(requestRole)) {
			this.confirmedBySeller = true;
		}
		this.modifiedAt = LocalDateTime.now();
	}

	public Sale toEntityInverse() {
		return Sale.builder()
			.product(this.product)
			.buyerId(this.buyerId)
			.sellerId(this.sellerId)
			.requesterId(this.receiverId)
			.receiverId(this.requesterId)
			.saleStatus(TransactionStatus.RECEIVED)
			.createdAt(LocalDateTime.now())
			.modifiedAt(LocalDateTime.now())
			.build();
	}

	public boolean isFullyConfirmed() {
		return this.confirmedByBuyer && this.confirmedBySeller;
	}
}
