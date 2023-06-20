import { AppController } from 'src/open-api/app-controller.decorator';
import FileService from './file.service';

@AppController('/file', '파일 - 작업 중')
export default class FileController {
  constructor(private readonly fileService: FileService) {}
}
