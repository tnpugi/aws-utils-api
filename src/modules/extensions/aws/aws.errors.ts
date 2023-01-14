export class AWSModuleError extends Error {
  public origError: any;

  public static wrap(error: any): AWSModuleError {
    const modError = new AWSModuleError();
    if (error instanceof AWSModuleError) {
      Object.assign(modError, error);
    } else {
      Object.assign(modError, error);
      modError.origError = error;
    }
    return modError;
  }
}