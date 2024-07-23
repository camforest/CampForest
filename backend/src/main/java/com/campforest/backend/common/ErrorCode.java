package com.campforest.backend.common;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
	// Internal Server Error
	INTERNAL_SERVER_ERROR("C001", HttpStatus.INTERNAL_SERVER_ERROR, "서버에 오류가 발생했습니다."),

	// User Error
	USER_REGISTER_FAILED("U001", HttpStatus.BAD_REQUEST, "사용자 등록에 실패했습니다."),
	USER_NOT_FOUND("U002", HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),
	PASSWORD_NOT_MATCH("U003", HttpStatus.BAD_REQUEST, "비밀번호가 일치하지 않습니다."),

	// Unauthorized
	AUTHENTICATION_FAILED("A001", HttpStatus.UNAUTHORIZED, "인증에 실패했습니다."),
	NO_JWT_TOKEN("A002", HttpStatus.UNAUTHORIZED, "JWT 토큰이 없습니다."),
	INVALID_JWT_TOKEN("A003", HttpStatus.UNAUTHORIZED, "유효하지 않은 JWT 토큰입니다."),
	ACCESS_TOKEN_EXPIRED("A004", HttpStatus.UNAUTHORIZED, "Access Token이 만료되었습니다."),
	REFRESH_TOKEN_EXPIRED("A005", HttpStatus.UNAUTHORIZED, "Refresh Token이 만료되었습니다."),
	REFRESH_TOKEN_BLACKLISTED("A006", HttpStatus.UNAUTHORIZED, "블랙리스트에 등록된 Refresh Token입니다."),

	//board
	// Board Error
	BOARD_NOT_FOUND("B001", HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."),
	BOARD_CREATION_FAILED("B002", HttpStatus.BAD_REQUEST, "게시글 작성에 실패했습니다."),
	BOARD_UPDATE_FAILED("B003", HttpStatus.BAD_REQUEST, "게시글 수정에 실패했습니다."),
	BOARD_DELETE_FAILED("B004", HttpStatus.BAD_REQUEST, "게시글 삭제에 실패했습니다."),
	INVALID_BOARD_CATEGORY("B005", HttpStatus.BAD_REQUEST, "유효하지 않은 게시글 카테고리입니다."),

	// File Error
	FILE_UPLOAD_FAILED("F001", HttpStatus.INTERNAL_SERVER_ERROR, "파일 업로드에 실패했습니다."),
	INVALID_FILE_FORMAT("F002", HttpStatus.BAD_REQUEST, "유효하지 않은 파일 형식입니다."),

	// Like Error
	LIKE_ALREADY_EXISTS("L001", HttpStatus.BAD_REQUEST, "이미 좋아요를 누른 게시글입니다."),
	LIKE_NOT_FOUND("L002", HttpStatus.NOT_FOUND, "좋아요를 찾을 수 없습니다."),

	// Save Error
	SAVE_ALREADY_EXISTS("S001", HttpStatus.BAD_REQUEST, "이미 저장한 게시글입니다."),
	SAVE_NOT_FOUND("S002", HttpStatus.NOT_FOUND, "저장된 게시글을 찾을 수 없습니다."),

	// Comment Error
	COMMENT_NOT_FOUND("C001", HttpStatus.NOT_FOUND, "댓글을 찾을 수 없습니다."),
	COMMENT_CREATION_FAILED("C002", HttpStatus.BAD_REQUEST, "댓글 작성에 실패했습니다."),
	COMMENT_DELETE_FAILED("C003", HttpStatus.BAD_REQUEST, "댓글 삭제에 실패했습니다."),

	// Comment Like Error
	COMMENT_LIKE_ALREADY_EXISTS("CL001", HttpStatus.BAD_REQUEST, "이미 좋아요를 누른 댓글입니다."),
	COMMENT_LIKE_NOT_FOUND("CL002", HttpStatus.NOT_FOUND, "댓글 좋아요를 찾을 수 없습니다."),

	// Pagination Error
	INVALID_PAGE_NUMBER("P001", HttpStatus.BAD_REQUEST, "유효하지 않은 페이지 번호입니다."),
	INVALID_PAGE_SIZE("P002", HttpStatus.BAD_REQUEST, "유효하지 않은 페이지 크기입니다."),

	// User Error (Board-related)
	USER_NOT_AUTHORIZED("UA001", HttpStatus.FORBIDDEN, "해당 작업을 수행할 권한이 없습니다.");

	private final String code;
	private final HttpStatus httpStatus;
	private final String message;
}
