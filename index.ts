import "reflect-metadata";
import express, { Express, Request, Response } from 'express';
import bodyParser from "body-parser";
import { container } from "tsyringe";
import { LoggerService } from "./src/globals/modules/logger/logger.service";
import { featureFlagRoute } from './src/modules/featureflag';
import { ConfigService } from "./src/globals/modules/config/config.service";
import { AppResponseDto } from "./src/globals/dto/appresponse.dto";

const config = container.resolve(ConfigService);
const { port, host } = config.app;

const app: Express = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/config', featureFlagRoute);

app.use((err: any, _: Request, res: Response, next: any) => {
  LoggerService.error(err);
  if (res.headersSent) {
    return next(err)
  }
  const appResp = { message: 'Something failed on the backend!' } as AppResponseDto;
  res.status(500).json(appResp);
});

process.on('uncaughtException', (err) => {
  LoggerService.error(err);
  process.exit(1);
});

app.listen(port, () => {
  LoggerService.log(`Server is running at http://${host}:${port}`);
});