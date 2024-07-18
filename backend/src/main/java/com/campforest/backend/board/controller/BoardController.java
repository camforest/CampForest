package com.campforest.backend.board.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campforest.backend.board.dto.BoardRequestDto;
import com.campforest.backend.board.dto.BoardResponseDto;
import com.campforest.backend.board.dto.CommentRequestDto;
import com.campforest.backend.board.dto.CommentResponseDto;
import com.campforest.backend.board.service.BoardService;
import com.campforest.backend.common.ApiResponse;

@RestController
@RequestMapping("/board")
public class BoardController {

	@Autowired
	private BoardService boardService;

	//게시글 작성
	@PostMapping
	public ApiResponse<?> writeBoard(@RequestBody BoardRequestDto boardRequestDto) {
		 boardService.writeBoard(boardRequestDto);
		return ApiResponse.createSuccessWithNoContent("게시물 작성에 성공하였습니다.");
	}
	//게시글 상세 조회
	@GetMapping("/{boardId}")
	public ApiResponse<BoardResponseDto> getBoard(@PathVariable Long boardId) {
		BoardResponseDto board = boardService.getBoard(boardId);
		return ApiResponse.createSuccess(board,"게시글 단일 조회 성공");
	}
	//전체 게시글 조회
	@GetMapping
	public ApiResponse<List<BoardResponseDto>> getAllBoard(){
		List<BoardResponseDto> boardResponseDtoList = boardService.getAllBoards();
		return ApiResponse.createSuccess(boardResponseDtoList,"게시글 목록 조회 성공하였습니다");
	}
	//사용자별 게시글 조회
	@GetMapping("/user/{userId}")
	public ApiResponse<List<BoardResponseDto>> getUserBoard(@PathVariable Long userId){
		List<BoardResponseDto> boardResponseDtoList = boardService.getUserBoards(userId);
		return ApiResponse.createSuccess(boardResponseDtoList,"게시글 사용자별 조회에 성공하였습니다");
	}
	//게시물 수정, 현재 에러뜸
	@PutMapping(("/{boardId}"))
	public ApiResponse<?> modifyBoard(@PathVariable Long boardId,BoardRequestDto boardRequestDto){
		boardService.modifyBoard(boardId,boardRequestDto );
		System.out.println(boardRequestDto.toString());
		return ApiResponse.createSuccessWithNoContent("게시물 수정에 성공하였습니다.");
	}

	//게시글 삭제
	@DeleteMapping("/{boardId}")
	public ApiResponse<?> deleteBoard(@PathVariable Long boardId){
		System.out.println(boardId);
		 boardService.deleteBoard(boardId);
		return ApiResponse.createSuccessWithNoContent("게시글 삭제 성공하였습니다");
	}
	//게시글 좋아요, 이미 동일 boardId, userId존재하면 삭제
	@PostMapping("/like/{boardId}/{userId}")
	public ApiResponse<?> likeBoard(@PathVariable Long boardId, @PathVariable Long userId){
		if(boardService.checkLike(boardId,userId)){
			boardService.deleteLike(boardId,userId);
			return ApiResponse.createSuccessWithNoContent("게시글 좋아요 삭제 성공하였습니다");
		}
		else{
		boardService.likeBoard(boardId, userId);
		return ApiResponse.createSuccessWithNoContent("게시글 좋아요 성공하였습니다");

		}
	}
	//게시글 저장, 이미 동일 boardId, userId존재하면 삭제
	@PostMapping("/save/{boardId}/{userId}")
	public ApiResponse<?> saveBoard(@PathVariable Long boardId, @PathVariable Long userId){
		if(boardService.checkSave(boardId,userId)){
			boardService.deleteSave(boardId,userId);
			return ApiResponse.createSuccessWithNoContent("저장 삭제 성공하였습니다");
		}
		else{
			boardService.saveBoard(boardId, userId);
			return ApiResponse.createSuccessWithNoContent("게시글 저장 성공하였습니다");
		}
	}

	@PostMapping("/comment")
	public ApiResponse<?> writeComment(@RequestBody CommentRequestDto commentRequestDto){
			boardService.writeComment(commentRequestDto);
			return ApiResponse.createSuccessWithNoContent("댓글 작성 성공");
	}
	@GetMapping("/comment/{boardId}")
	public ApiResponse<List<CommentResponseDto>> getComment (@PathVariable Long boarId){
		List<CommentResponseDto> commentResponseDtos = boardService.getComment(boarId);
		return ApiResponse.createSuccess(commentResponseDtos,"댓글 게시글별 조회에 성공하였습니다");
	}
	@GetMapping("/comment/{userId}")
	public ApiResponse<List<CommentResponseDto>> getUserComment (@PathVariable Long userId){
		List<CommentResponseDto> commentResponseDtos = boardService.getUserComment(userId);
		return ApiResponse.createSuccess(commentResponseDtos,"댓글 유저별 조회에 성공하였습니다");
	}

	@DeleteMapping("/comment/{commentId}")
	public ApiResponse<?> deleteComment(@PathVariable Long commentId){
		boardService.deleteComment(commentId);
		return ApiResponse.createSuccessWithNoContent("댓글 삭제 성공하였습니다");
	}
}
