package com.campforest.backend.board.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.campforest.backend.board.dto.BoardRequestDto;
import com.campforest.backend.board.dto.BoardResponseDto;
import com.campforest.backend.board.dto.CommentRequestDto;
import com.campforest.backend.board.dto.CommentResponseDto;
import com.campforest.backend.board.entity.Boards;
import com.campforest.backend.board.entity.Comment;
import com.campforest.backend.board.entity.CommentLikes;
import com.campforest.backend.board.entity.Likes;
import com.campforest.backend.board.entity.Save;
import com.campforest.backend.board.repository.BoardRepository;
import com.campforest.backend.board.repository.CommentLikeRepository;
import com.campforest.backend.board.repository.CommentRepository;
import com.campforest.backend.board.repository.LikeRepository;
import com.campforest.backend.board.repository.SaveRepository;

import jakarta.transaction.Transactional;

@Service
public class BoardServiceImpl implements BoardService {
	private final BoardRepository boardRepository;
	private final LikeRepository likeRepository;
	private final SaveRepository saveRepository;
	private final CommentRepository commentRepository;
	private final CommentLikeRepository commentLikeRepository;

	public BoardServiceImpl(BoardRepository boardRepository, LikeRepository likeRepository,
		SaveRepository saveRepository, CommentRepository commentRepository,
		CommentLikeRepository commentLikeRepository) {
		this.boardRepository = boardRepository;
		this.likeRepository = likeRepository;
		this.saveRepository = saveRepository;
		this.commentRepository = commentRepository;
		this.commentLikeRepository = commentLikeRepository;
	}

	@Transactional
	@Override
	public void writeBoard(BoardRequestDto boardRequestDto) {
		Boards boards = Boards.builder()
			.userId(boardRequestDto.getUserId())
			.title(boardRequestDto.getTitle())
			.content(boardRequestDto.getContent())
			.category(boardRequestDto.getCategory())
			.isBoardOpen(boardRequestDto.isBoardOpen())
			.build();
		boardRepository.save(boards);
	}

	@Transactional
	@Override
	public BoardResponseDto getBoard(Long boardId) {
		Boards boards = boardRepository.findById(boardId).orElseThrow(() -> new RuntimeException("Board not found"));
		return convertToDto(boards);
	}

	@Transactional
	@Override
	public List<BoardResponseDto> getAllBoards() {
		List<Boards> boardsList = boardRepository.findAll();
		List<BoardResponseDto> boardResponseDtos = new ArrayList<>();
		for (Boards board : boardsList) {
			BoardResponseDto dto = convertToDto(board);
			boardResponseDtos.add(dto);
		}
		return boardResponseDtos;
	}

	@Override
	public List<BoardResponseDto> getUserBoards(Long userId) {
		List<Boards> boardsList = boardRepository.findByUserId(userId);
		List<BoardResponseDto> boardResponseDtos = new ArrayList<>();
		for (Boards board : boardsList) {
			BoardResponseDto dto = convertToDto(board);
			boardResponseDtos.add(dto);
		}
		return boardResponseDtos;
	}

	@Override
	public List<BoardResponseDto> getCategoryBoards(String category) {
		List<Boards> boardsList = boardRepository.findByCategory(category);
		List<BoardResponseDto> boardResponseDtos = new ArrayList<>();
		for (Boards board : boardsList) {
			BoardResponseDto dto = convertToDto(board);
			boardResponseDtos.add(dto);
		}
		return boardResponseDtos;
	}

	@Transactional
	@Override
	public void modifyBoard(Long boardId, BoardRequestDto boardRequestDto) {
		boardRepository.updateBoard(
			boardId,
			boardRequestDto.getTitle(),
			boardRequestDto.getContent(),
			boardRequestDto.getCategory(),
			boardRequestDto.isBoardOpen()
		);
	}

	@Transactional
	@Override
	public void deleteBoard(Long boardId) {
		boardRepository.deleteById(boardId);
	}

	@Transactional
	@Override
	public void likeBoard(Long boardId, Long userId) {

		Likes likes = Likes.builder()
			.boardId(boardId)
			.userId(userId)
			.build();
		likeRepository.save(likes);

	}

	@Transactional
	@Override
	public void deleteLike(Long boardId, Long userId) {
		likeRepository.deleteByBoardIdAndUserId(boardId, userId);
	}

