package com.grabmyticket.payment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.grabmyticket.payment.config.PaymentProperties;
import com.grabmyticket.payment.security.InternalApiKeyProperties;
import com.grabmyticket.payment.security.JwtProperties;

@SpringBootApplication
@EnableConfigurationProperties({JwtProperties.class, InternalApiKeyProperties.class, PaymentProperties.class})
public class PaymentServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PaymentServiceApplication.class, args);
    }

}
