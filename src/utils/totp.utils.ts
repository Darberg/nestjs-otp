import * as crypto from 'crypto';
import { Buffer } from 'buffer';
import { AlgorithmTypes } from '../interfaces/otp-options.type';
import { TotpOptions } from '../interfaces/otp-options.interface';

//                      0   1   2   3     4      5       6        7         8
const DIGITS_POWERS =  [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000];
function createHmacSha(algorithm : AlgorithmTypes ,  keyBytes: Buffer, text: Buffer ){
try{
    const hmac = crypto.createHmac(algorithm, keyBytes);
    return hmac.update(text).digest();
}catch(error){
    throw new Error(error)
}
}

function hexStr2Bytes(hex : string) : ArrayBuffer {

    return Buffer.from(hex, 'hex');
}

function generateTOTP(options : TotpOptions){
    let digits = options.digits || '6';
    if (typeof options.digits === 'number') {
        digits = options.digits.toString(); 
    }
    
    let codeDigits = parseInt(digits as string, 10);
    if (isNaN(codeDigits) || codeDigits <= 0) {
        codeDigits = 6;
    }


    let result: string | null = null;
    let timestamp = options.timestamp ?? Math.floor(Date.now() / 1000);
    const timeStep = options?.timeStep || 30;

    const time = Math.floor(timestamp / timeStep);
    let timeHex = time.toString(16).toUpperCase();
    while (timeHex.length < 16) {
        timeHex = '0' + timeHex;
      }
      const msg = hexStr2Bytes(timeHex);
      const k = hexStr2Bytes(options.secret);

      const hash = createHmacSha(options.algorithm , k , msg)
      const offset = hash[hash.length - 1] & 0xf;

      const binary =  ((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff);

      const otp = binary % DIGITS_POWERS[codeDigits];

        result = otp.toString()

      while(result.length < codeDigits){
        result += "0"
      }
      return result;
}   


export {generateTOTP}