import {ErrorHandler} from "@angular/core";

export abstract class AppError {
  constructor(error?: any, resourceName?: string) {}

  description : string;
  errorNumber : number;
}

export class BadRequestError extends AppError{
  constructor(error?: any, resourceName?: string){
    super(error, resourceName);

    this.description = `This is not a valid request. Please make sure the request is valid and try again.`;
    this.errorNumber = 400;
  }
}

export class CustomErrorHandler implements ErrorHandler {

  handleError(error) {
    console.log(error, "Custom Error handler");
  }
}

export class NotFoundError extends AppError{
  constructor(error?: any, resourceName?: string){
    super(error, resourceName);

    this.description = `The ${resourceName} you are looking at is already deleted...`;
    this.errorNumber = 404;
  }
}

export class UnAuthorizedError extends AppError{
  constructor(error?: any, resourceName?: string){
    super(error, resourceName);

    this.description = `You are not authorised to access this ${resourceName}.`;
    this.errorNumber = 401;
  }
}

export class UnknownError extends AppError{
  constructor(error?: any, resourceName?: string){
    super(error, resourceName);

    this.description = "Some unknown error happened. The error is logged. Please try later ..."
  }
}
