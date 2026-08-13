package com.grabmyticket.booking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.grabmyticket.booking.client.EventServiceProperties;
import com.grabmyticket.booking.client.InternalApiKeyProperties;
import com.grabmyticket.booking.config.BookingProperties;
import com.grabmyticket.booking.config.PaymentConsumerProperties;
import com.grabmyticket.booking.security.JwtProperties;

@SpringBootApplication
@EnableConfigurationProperties({JwtProperties.class, InternalApiKeyProperties.class, EventServiceProperties.class, BookingProperties.class, PaymentConsumerProperties.class})
public class BookingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(BookingServiceApplication.class, args);
	}

}
