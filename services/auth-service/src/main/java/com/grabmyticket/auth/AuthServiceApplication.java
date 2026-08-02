package com.grabmyticket.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.grabmyticket.auth.security.JwtProperties;
import com.grabmyticket.auth.security.VerificationProperties;

@SpringBootApplication
@EnableConfigurationProperties({JwtProperties.class, VerificationProperties.class})
public class AuthServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
	}

}
