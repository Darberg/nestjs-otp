import { AlgorithmTypes, EncodingTypes } from "./otp-options.type";

/**
 * Base interface for shared OTP generation options.
 */
export interface OtpBaseOptions {
  /**
   * Length of the OTP secret, representing the number of random bytes in the secret key.
   * The default value is 32 if not provided.
   *
   * @type {number}
   * @default 32
   */
  secretLength?: number;

  /**
   * Length of the OTP (One-Time Password) to generate.
   * The default is 6 digits if not provided.
   *
   * @type {number}
   * @default 6
   */
  otpLength?: number;

  /**
   * The HMAC algorithm to use for OTP generation.
   * The default is 'sha1'. This can be changed to 'sha256', 'sha512', etc.
   *
   * @type {AlgorithmTypes}
   * @default 'sha1'
   */
  algorithm?: AlgorithmTypes;

  /**
   * Encoding used for the secret.
   * Accepted values: 'base32', 'hex', 'utf8'.
   *
   * @type {string}
   * @default 'base32'
   */
  encoding?: EncodingTypes;


  digits : number
}

/**
 * Configuration options for Time-based One-Time Password (TOTP) generation.
 */
export interface TotpOptions extends OtpBaseOptions {
  /**
   * Secret key for OTP generation.
   *
   * @type {string}
   */
  secret: string;

  /**
   * Time step value for TOTP in seconds. This represents the duration between each valid OTP.
   * The default value is 30 seconds if not provided.
   *
   * @type {number}
   * @default 30
   */
  timeStep?: number;

  /**
   * Window size for OTP validation.
   * If a negative value is provided, it validates tokens from before the current time.
   * If a positive value is provided, it checks tokens after the current time step.
   *
   * @type {number}
   */
  window?: number;

  /**
   * Optional timestamp for TOTP generation. If not provided, the current time is used.
   *
   * @type {number}
   */
  timestamp?: number;
}

/**
 * Configuration options for HMAC-based One-Time Password (HOTP) generation.
 */
export interface HotpOptions extends OtpBaseOptions {
  /**
   * Secret key for OTP generation.
   *
   * @type {string}
   */
  secret: string;

  /**
   * Counter value for HOTP. This counter is incremented each time a new OTP is generated.
   * It must be unique to each OTP that you generate.
   *
   * @type {number}
   */
  counter: number;
}


export interface GenerateSecret {
  /**
   * The length of the secret to be generated in bytes. 
   * Default is 16 bytes if not specified.
   * @default 16
   */
  length?: number;

  /**
   * The encoding type used for the generated secret. 
   * You can specify how you would like to encode the generated secret.
   */
  encoding: EncodingTypes;

  /**
   * The URL or metadata that will be used to create the OTP setup URL, 
   * which can be scanned by an authenticator app.
   */
  url: {
    /**
     * Specifies whether this URL is for a 'totp' (time-based) or 'hotp' (counter-based) 
     * one-time password system.
     */
    type: 'htop' | 'totp';

    /**
     * The name of the issuer (typically the service that is using OTP). 
     * Optional but highly recommended to set it to help identify the service.
     */
    issuer?: string;

    /**
     * The username or account name to associate with the secret. 
     * Optional but recommended for identification.
     */
    userName?: string;

    /**
     * The period (duration) for which the TOTP is valid. This defines the lifetime of each OTP 
     * in seconds. Typically set to 30 or 60 seconds. Default for TOTP is 30 seconds.
     * Applies only if `type` is 'totp'.
     */
    period?: string;

    /**
     * The time step (interval) used for generating the TOTP OTP. 
     * The default value is 30 seconds for typical TOTP usage, but can be set custom if desired.
     * Applies only if `type` is 'totp'.
     */
    timeStep?: string;

    /**
     * The algorithm type used to generate OTPs. 
     * Can include hashing algorithms like SHA-1, SHA-256, etc. 
     * SHA-1 is the most commonly supported and widely adopted algorithm for OTP generation.
     * 
     * It is generally recommended to use SHA-1, as most OTP applications (such as Google Authenticator) 
     * natively support it. If you need stronger security or support for more secure applications, 
     * you may opt for SHA-256 or others, but be aware that compatibility could be limited in certain OTP apps.
     * 
     * Applies to both TOTP and HOTP.
     */
    algorithm?: AlgorithmTypes;
  };

    /**
     * If true, the generated secret will be returned in a format that can be stored
     * in the database (e.g., Base32 encoding). This is necessary for users to save the secret
     * and validate TOTP tokens later.
     * 
     * If false, only the OTP setup URL will be returned, without exposing the secret.
     * 
     * If both `url` and this option are enabled, the result will be returned as an object containing both
     * the setup URL and the secret.
     * 
     * @default true
     */
    includeSecretForValidation: boolean;


}
