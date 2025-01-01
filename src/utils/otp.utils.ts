import { GenerateSecret } from "../interfaces/otp-options.interface";
import * as crypto from 'crypto';

function generateSecret(options: GenerateSecret): string | { url: string, secret: string } {
  // Default length is 16 bytes if not specified
  const length = options.length || 16;

  // Generate the secret using the specified encoding (e.g., Base32)
  const secret = crypto.randomBytes(length).toString(options.encoding);

  // If no URL configuration is provided, return just the secret
  if (!options?.url) {
    return secret;
  } else {
    const urlOptions = options.url;

    // Constructing the URL for OTP setup, making sure each parameter is properly encoded
    const issuer = urlOptions.issuer || ''; // Default to empty string if not provided
    const userName = urlOptions.userName || ''; // Default to empty string if not provided

    // Construct URL parameters
    const secretParam = `secret=${secret}`;
    const issuerParam = `issuer=${encodeURIComponent(issuer)}`;
    const userNameParam = userName ? `&account=${encodeURIComponent(userName)}` : ''; // Append account if userName is provided

    // Handle optional parameters
    const periodParam = urlOptions.period ? `&period=${urlOptions.period}` : '';
    const timeStepParam = urlOptions.timeStep ? `&timeStep=${urlOptions.timeStep}` : '';
    const algorithmParam = urlOptions.algorithm ? `&algorithm=${urlOptions.algorithm}` : '';

    // Construct the full OTP setup URL with otpauth:// schema
    const url = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(userName)}?${secretParam}&${issuerParam}${userNameParam}${periodParam}${timeStepParam}${algorithmParam}`;

    // If includeSecretForValidation is true, return an object with both URL and secret for storage
    if (options.includeSecretForValidation) {
      return {
        url: url,      // OTP setup URL for OTP apps like Google Authenticator
        secret: secret // Base32 encoded secret for storage (to validate TOTP later)
      };
    } else {
      // Only return the URL if the secret shouldn't be included
      return url;
    }
  }
}
