package com.campforest.backend.config;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import com.campforest.backend.common.JwtTokenProvider;
import com.campforest.backend.filter.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtTokenProvider jwtTokenProvider;

	@Value("${cors.allowed-origin}")
	private String allowedOrigin;

	@Value("${cors.allowed-methods}")
	private String[] allowedMethods;

	@Bean
	SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
		http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.cors(cors -> cors.configurationSource(request -> {
				CorsConfiguration config = new CorsConfiguration();
				config.setAllowedOrigins(Collections.singletonList(allowedOrigin));
				config.setAllowedMethods(Arrays.asList(allowedMethods));
				config.setAllowCredentials(true);
				// TODO : 필요한 Header 만을 설정하도록 변경
				config.setAllowedHeaders(Collections.singletonList("*"));
				config.setExposedHeaders(List.of("Authorization"));
				config.setMaxAge(3600L);
				return config;
			}))
			.csrf(AbstractHttpConfigurer::disable)
			.addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class)
			.authorizeHttpRequests(requests -> requests
				.requestMatchers("/user/regist/**", "user/login", "/user/refreshToken").permitAll()
				.anyRequest().authenticated())
			.formLogin(AbstractHttpConfigurer::disable);

		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(UserDetailsService userDetailsService,
		PasswordEncoder passwordEncoder) {
		CustomUsernamePwdAuthenticationProvider authenticationProvider =
			new CustomUsernamePwdAuthenticationProvider(userDetailsService, passwordEncoder);
		log.info("authenticationProvider : {}", authenticationProvider);
		ProviderManager providerManager = new ProviderManager(authenticationProvider);
		providerManager.setEraseCredentialsAfterAuthentication(false);

		return providerManager;
	}
}
