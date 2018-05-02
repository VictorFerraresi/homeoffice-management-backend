export class ErrorResponse {
  private code: Number;
  private msg: String;

  constructor (code, msg) {
    this.code = code;
    this.msg = msg;
  }

  get error () {
    return {
      code: this.code,
      message: this.msg,
    };
  }
}
