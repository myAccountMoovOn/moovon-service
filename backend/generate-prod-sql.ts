import { DataSource } from 'typeorm';
import { join } from 'path';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://postgres.ifezlmxvzvyzptvvwrwr:vXd9VFPf9xD6KNkI@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres',
  entities: [join(__dirname, 'src', '**', '*.entity{.ts,.js}')],
  synchronize: false,
});

async function generateSql() {
  await AppDataSource.initialize();
  const sqlInMemory = await AppDataSource.driver.createSchemaBuilder().log();
  
  console.log('--- UP QUERIES (Safe to run) ---');
  sqlInMemory.upQueries.forEach(q => console.log(q.query + ';'));
  
  await AppDataSource.destroy();
}

generateSql().catch(console.error);
