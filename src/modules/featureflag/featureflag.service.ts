import {singleton} from "tsyringe";
import {container} from "tsyringe";
import { LoggerService } from '../../globals/modules/logger/logger.service';
import { ConfigService } from '../../globals/modules/config/config.service';
import { AWSAppConfigService } from '../extensions/aws/aws.appconfig.service';
import { FileService } from '../extensions/file/file.service';
import { AWSModuleError } from '../extensions/aws/aws.errors';


@singleton()
export class FeatureFlagService {
  private readonly featureFlagConfig: any;

  constructor(
    private readonly configService: ConfigService = container.resolve(ConfigService),
    private readonly fileService: FileService = container.resolve(FileService),
    private readonly awsAppConfigService: AWSAppConfigService = container.resolve(AWSAppConfigService)) {
    this.featureFlagConfig = this.configService.mods.featureFlagConfig;
  }

 getLatest = async(): Promise<string> => {
    try {
      const latestAws = this.awsAppConfigService.getLatestConfiguration;
      const latestOnFile = this.getLatestOnFile;
      return await latestAws() || await latestOnFile();
    } catch (error) {
      LoggerService.error(error);
      if (error instanceof AWSModuleError) {
        return await this.getLatestOnFile();
      }
      throw error;
    }
  }

  getLatestOnFile = async(): Promise<string> => {
    LoggerService.log('Getting the featureFlag from local filesystem');
    const { localFile } = this.featureFlagConfig;
    return await this.fileService.readFile(localFile);
  }

  remoteRefresh = (): void => {
    this.awsAppConfigService.refresh();
  }
}