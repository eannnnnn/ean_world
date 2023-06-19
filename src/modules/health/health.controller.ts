import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from 'src/open-api/api-response.decorator';

@Controller('/health')
export default class HealthController {
  @Get()
  @ApiOkResponse('서버 상태 확인', String)
  health() {
    return 'ok';
  }
}
