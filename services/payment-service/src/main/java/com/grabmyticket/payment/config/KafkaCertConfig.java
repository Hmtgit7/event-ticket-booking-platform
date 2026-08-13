package com.grabmyticket.payment.config;

import java.util.Collections;

import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.Environment;
import org.springframework.core.env.MapPropertySource;

/**
 * Same fix as booking-service/notification-service: KAFKA_CA_CERT is pasted
 * from the Aiven dashboard with literal "\n" escape sequences, but Kafka's
 * PEM truststore parser needs real newlines to find "-----BEGIN
 * CERTIFICATE-----". A static BeanFactoryPostProcessor runs after Environment
 * prep (dotenv included) is complete, avoiding ordering races, and publishes
 * the unescaped value as KAFKA_CA_CERT_PEM for application-local/prod.yaml to
 * reference.
 */
@Configuration
public class KafkaCertConfig {

    @Bean
    public static BeanFactoryPostProcessor kafkaCertBeanFactoryPostProcessor(Environment environment) {
        return beanFactory -> {
            if (!(environment instanceof ConfigurableEnvironment configurableEnvironment)) {
                return;
            }

            String rawCert = environment.getProperty("KAFKA_CA_CERT");
            if (rawCert == null || rawCert.isBlank()) {
                return;
            }

            String unescapedCert = rawCert.replace("\\n", "\n").trim();
            boolean hadWrappingQuotes = (unescapedCert.startsWith("'") && unescapedCert.endsWith("'"))
                    || (unescapedCert.startsWith("\"") && unescapedCert.endsWith("\""));
            if (hadWrappingQuotes) {
                unescapedCert = unescapedCert.substring(1, unescapedCert.length() - 1);
            }

            configurableEnvironment.getPropertySources().addFirst(
                    new MapPropertySource(
                            "kafkaCertUnescaped",
                            Collections.singletonMap("KAFKA_CA_CERT_PEM", unescapedCert)));
        };
    }
}
