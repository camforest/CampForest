package com.campforest.backend.board.repository.board;

import com.campforest.backend.board.dto.CountResponseDto;
import com.campforest.backend.board.entity.Boards;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BoardRepositoryCustom {
	Page<Boards> findByUserId(Long userId, Pageable pageable);

	Page<Boards> findByCategory(String category, Pageable pageable);

	Page<Boards> findByTitle(String title, Pageable pageable);

	void plusLikeCount(Long boardId);

	void minusLikeCount(Long boardId);

	void plusCommentCount(Long boardId);

	void minusCommentCount(Long boardId);

	Page<Boards> findSavedBoardsByUserId(Long nowId, Pageable pageable);

	CountResponseDto countAllById(Long userId);
}
