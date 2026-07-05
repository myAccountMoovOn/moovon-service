import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { AuthService } from './src/auth/auth.service';
import { UserRole } from './src/auth/entities/profile.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();
  const authService = app.get(AuthService);

  const email = 'admin@moovon.com';
  const password = 'SuperSecretPassword123!';

  console.log('Seeding initial admin user...');
  
  try {
    const userId = await authService.createSupabaseUser(email, password, UserRole.SUPER_ADMIN);
    console.log('\n✅ Admin user successfully created in Supabase!');
    console.log('--------------------------------------------------');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log('--------------------------------------------------');
    console.log('You can use these credentials to log in to the frontend now.');
  } catch (error: any) {
    console.error('\n❌ Failed to create admin user:');
    console.error(error.message);
  }

  await app.close();
}

bootstrap();
