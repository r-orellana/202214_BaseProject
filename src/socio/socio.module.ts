import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';

@Module({
  providers: [SocioService],
  imports: [TypeOrmModule.forFeature([SocioEntity])],
})
export class SocioModule {}
