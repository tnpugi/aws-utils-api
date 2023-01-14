import Joi from 'joi';
import dotenv from 'dotenv';
import { singleton } from 'tsyringe';
import { EnvConfig } from './dto/envconfig.interface';


@singleton()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    dotenv.config();
    this.envConfig = this.validateInput(process.env);
  }

  get app(): any {
    return {
      host: this.envConfig.HOST || 'localhost',
      port: this.envConfig.PORT || 8080,
      environment: this.envConfig.NODE_ENV,
    }
  }

  get aws(): any {
    return {
      creds: {
        region: this.envConfig.AWS_CREDS_REGION,
        accessKeyId: this.envConfig.AWS_CREDS_ACCESSKEYID,
        secretAccessKey: this.envConfig.AWS_CREDS_ACCESSKEYSECRET,
      },
      appConfig: {
        appId: this.envConfig.AWS_APPCONFIG_APPID,
        envId: this.envConfig.AWS_APPCONFIG_ENVID,
        profileId: this.envConfig.AWS_APPCONFIG_PROFILEID,
        minPollIntervalSecs: Number(this.envConfig.AWS_APPCONFIG_MINPOLLINTERVAL_SECS) || 300,
      }
    }
  }

  get mods(): any {
    return {
      featureFlagConfig: {
        localFile: this.envConfig.MOD_FEATUREFLAG_LOCALFILE
      }
    }
  }

  private validateInput(env: NodeJS.ProcessEnv): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string().required(),
      HOST: Joi.string().default('0.0.0.0'),
      PORT: Joi.number().default(8080),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(env, { allowUnknown: true });
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return (validatedEnvConfig as unknown) as EnvConfig;
  }
}