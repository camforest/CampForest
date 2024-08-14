package com.campforest.backend.chatting.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionChatRoomListDto {
	private Long roomId;
	private Long otherUserId;
	private String productImage;
	private String userProfileUrl;
	private String userNickName;
	private Long productId;
	private Long productWriter;
	private String lastMessage;
	private LocalDateTime lastMessageTime;
	private Long unreadCount;
}