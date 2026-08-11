package com.grabmyticket.booking.config;

import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.Environment;
import org.springframework.core.env.MapPropertySource;

import java.util.Collections;

/**
 * NOTE: despite the filename, this is no longer an EnvironmentPostProcessor - it's a
 * @Configuration exposing a static BeanFactoryPostProcessor bean. Rename the file to
 * KafkaCertConfig.java when convenient (IDE rename-refactor); kept as-is here only
 * because this MCP session has no file-delete capability to clean up the old file.
 *
 * TEMPORARY: this currently has diagnostic System.err logging (see bottom of the
 * lambda) to pin down exactly why "No matching CERTIFICATE entries in PEM file" keeps
 * recurring even after unescaping. Remove the diagnostic block once confirmed working -
 * it prints cert length/prefix/suffix, not the full secret, but no reason to leave debug
 * output shipping permanently.
 *
 * KAFKA_CA_CERT is pasted from the Aiven dashboard with literal "\n" escape sequences
 * (backslash + n, not real line breaks) - same as notification-service's copy. Kafka's
 * PEM truststore parser (ssl.truststore.certificates) needs actual newlines to find the
 * "-----BEGIN CERTIFICATE-----" block, so the raw env var fails with "No matching
 * CERTIFICATE entries in PEM file".
 *
 * A static BeanFactoryPostProcessor bean runs after Environment prep (after every
 * EnvironmentPostProcessor, dotenv included) is complete, avoiding ordering races.
 */
@Configuration
public class KafkaCertEnvironmentPostProcessor {

    @Bean
    public static BeanFactoryPostProcessor kafkaCertBeanFactoryPostProcessor(Environment environment) {
        return beanFactory -> {
            if (!(environment instanceof ConfigurableEnvironment configurableEnvironment)) {
                System.err.println("[KAFKA_CERT_DEBUG] Environment is not a ConfigurableEnvironment: "
                        + environment.getClass());
                return;
            }

            String rawCert = environment.getProperty("KAFKA_CA_CERT");

            if (rawCert == null) {
                System.err.println("[KAFKA_CERT_DEBUG] KAFKA_CA_CERT is NULL - not found in Environment at all.");
                return;
            }
            if (rawCert.isBlank()) {
                System.err.println("[KAFKA_CERT_DEBUG] KAFKA_CA_CERT is BLANK (empty/whitespace-only string).");
                return;
            }

            System.err.println("[KAFKA_CERT_DEBUG] rawCert length = " + rawCert.length());
            System.err.println("[KAFKA_CERT_DEBUG] rawCert first 60 chars = ["
                    + rawCert.substring(0, Math.min(60, rawCert.length())) + "]");
            System.err.println("[KAFKA_CERT_DEBUG] rawCert last 60 chars = ["
                    + rawCert.substring(Math.max(0, rawCert.length() - 60)) + "]");
            System.err.println("[KAFKA_CERT_DEBUG] rawCert contains literal backslash-n (\\\\n) = "
                    + rawCert.contains("\\n"));
            System.err.println("[KAFKA_CERT_DEBUG] rawCert contains real newline (\\n char) = "
                    + rawCert.contains("\n"));
            System.err.println("[KAFKA_CERT_DEBUG] rawCert starts with single-quote = "
                    + rawCert.startsWith("'"));
            System.err.println("[KAFKA_CERT_DEBUG] rawCert ends with single-quote = "
                    + rawCert.endsWith("'"));

            String unescapedCert = rawCert.replace("\\n", "\n").trim();
            boolean hadWrappingQuotes = (unescapedCert.startsWith("'") && unescapedCert.endsWith("'"))
                    || (unescapedCert.startsWith("\"") && unescapedCert.endsWith("\""));
            if (hadWrappingQuotes) {
                unescapedCert = unescapedCert.substring(1, unescapedCert.length() - 1);
            }
            System.err.println("[KAFKA_CERT_DEBUG] hadWrappingQuotes (stripped) = " + hadWrappingQuotes);

            System.err.println("[KAFKA_CERT_DEBUG] unescapedCert length = " + unescapedCert.length());
            System.err.println("[KAFKA_CERT_DEBUG] unescapedCert first 60 chars = ["
                    + unescapedCert.substring(0, Math.min(60, unescapedCert.length())) + "]");
            System.err.println("[KAFKA_CERT_DEBUG] unescapedCert line count = "
                    + unescapedCert.lines().count());

            configurableEnvironment.getPropertySources().addFirst(
                    new MapPropertySource(
                            "kafkaCertUnescaped",
                            Collections.singletonMap("KAFKA_CA_CERT_PEM", unescapedCert)));

            System.err.println("[KAFKA_CERT_DEBUG] KAFKA_CA_CERT_PEM published to Environment. "
                    + "Verify via environment.getProperty(\"KAFKA_CA_CERT_PEM\") length = "
                    + configurableEnvironment.getProperty("KAFKA_CA_CERT_PEM", "").length());
        };
    }
}
