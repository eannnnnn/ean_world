import { Param, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { AppController } from 'src/open-api/app-controller.decorator';
import { AppGet } from 'src/open-api/app-method.decorator';
import GetFileDTO from './dtos/get-file.dto';
import FileService from './file.service';

@AppController('/file', '파일')
export default class FileController {
  constructor(private readonly fileService: FileService) {}

  @AppGet('/:uuid', '파일 다운로드')
  async getFile(@Param() { uuid }: GetFileDTO) {
    const file = await this.fileService.getFile(uuid);

    return new StreamableFile(
      createReadStream(`${file.filePath}/${file.hashName}`),
      {
        disposition: `attachment; filename=${encodeURIComponent(file.name)}`,
      },
    );
  }
}
