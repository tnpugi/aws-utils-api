import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';
import { AppResponseDto } from '../../globals/dto/appresponse.dto';
import { FeatureFlagService } from './featureflag.service';

const route = Router();
const featureFlagService = container.resolve(FeatureFlagService);

route.get('/', async (req: Request, res: Response, next) => {
  try {
    const data = await featureFlagService.getLatest();
    const dataJson = JSON.parse(data || '{}');
    const appResp = { success: true, data: dataJson } as AppResponseDto;
    res.status(200).json(appResp);
  } catch (err) {
    next(err);
  }
});

route.put('/refresh', async (req: Request, res: Response, next) => {
  try {
    featureFlagService.remoteRefresh();
    const appResp = { success: true } as AppResponseDto;
    res.status(202).json(appResp);
  } catch (err) {
    next(err);
  }
});

export default route;