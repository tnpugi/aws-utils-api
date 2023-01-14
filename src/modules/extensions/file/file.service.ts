import fs from 'fs';
import { singleton } from "tsyringe";
import { FileModuleError } from './file.errors';


@singleton()
export class FileService {
  constructor(){}

  public readFile = async (fileloc: string): Promise<string> => {
    try {
      return await fs.promises.readFile(fileloc, 'utf-8');
    } catch(error) {
      throw FileModuleError.wrap(error);
    }
  }
}