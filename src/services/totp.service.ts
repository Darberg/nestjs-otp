import { Inject, Injectable } from '@nestjs/common';

@Injectable()

export class OtpService {
  constructor(
    @Inject('TOTP_OPTIONS') private readonly options: Record<string, any>,
  ) {}
    generateTotpSecret(){}


    genarateHotpSecret(){}


    generateTOTP(secret: string): string {

      if(this.options){
        return generateTotp(secret);

      }
      }
    
      validateTOTP(secret: string, otp: string): boolean {
        return validateTotp(secret, otp);
      }
    
      generateHOTP(secret: string, counter: number): string {
        return generateHotp(secret, counter);
      }
    
      validateHOTP(secret: string, otp: string, counter: number): boolean {
        return validateHotp(secret, otp, counter);
      }
}