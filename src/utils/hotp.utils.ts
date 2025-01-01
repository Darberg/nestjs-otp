import crypto from 'crypto';
import { Buffer } from 'buffer';
import { HotpOptions } from '../interfaces/otp-options.interface';

/**
 * Generates an HMAC-based One-Time Password (HOTP).
 *
 * @param secret - The shared secret key in Base32 format.
 * @param counter - The counter value.
 * @param digits - The desired OTP length. Default is 6.
 * @returns The generated HOTP as a string.
 */
function generateHOTP(options : HotpOptions): string {

    if(!options.digits){
    options.digits = 6
    }
    // Convert the counter value to an 8-byte buffer
    const counterBuffer = Buffer.alloc(8);
    for (let i = 0; i < 8; i++) {
        counterBuffer[7 - i] = options.counter & 0xff; // Store the counter value in big-endian format
        options.counter >>= 8;
    }

    // Decode the shared secret (assume Base32 encoding)
    const keyBuffer = Buffer.from(options.secret , options.encoding);
    const hmac = crypto.createHmac(options.algorithm, keyBuffer).update(counterBuffer).digest();

    // Dynamic truncation to extract a 4-byte binary code
    const offset = hmac[hmac.length - 1] & 0xf;
    const binaryCode = 
        ((hmac[offset] & 0x7f) << 24) |
        ((hmac[offset + 1] & 0xff) << 16) |
        ((hmac[offset + 2] & 0xff) << 8) |
        (hmac[offset + 3] & 0xff);

    // Generate the OTP by taking the binary code modulo 10^digits
    const otp = binaryCode % Math.pow(10, options.digits);

    // Return the OTP as a zero-padded string
    return otp.toString().padStart(options.digits , '0');
}


export { generateHOTP }