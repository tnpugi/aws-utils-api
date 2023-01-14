import { container, singleton } from "tsyringe";
import { AppConfigDataClient, 
  AppConfigDataClientConfig,
  GetLatestConfigurationCommand, 
  GetLatestConfigurationCommandInput,
  GetLatestConfigurationCommandOutput,
  StartConfigurationSessionCommandInput,
  StartConfigurationSessionCommand } from "@aws-sdk/client-appconfigdata";

import { ConfigService } from '../../../globals/modules/config/config.service'
import { AWSModuleError } from "./aws.errors";

class CachedObj {
  configTokenNext: string | undefined;
  configCached: string | undefined;
  configCachingTime: number = 0;
}

@singleton()
export class AWSAppConfigService {
  private cachedObj: CachedObj = new CachedObj();

  constructor(private readonly configService: ConfigService = container.resolve(ConfigService)) {}

  private getDataClient = (): AppConfigDataClient => {
    const { creds: awsCreds } = this.configService.aws;
    return new AppConfigDataClient({
      region: awsCreds.region,
      credentials: {
        accessKeyId: awsCreds.accessKeyId,
        secretAccessKey: awsCreds.secretAccessKey,
      }
    } as AppConfigDataClientConfig);
  }

  private getSessionToken = async(): Promise<string> => {
    const { appConfig: awsAppConfig } = this.configService.aws;
    const client = this.getDataClient();
    const sessionInput = {
      ApplicationIdentifier: awsAppConfig.appId,
      EnvironmentIdentifier: awsAppConfig.envId,
      ConfigurationProfileIdentifier: awsAppConfig.profileId,
      RequiredMinimumPollIntervalInSeconds: awsAppConfig.minPollIntervalSecs,
    } as StartConfigurationSessionCommandInput;
    const sessionCommand = new StartConfigurationSessionCommand(sessionInput);
    const sessionOutput = await client.send(sessionCommand);
    const sessionToken = sessionOutput.InitialConfigurationToken;
    if (sessionToken) {
      return sessionToken;
    }
    throw new AWSModuleError('Session Token Not Generated!');
  }

  public getLatestConfiguration = async(): Promise<string | undefined> => {
    try {
      const cached = this.cachedObj;
      const client = this.getDataClient();
      const configToken = cached.configTokenNext || await this.getSessionToken();
      const configInput = { ConfigurationToken: configToken } as GetLatestConfigurationCommandInput;
      const configCommand = new GetLatestConfigurationCommand(configInput);
      if (!cached.configCached || !cached.configCachingTime || cached.configCachingTime < new Date().getTime()) {
        const configOutput = await client.send(configCommand) as GetLatestConfigurationCommandOutput;
        const configConfiguration = configOutput.Configuration as Uint8Array;
        const configIntervalSecs = configOutput.NextPollIntervalInSeconds || 300;
        cached.configTokenNext = configOutput.NextPollConfigurationToken;
        cached.configCachingTime = new Date().getTime() + configIntervalSecs * 1000;

        if (configConfiguration && configConfiguration.length > 0) {
          cached.configCached = Buffer.from(configConfiguration).toString('utf-8');
        }
      }
      return cached.configCached;
    } catch (error) {
      throw AWSModuleError.wrap(error);
    }
  }

  public refresh = (): void => {
    this.cachedObj = new CachedObj();
  }
}