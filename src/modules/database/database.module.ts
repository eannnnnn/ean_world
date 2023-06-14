import { Global, Module } from '@nestjs/common';
import drizzleProvider from './drizzle.provider';
import DrizzleService from './drizzle.service';

@Global()
@Module({
  imports: [],
  providers: [drizzleProvider],
  exports: [DrizzleService],
})
export default class DatabaseModule {}
