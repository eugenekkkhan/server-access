import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TerminalModule } from './terminal/terminal.module';

@Module({
  imports: [AuthModule, TerminalModule],
})
export class AppModule {}
