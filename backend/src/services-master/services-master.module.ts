import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ServicesMasterController } from './services-master.controller';
import { ServicesMasterService } from './services-master.service';

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  controllers: [ServicesMasterController],
  providers: [ServicesMasterService],
  exports: [ServicesMasterService],
})
export class ServicesMasterModule {}
