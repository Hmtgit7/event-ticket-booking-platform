package com.grabmyticket.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.grabmyticket.auth.client.BookingServiceProperties;
import com.grabmyticket.auth.client.EventServiceProperties;
import com.grabmyticket.auth.client.InternalApiKeyProperties;
import com.grabmyticket.auth.config.AccountDeletionProperties;
import com.grabmyticket.auth.security.JwtProperties;
import com.grabmyticket.auth.security.VerificationProperties;

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties({
		JwtProperties.class, VerificationProperties.class,
		InternalApiKeyProperties.class, BookingServiceProperties.class, EventServiceProperties.class,
		AccountDeletionProperties.class
})
public class AuthServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
	}

}
