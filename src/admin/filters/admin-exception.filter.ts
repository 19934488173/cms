import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nValidationException, I18nService } from 'nestjs-i18n';
@Catch(HttpException)
export class AdminExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let errorMessage = exception.message;
    if (exception instanceof BadRequestException) {
      const responseBody: any = exception.getResponse();
      if (typeof responseBody === 'object' && responseBody.message) {
        errorMessage = Array.isArray(responseBody.message)
          ? responseBody.message.join(', ')
          : responseBody.message;
      }
    } else if (exception instanceof I18nValidationException) {
      errorMessage = exception.errors
        .map((error) => {
          return this.formatSingleErrorMessage(
            Object.values(error.constraints).join(', '),
            ctx.getRequest().i18nLang,
          );
        })
        .join(', ');
    }
    if (request.headers['accept'] === 'application/json') {
      response.status(status).json({
        statusCode: status,
        message: errorMessage,
      });
    } else {
      response.status(status).render('error', {
        message: errorMessage,
        redirectUrl: ctx.getRequest().url,
      });
    }
  }
  private formatSingleErrorMessage(message: string, lang: string): string {
    const formattedMessages = message.split(', ').map((msg) => {
      const [key, params] = msg.split('|');
      if (params) {
        try {
          const parsedParams = JSON.parse(params);
          return this.i18n.translate(key, {
            lang,
            args: parsedParams,
          });
        } catch (error) {
          return error.msg;
        }
      }
      return msg;
    });
    return formattedMessages.join(', ');
  }
}