	@Transactional
	@Override
	public boolean checkLike(Long boardId, Long userId) {
		return likeRepository.existsByBoardIdAndUserId(boardId, userId);
	}

	@Transactional
	@Override
	public void saveBoard(Long boardId, Long userId) {
		Save save = Save.builder()
			.boardId(boardId)
			.userId(userId)
			.build();
		saveRepository.save(save);
	}

	@Transactional
	@Override
	public void deleteSave(Long boardId, Long userId) {
		saveRepository.deleteByBoardIdAndUserId(boardId, userId);
	}

	@Transactional
	@Override
	public boolean checkSave(Long boardId, Long userId) {
		return saveRepository.existsByBoardIdAndUserId(boardId, userId);
	}

	@Transactional
	@Override
	public void writeComment(Long boardId, CommentRequestDto commentRequestDto) {
		Comment comment = Comment.builder()
			.boardId(boardId)
			.commentWriterId(commentRequestDto.getCommentWriterId())
			.content(commentRequestDto.getContent())
			.build();
		commentRepository.save(comment);
	}

	@Transactional
	@Override
	public List<CommentResponseDto> getComment(Long boardId) {
		List<Comment> commentList = commentRepository.findAllByBoardId(boardId);
		List<CommentResponseDto> commentResponseDtos = new ArrayList<>();
		for (Comment comment : commentList) {
			CommentResponseDto dto = convertToCommentDto(comment);
			commentResponseDtos.add(dto);
		}
		return commentResponseDtos;
	}

	@Transactional
	@Override
	public List<CommentResponseDto> getUserComment(Long commentWriterId) {
		List<Comment> commentList = commentRepository.findByCommentWriterId(commentWriterId);
		List<CommentResponseDto> commentResponseDtos = new ArrayList<>();
		for (Comment comment : commentList) {
			CommentResponseDto dto = convertToCommentDto(comment);
			commentResponseDtos.add(dto);
		}
		return commentResponseDtos;
	}

	@Transactional
	@Override
	public void deleteComment(Long commentId) {
		commentRepository.deleteById(commentId);
	}

	@Transactional
	@Override
	public Long countBoardComment(Long boardId) {
		return commentRepository.countAllByBoardId(boardId);
	}

	@Transactional
	@Override
	public Long countBoardLike(Long boardId) {
		return likeRepository.countAllByBoardId(boardId);
	}

	@Transactional
	@Override
	public void likeComment(Long commentId, Long userId) {

		CommentLikes commentLikes = CommentLikes.builder()
			.commentId(commentId)
			.userId(userId)
			.build();
		commentLikeRepository.save(commentLikes);
	}

	@Transactional
	@Override
	public void deleteCommentLike(Long commentLike, Long userId) {
		commentLikeRepository.deleteByCommentIdAndUserId(commentLike, userId);
	}

	@Transactional
	@Override
	public boolean checkCommentLike(Long commentLike, Long userId) {
		return commentLikeRepository.existsByCommentIdAndUserId(commentLike, userId);
	}

	@Transactional
	@Override
	public Long countCommentLike(Long commentId) {
		return commentLikeRepository.countAllByCommentId(commentId);
	}

	private BoardResponseDto convertToDto(Boards boards) {
		BoardResponseDto dto = new BoardResponseDto();
		dto.setBoardId(boards.getBoardId());
		dto.setUserId(boards.getUserId());
		dto.setTitle(boards.getTitle());
		dto.setContent(boards.getContent());
		dto.setCategory(boards.getCategory());
		dto.setLikeCount(boards.getLikeCount());
		dto.setBoardOpen(boards.isBoardOpen());
		dto.setCreatedAt(boards.getCreatedAt());
		dto.setModifiedAt(boards.getModifiedAt());
		return dto;
	}

	private CommentResponseDto convertToCommentDto(Comment comment) {
		CommentResponseDto dto = new CommentResponseDto();
		dto.setBoardId(comment.getBoardId());
		dto.setCommentId(comment.getCommentId());
		dto.setCommentWriterId(comment.getCommentWriterId());
		dto.setContent(comment.getContent());
		dto.setCreatedAt(comment.getCreatedAt());
		return dto;
	}
}

