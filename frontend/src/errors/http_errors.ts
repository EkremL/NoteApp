class HttpError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

//! Status Code: 401 Error
export class UnAuthorizedError extends HttpError {}

//! Status Code: 409 Error
export class ConflictError extends HttpError {}
