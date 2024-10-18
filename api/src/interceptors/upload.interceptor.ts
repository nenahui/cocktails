import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const UploadInterceptor = (uploadPath: string, fieldName: string) => {
  return FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: (_req, _file, callback) => {
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, { recursive: true });
        }
        callback(null, uploadPath);
      },
      filename: (_req, file, callback) => {
        const uniqueName = randomUUID();
        const ext = extname(file.originalname);
        callback(null, uniqueName + ext);
      },
    }),
    fileFilter: (_req, file, callback) => {
      if (file.mimetype.match(/\/(jpg|webp|jpeg|png)$/)) {
        callback(null, true);
      } else {
        callback(
          new BadRequestException(
            'Only JPG, JPEG, WEBP and PNG files are allowed',
          ),
          false,
        );
      }
    },
    limits: { fileSize: 1024 * 1024 * 5 },
  });
};
