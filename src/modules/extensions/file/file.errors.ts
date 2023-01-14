export class FileModuleError extends Error {
  public origError: any;

  public static wrap(error: any): FileModuleError {
    const modError = new FileModuleError();
    if (error instanceof FileModuleError) {
      Object.assign(modError, error);
    } else {
      Object.assign(modError, error);
      modError.origError = error;
    }
    return modError;
  }
}