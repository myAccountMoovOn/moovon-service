import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  
  // This gets the raw SQL queries that TypeORM would execute to sync the database
  const sqlInMemory = await dataSource.driver.createSchemaBuilder().log();
  
  console.log('--- UP QUERIES (Safe to run) ---');
  sqlInMemory.upQueries.forEach(q => console.log(q.query + ';'));
  
  console.log('--- DOWN QUERIES (Do not run) ---');
  sqlInMemory.downQueries.forEach(q => console.log(q.query + ';'));
  
  await app.close();
}
bootstrap();
