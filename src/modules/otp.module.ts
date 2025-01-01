import { Module } from "@nestjs/common";
import { OtpService } from "../services/totp.service";
import { OtpModuleAsyncOptions } from "./otp-module-options.interface";


@Module({
    providers : [OtpService],
    exports : [OtpService],
})

export class OtpModule{
    static register(options : OtpModuleAsyncOptions){
        return {
            module : OtpModule,
            imports : options.imports || [],
            providers : [{
                provide: 'TOTP_OPTIONS',
                useFactory: options.useFactory,
                inject: options.inject || [],
            }, 
            OtpService,
        ],
        exports: [OtpService]
        }
    }

    static async registerAsync(options : OtpModuleAsyncOptions){
        return {
            module : OtpModule,
            imports : options.imports || [],
            providers : [{
                provide: 'TOTP_OPTIONS',
                useFactory: options.useFactory,
                inject: options.inject || [],
            }, 
            OtpService,
        ],
        exports: [OtpService]
        }
    }
}