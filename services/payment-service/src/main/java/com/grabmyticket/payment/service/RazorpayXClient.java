package com.grabmyticket.payment.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;

import org.json.JSONObject;
import org.springframework.stereotype.Component;

import com.grabmyticket.payment.config.PaymentProperties;

/**
 * Talks to RazorpayX's REST API directly (Contacts, Fund Accounts, and
 * later Payouts) rather than through razorpay-java's resource classes -
 * unlike Orders (used by RazorpayService), this SDK's support for the X
 * APIs varies by version and isn't worth guessing at compile-time. Same
 * Basic Auth scheme as the rest of Razorpay's API (key_id:key_secret,
 * base64-encoded), just called manually.
 */
@Component
public class RazorpayXClient {

    private static final String BASE_URL = "https://api.razorpay.com/v1";

    private final HttpClient httpClient;
    private final PaymentProperties properties;

    public RazorpayXClient(PaymentProperties properties) {
        this.properties = properties;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    /** https://razorpay.com/docs/api/x/contacts/create/ - throws RazorpayXException with Razorpay's own error message on any non-2xx response. */
    public JSONObject createContact(String name, String referenceId) {
        JSONObject body = new JSONObject();
        body.put("name", name);
        body.put("type", "vendor");
        body.put("reference_id", referenceId);
        return post("/contacts", body);
    }

    /** https://razorpay.com/docs/api/x/fund-accounts/create/ */
    public JSONObject createBankAccountFundAccount(String contactId, String accountHolderName, String accountNumber, String ifscCode) {
        JSONObject bankAccount = new JSONObject();
        bankAccount.put("name", accountHolderName);
        bankAccount.put("ifsc", ifscCode);
        bankAccount.put("account_number", accountNumber);

        JSONObject body = new JSONObject();
        body.put("contact_id", contactId);
        body.put("account_type", "bank_account");
        body.put("bank_account", bankAccount);
        return post("/fund_accounts", body);
    }

    /**
     * https://razorpay.com/docs/api/x/payouts/create/ - idempotencyKey is
     * mandatory (Razorpay enforces this as of March 2025); using
     * payoutRequestId.toString() means a retried call for the same request
     * is deduped by Razorpay itself too, on top of our own DB uniqueness
     * check in PayoutExecutionService.
     */
    public JSONObject createPayout(
            String accountNumber, String fundAccountId, long amountPaise, String mode, String purpose,
            String referenceId, String idempotencyKey
    ) {
        JSONObject body = new JSONObject();
        body.put("account_number", accountNumber);
        body.put("fund_account_id", fundAccountId);
        body.put("amount", amountPaise);
        body.put("currency", "INR");
        body.put("mode", mode);
        body.put("purpose", purpose);
        body.put("queue_if_low_balance", true);
        body.put("reference_id", referenceId);
        body.put("narration", "GrabMyTicket organizer payout");
        return post("/payouts", body, idempotencyKey);
    }

    private JSONObject post(String path, JSONObject body) {
        return post(path, body, null);
    }

    private JSONObject post(String path, JSONObject body, String idempotencyKey) {
        String credentials = Base64.getEncoder().encodeToString(
                (properties.resolvedXKeyId() + ":" + properties.resolvedXKeySecret()).getBytes(StandardCharsets.UTF_8));

        HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + path))
                .header("Authorization", "Basic " + credentials)
                .header("Content-Type", "application/json")
                .timeout(Duration.ofSeconds(15));
        if (idempotencyKey != null && !idempotencyKey.isBlank()) {
            requestBuilder.header("X-Payout-Idempotency", idempotencyKey);
        }
        HttpRequest request = requestBuilder.POST(HttpRequest.BodyPublishers.ofString(body.toString())).build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            JSONObject responseBody = new JSONObject(response.body());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                return responseBody;
            }
            String message = responseBody.optJSONObject("error") != null
                    ? responseBody.getJSONObject("error").optString("description", "RazorpayX request failed")
                    : "RazorpayX request failed with status " + response.statusCode();
            throw new RazorpayXException(message);
        } catch (java.io.IOException | InterruptedException ex) {
            if (ex instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new RazorpayXException("Could not reach RazorpayX. Please try again.");
        }
    }
}
