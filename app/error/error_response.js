class ErrorResponse {
  constructor (code, msg) {
    this.code = code;
    this.msg = msg;
  }

  get error () {
    return {
      code: this.code,
      message: this.msg
    };
  }
}

module.exports = ErrorResponse;
