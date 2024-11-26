//返回结果类封装
export class Result {
  public success: boolean;
  public message?: string;
  constructor(success: boolean, message?: string) {
    this.success = success;
    this.message = message;
  }
  static success(message?: string): Result {
    return new Result(true, message);
  }
  static fail(message: string) {
    return new Result(false, message);
  }
}
