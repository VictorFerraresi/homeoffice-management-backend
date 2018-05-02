"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorResponse {
    constructor(code, msg) {
        this.code = code;
        this.msg = msg;
    }
    get error() {
        return {
            code: this.code,
            message: this.msg
        };
    }
}
exports.ErrorResponse = ErrorResponse;
