import { Injectable } from '@nestjs/common';
import { createReadStream, mkdirSync, writeFileSync } from 'fs';
import ConfigService from '../config/config.service';
import DrizzleService from '../database/drizzle.service';
import { file } from '../database/schemas/schema';
import BadRequestException from 'src/errors/bad-request.exception';
import { ErrorCode } from 'src/errors/error.const';
import { randomUUID } from 'crypto';
import { MultipartFile } from 'src/common/file';
import { eq } from 'drizzle-orm';

@Injectable()
export default class FileService {
  private readonly rootPath: string;
  constructor(
    private readonly config: ConfigService,
    private readonly drizzle: DrizzleService,
  ) {
    this.rootPath = this.config.get('FILE_SAVE_PATH');
  }

  /** file data 불러오기 uuid를 통해 */
  async getFile(uuid: string) {
    const [data] = await this.drizzle
      .select()
      .from(file)
      .where(eq(file.uuid, uuid));

    if (!data) throw new BadRequestException(ErrorCode.NOT_FOUND);

    return data;
  }

  /** file upload */
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
          name: data.filename.normalize(),
        })
        .returning({
          fileId: file.id,
        });

      return fileId;
    } catch (error) {
      throw new BadRequestException(ErrorCode.FILE_UPLOAD_FAILED);
    }
  }
}
