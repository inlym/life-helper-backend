import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DebugModule } from './modules/debug/debug.module';

@Module({
  imports: [DebugModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
