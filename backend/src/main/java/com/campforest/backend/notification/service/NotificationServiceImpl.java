package com.campforest.backend.notification.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.notification.dto.NotificationDTO;
import com.campforest.backend.notification.model.Notification;
import com.campforest.backend.notification.model.NotificationType;
import com.campforest.backend.notification.repository.NotificationRepository;
import com.campforest.backend.user.model.Users;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

	private final NotificationRepository notificationRepository;
	private final SseEmitters sseEmitters;

	@Override
	public void createNotification(Users receiver, Users sender, NotificationType type, String message) {
		Notification notification = Notification.builder()
			.receiver(receiver)
			.sender(sender)
			.notificationType(type)
			.isRead(false)
			.message(message)
			.build();

	  	Notification saved = notificationRepository.save(notification);

		// SSE를 통해 클라이언트로 알림 전송
		sseEmitters.send(receiver.getUserId(), NotificationDTO.fromEntity(saved));
	}

	@Override
	public void createChatNotification(Users receiver, Users sender, NotificationType type, String message,
		Long roomId) {
		Notification notification = Notification.builder()
			.receiver(receiver)
			.sender(sender)
			.notificationType(type)
			.isRead(false)
			.message(message)
			.build();

		Notification saved = notificationRepository.save(notification);

		NotificationDTO dto = NotificationDTO.fromEntity(saved);
		dto.setRoomId(roomId);
		// SSE를 통해 클라이언트로 알림 전송
		sseEmitters.send(receiver.getUserId(), dto);
	}

	@Override
	@Transactional
	public int markAsRead(Users user) {
		return notificationRepository.updateAllByReceiver(user);
	}

	@Override
	public List<Notification> getAll(Users user) {
		return notificationRepository.findAllByReceiverOrderByCreatedAtDesc(user);
	}

	@Override
	public void deleteNotification(Long notificationId) {
		notificationRepository.deleteById(notificationId);
	}
}
