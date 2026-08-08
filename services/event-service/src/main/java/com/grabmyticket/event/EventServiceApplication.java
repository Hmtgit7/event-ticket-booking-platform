package com.grabmyticket.event;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.grabmyticket.event.security.InternalApiKeyProperties;
import com.grabmyticket.event.security.JwtProperties;

@SpringBootApplication
@EnableConfigurationProperties({JwtProperties.class, InternalApiKeyProperties.class})
public class EventServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(EventServiceApplication.class, args);
	}

}
