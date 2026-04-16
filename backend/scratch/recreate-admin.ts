import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Client } from 'pg';

dotenv.config();

async function run() {
  const SUPABASE_URL = process.env.SUPABASE_URL!;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const DATABASE_URL = process.env.DATABASE_URL!;

  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const email = 'emmehemant159@gmail.com';
  const password = 'Moovon@2026';

  console.log('Cleaning up existing user...');
  const { data: { users } } = await sb.auth.admin.listUsers();
  for (const u of users) {
    if (u.email === email) {
      await sb.auth.admin.deleteUser(u.id);
    }
  }

  console.log('Creating fresh user...');
  const { data: { user }, error } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: 'admin' },
    user_metadata: { role: 'admin' }
  });

  if (error) throw error;
  console.log('User created:', user!.email);

  console.log('Upserting profile...');
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  await client.query(
    'INSERT INTO public.profiles (id, role) VALUES ($1, \'admin\') ON CONFLICT (id) DO UPDATE SET role = \'admin\'',
    [user!.id]
  );
  await client.end();
  console.log('SUCCESS: Admin recreated with password: Moovon@2026');
}

run().catch(console.error);
