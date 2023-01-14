export interface EnvConfig {
  NODE_ENV: string;
  HOST: string;
  PORT: number;
  AWS_CREDS_REGION: string;
  AWS_CREDS_ACCESSKEYID: string;
  AWS_CREDS_ACCESSKEYSECRET: string;
  AWS_APPCONFIG_APPID: string;
  AWS_APPCONFIG_ENVID: string;
  AWS_APPCONFIG_PROFILEID: string;
  AWS_APPCONFIG_MINPOLLINTERVAL_SECS: number;
  MOD_FEATUREFLAG_LOCALFILE: string;
}