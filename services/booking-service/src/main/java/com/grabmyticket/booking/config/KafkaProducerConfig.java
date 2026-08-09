package com.grabmyticket.booking.config;

import java.util.Map;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;

/**
 * Explicit String/String producer instead of relying on Spring Boot's
 * autoconfigured KafkaTemplate<Object, Object> bean - that bean's generics
 * don't line up cleanly for injection as KafkaTemplate<String, String>, and
 * more importantly a plain String value (we serialize the payload to JSON
 * ourselves) avoids Spring Kafka's JsonSerializer stamping a __TypeId__
 * header pointing at a Java class name. A NestJS consumer has no reason to
 * know that class exists - the payload's own "eventType" field is the
 * contract, not a Kafka header. Still reads bootstrap-servers/SASL config
 * from the same spring.kafka.* properties every profile already sets.
 */
@Configuration
public class KafkaProducerConfig {

    @Bean
    public ProducerFactory<String, String> producerFactory(KafkaProperties kafkaProperties, SslBundles sslBundles) {
        Map<String, Object> props = kafkaProperties.buildProducerProperties(sslBundles);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        return new DefaultKafkaProducerFactory<>(props);
    }

    @Bean
    public KafkaTemplate<String, String> kafkaTemplate(ProducerFactory<String, String> producerFactory) {
        return new KafkaTemplate<>(producerFactory);
    }
}
