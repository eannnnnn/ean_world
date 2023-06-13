import { Controller, Get } from '@nestjs/common';

@Controller('/health')
export default class HealthController {
  @Get()
  health() {
    return 'ok';
  }
}
