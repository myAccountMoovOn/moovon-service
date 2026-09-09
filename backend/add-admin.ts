import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Client } from 'pg';

dotenv.config();

// Get arguments from command line: npx ts-node add-admin.ts <email> <password>
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('\n❌ Usage: npx ts-node add-admin.ts <email> <password>');
  console.log('Example: npx ts-node add-admin.ts admin2@company.com Password123!\n');
  process.exit(1);
}

async function addAdmin() {
  const SUPABASE_URL = process.env.SUPABASE_URL!;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const DATABASE_URL = process.env.DATABASE_URL!;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing from .env');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`\n⏳ Setting up admin account for: ${email}...`);

  // Check if user already exists in Supabase
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listError) {
    console.error('❌ Failed to list users:', listError.message);
    process.exit(1);
  }

  const existingUser = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  let userId: string;

  if (existingUser) {
    console.log(`ℹ️ User ${email} already exists. Upgrading to admin role & updating password...`);
    const { data: updated, error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      {
        password,
        email_confirm: true,
        app_metadata: { ...existingUser.app_metadata, role: 'super_admin' },
        user_metadata: { ...existingUser.user_metadata, role: 'super_admin' },
      },
    );

    if (updateError || !updated.user) {
      console.error('❌ Failed to update existing user:', updateError?.message ?? 'Unknown error');
      process.exit(1);
    }
    userId = updated.user.id;
  } else {
    // Create brand new user
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role: 'super_admin' },
      user_metadata: { role: 'super_admin' },
    });

    if (createError || !created.user) {
      console.error('❌ Failed to create admin user:', createError?.message ?? 'Unknown error');
      process.exit(1);
    }
    userId = created.user.id;
  }

  // Insert or update profile row in database
  if (DATABASE_URL) {
    try {
      const pgClient = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
      await pgClient.connect();
      await pgClient.query(
        `INSERT INTO public.profiles (id, role) VALUES ($1, 'super_admin') ON CONFLICT (id) DO UPDATE SET role = 'super_admin'`,
        [userId],
      );
      await pgClient.end();
      console.log('✅ Database profile updated with role: super_admin');
    } catch (dbErr: any) {
      console.warn('⚠️ User updated in Supabase Auth, but DB profile update failed:', dbErr.message);
    }
  }

  console.log('\n🎉 Admin User Created / Updated Successfully!');
  console.log('--------------------------------------------------');
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
  console.log(`  User ID:  ${userId}`);
  console.log('--------------------------------------------------\n');
}

addAdmin().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
