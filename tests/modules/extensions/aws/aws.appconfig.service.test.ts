import "reflect-metadata"
import { AWSAppConfigService } from "../../../../src/modules/extensions/aws/aws.appconfig.service";
import { ConfigService } from "../../../../src/globals/modules/config/config.service";

jest.mock('../../../../src/globals/modules/config/config.service', () => {
  return {
    ConfigService: jest.fn().mockImplementation(() => {
      return {
        aws: {
            creds: {
              region: '123',
              accessKeyId: '123',
              secretAccessKey: '123',
            },
            appConfig: {
              appId: '123',
              envId: '123',
              profileId: '123',
              minPollIntervalSecs: 300,
            }
        },
      };
    })
  };
});

jest.mock('@aws-sdk/client-appconfigdata', () => {
  return {
    StartConfigurationSessionCommand: jest.fn(),
    GetLatestConfigurationCommand: jest.fn(),
    AppConfigDataClient: jest.fn().mockImplementation(() => {
      return {
        send: async (command: any) => {
          return {
            InitialConfigurationToken: "123",
            Configuration: new Uint8Array([21, 31]),
          }
        }
      }
    })
  }
});

describe('testing AWSAppConfigService', () => {
  const service = new AWSAppConfigService(new ConfigService());
  test('should receive a valid string', async () => {
    const received = await service.getLatestConfiguration();
    const compare = Buffer.from(new Uint8Array([21, 31])).toString('utf-8')
    expect(received).toBe(compare);
  });
});