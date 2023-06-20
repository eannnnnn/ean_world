import { Injectable } from '@nestjs/common';
import { mkdirSync, writeFileSync } from 'fs';
import ConfigService from '../config/config.service';
import DrizzleService from '../database/drizzle.service';
import { file } from '../database/schemas/schema';
import BadRequestException from 'src/errors/bad-request.exception';
import { ErrorCode } from 'src/errors/error.const';
import { randomUUID } from 'crypto';
import { MultipartFile } from 'src/common/file';

@Injectable()
export default class FileService {
  private readonly rootPath: string;
  constructor(
    private readonly config: ConfigService,
    private readonly drizzle: DrizzleService,
  ) {
    this.rootPath = this.config.get('FILE_SAVE_PATH');
  }

  async uploadFile(data: MultipartFile) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();

    const filePath = `${this.rootPath}/${year}/${month}/${date}`;

    try {
      // create directory if not exists
      mkdirSync(filePath, { recursive: true });

      const newName = randomUUID();
      // save file
      writeFileSync(`${filePath}/${newName}`, data.data);

      const [{ fileId }] = await this.drizzle
        .insert(file)
        .values({
          filePath,
          hashName: newName,
          name: data.filename,
        })
        .returning({
          fileId: file.id,
        });

      return fileId;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(ErrorCode.FILE_UPLOAD_FAILED);
    }
  }
}
