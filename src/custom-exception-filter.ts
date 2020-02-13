import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadGatewayException } from '@nestjs/common';

import { Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class CustomExceptionFilter extends BaseExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();
    const isPro = /pro/.test(process.env.SERVER_ENV);

    // HttpException
    if (exception instanceof HttpException) {
      return super.catch(exception, host);
    }

    // other
    if (exception instanceof Error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: (<any>exception).statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: isPro ? 'Internal server error' : (<Error>exception).message || exception,
        data: isPro ? '' : (<any>exception).data,
        stack: isPro ? undefined : (<Error>exception).stack,
      });
    }

    return response.status((<any>exception).code || HttpStatus.INTERNAL_SERVER_ERROR).send(exception);
  }
}
