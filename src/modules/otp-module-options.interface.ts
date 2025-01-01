import { ModuleMetadata } from "@nestjs/common";
import { TotpOptions } from "../interfaces/otp-options.interface";

export interface OtpModuleAsyncOptions  extends Pick<ModuleMetadata, 'imports'> {
    imports?: any[];
    inject?: any[];
    useFactory: (...args: any[]) => TotpOptions  | Promise<TotpOptions>;
  }
  