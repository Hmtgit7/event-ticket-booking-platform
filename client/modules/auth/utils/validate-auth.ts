const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface CredentialErrors {
  email?: string;
  password?: string;
}

/** Shared by AuthForm (login) and SignupForm (email + password fields overlap). */
export function validateCredentials(email: string, password: string): CredentialErrors {
  const errors: CredentialErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
}

export interface SignupErrors extends CredentialErrors {
  fullName?: string;
  confirmPassword?: string;
  terms?: string;
}

export function validateSignup(values: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}): SignupErrors {
  const errors: SignupErrors = validateCredentials(values.email, values.password);

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }
  if (!values.acceptedTerms) {
    errors.terms = "Accept the terms to continue.";
  }

  return errors;
}
