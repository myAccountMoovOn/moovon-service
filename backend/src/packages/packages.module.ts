import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { Package } from './entities/package.entity';
import { Service } from '../services-master/entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Package, Service])],
  controllers: [PackagesController],
  providers: [PackagesService],
  exports: [PackagesService, TypeOrmModule],
})
export class PackagesModule {}
