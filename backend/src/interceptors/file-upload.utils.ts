import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';

@Injectable()
export class ImageUploadInterceptor implements NestInterceptor {
  private readonly upload = multer({
    storage: multer.memoryStorage(),

    fileFilter: (_req: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return callback(new Error('Chỉ hỗ trợ ảnh (jpg, jpeg, png)!'));
      }
      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  }).fields([
    { name: 'electric', maxCount: 1 },
    { name: 'water', maxCount: 1 },
  ]);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    return new Observable<unknown>((observer) => {
      this.upload(req, res, (err: unknown) => {
        if (err) {
          const message = err instanceof Error ? err.message : 'Upload file thất bại';
          observer.error(new BadRequestException(message));
        } else {
          const files = req.files as { electric?: Express.Multer.File[]; water?: Express.Multer.File[] } | undefined;
          if (!files || !files.electric || !files.water || files.electric.length !== 1 || files.water.length !== 1) {
            observer.error(new BadRequestException('Vui lòng gửi đúng 2 file ảnh với key electric và water'));
            return;
          }

          next.handle().subscribe(observer);
        }
      });
    });
  }
}
