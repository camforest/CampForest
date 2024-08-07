package com.campforest.backend.user.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.kms.model.NotFoundException;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.config.s3.S3Service;
import com.campforest.backend.user.dto.request.RequestRegisterDTO;
import com.campforest.backend.user.dto.request.RequestUpdateDTO;
import com.campforest.backend.user.dto.response.ResponseFollowDTO;
import com.campforest.backend.user.model.Follow;
import com.campforest.backend.user.model.Interest;
import com.campforest.backend.user.model.UserImage;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.repository.jpa.FollowRepository;
import com.campforest.backend.user.repository.jpa.InterestRepository;
import com.campforest.backend.user.repository.jpa.UserImageRepository;
import com.campforest.backend.user.repository.jpa.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final S3Service s3Service;
	private final UserRepository userRepository;
	private final UserImageRepository userImageRepository;
	private final InterestRepository interestRepository;
	private final FollowRepository followRepository;
	private final TokenService tokenService;
	private final AuthenticationManager authenticationManager;

	@Value("${filter-server.url}")
	private String filterServerUrl;

	@Override
	@Transactional
	public void registUser(RequestRegisterDTO requestDTO) {
		Users users = requestDTO.toEntity();

		Set<Interest> interests = new HashSet<>();
		for (String interestName : requestDTO.getInterests()) {
			Interest interest = interestRepository.findByInterest(interestName);
			interests.add(interest);
		}
	    users.setInterests(interests);
		Users savedUser = userRepository.save(users);

		if(requestDTO.getProfileImage() != null) {
			UserImage userImage = UserImage.builder()
				.user(savedUser)
				.imageUrl(requestDTO.getProfileImage())
				.build();
			userImageRepository.save(userImage);
		}
	}

	@Override
	public Optional<Users> findByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	@Override
	public Optional<Users> findByUserId(Long userId) {
		return userRepository.findByUserId(userId);
	}

	@Override
	@Transactional
	public void deleteByEmail(String email) {
		Users users = userRepository.findByEmail(email)
			.orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

		userRepository.delete(users);
		tokenService.invalidateAllUserTokens(email);
	}

	@Override
	@Transactional
	public void updateUserProfile(String email, RequestUpdateDTO requestDTO, MultipartFile profileImageFile)
		throws IOException {
		Users user = userRepository.findByEmail(email)
			.orElseThrow(() -> new UsernameNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));

		if (profileImageFile != null && !profileImageFile.isEmpty()) {
			String extension = profileImageFile.getOriginalFilename().substring(profileImageFile.getOriginalFilename().lastIndexOf("."));
			String fileUrl = s3Service.upload(profileImageFile.getOriginalFilename(), profileImageFile, extension);

			UserImage userImage = user.getUserImage();
			if (userImage == null) {
				userImage = UserImage.builder()
					.user(user)
					.imageUrl(fileUrl)
					.build();
			} else {
				userImage.updateImageUrl(fileUrl);
			}
			userImageRepository.save(userImage);
			user.setUserImage(userImage);
		}

		// 관심사 엔티티 조회 및 설정
		Set<Interest> interests = new HashSet<>();
		for (String interestName : requestDTO.getInterests()) {
			Interest interest = interestRepository.findByInterest(interestName);
			interests.add(interest);
		}
		user.updateInterests(interests);
		user.updateUserInfo(requestDTO);

		userRepository.save(user);
	}

	@Override
	public Authentication authenticateUser(String email, String password) {
		return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
	}

	@Override
	@Transactional
	public void followUser(Authentication auth, Long followeeId) {
		Users follower = getUserFromAuthentication(auth);
		Users followee = userRepository.findByUserId(followeeId)
			.orElseThrow(() -> new UsernameNotFoundException("팔로우할 사용자를 찾을 수 없습니다."));

		if(follower.equals(followee)) {
			throw new IllegalArgumentException("자기 자신을 팔로우할 수 없습니다.");
		}

		if(isAlreadyFollowed(follower, followee)) {
			throw new IllegalArgumentException(ErrorCode.FOLLOW_ALREADY_EXISTS.getMessage());
		}

		Follow follow = Follow.builder()
			.follower(follower)
			.followee(followee)
			.build();

		followRepository.save(follow);
		follower.getFollowing().add(follow);
		followee.getFollowers().add(follow);
	}

	@Override
	@Transactional
	public void unfollowUser(Authentication auth, Long followeeId) {
		Users follower = getUserFromAuthentication(auth);
		Users followee = userRepository.findByUserId(followeeId)
			.orElseThrow(() -> new UsernameNotFoundException("언팔로우할 사용자를 찾을 수 없습니다."));

		Follow follow = followRepository.findByFollowerAndFollowee(follower, followee)
			.orElseThrow(() -> new IllegalArgumentException("팔로우하지 않은 사용자입니다."));

		followRepository.delete(follow);
		follower.getFollowing().remove(follow);
		followee.getFollowers().remove(follow);
	}

	@Override
	@Transactional(readOnly = true)
	public List<ResponseFollowDTO> getFollowers(Long userId) {
		return followRepository.findFollowerDTOsByUserId(userId);
	}

	@Override
	@Transactional(readOnly = true)
	public List<ResponseFollowDTO> getFollowing(Long userId) {
		return followRepository.findFollowingDTOsByUserId(userId);
	}

	@Override
	public Map<String, Object> getPythonRecommendUsers(Long userId) {
		RestTemplate restTemplate = new RestTemplate();
		String pythonUrl = filterServerUrl + userId;
		ResponseEntity<List> pythonResponse = restTemplate.getForEntity(pythonUrl, List.class);

		if (pythonResponse.getStatusCode() == HttpStatus.OK) {
			List<Map<String, Object>> responseBody = pythonResponse.getBody();
			Map<String, Object> similarUsers = new HashMap<>();
			if (responseBody != null) {
				for (Map<String, Object> userMap : responseBody) {
					String userIdFromResponse = String.valueOf(userMap.get("user_id"));
					Object commonFollowsCount = userMap.get("common_follows_count");
					similarUsers.put(userIdFromResponse, commonFollowsCount);
				}
			}
			return similarUsers;
		} else {
			return new HashMap<>();
		}
	}

	@Override
	public List<Users> findByNicknameContaining(String nickname) {
		return userRepository.findByNicknameContaining(nickname);
	}

	private Users getUserFromAuthentication(Authentication auth) {
		return userRepository.findByEmail(auth.getName())
			.orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
	}

	private boolean isAlreadyFollowed(Users follower, Users followee) {
		return followRepository.findByFollowerAndFollowee(follower, followee).isPresent();
	}
}
