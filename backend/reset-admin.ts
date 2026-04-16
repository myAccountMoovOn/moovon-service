import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Client } from 'pg';

dotenv.config();

// ─────────────────────────────────────────────────────────────────
//  ✏️  CHANGE THESE to your desired new credentials
// ─────────────────────────────────────────────────────────────────
const NEW_EMAIL    = 'emmehemant159@gmail.com'; // new email for the admin account
const NEW_PASSWORD = 'Admin@Moovon2026!';        // new password (min 6 chars)
// ─────────────────────────────────────────────────────────────────

async function resetAdmin() {
  const SUPABASE_URL              = process.env.SUPABASE_URL!;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const DATABASE_URL              = process.env.DATABASE_URL!;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌  SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from .env');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log('🔍  Fetching all Supabase auth users…');

  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listError) {
    console.error('❌  Failed to list users:', listError.message);
    process.exit(1);
  }

  console.log(`    Found ${users.length} auth user(s) in Supabase.`);
  users.forEach(u => console.log(`    - ${u.email} | app_metadata: ${JSON.stringify(u.app_metadata)}`));

  // Strategy 1: find by app_metadata or user_metadata role
  let adminUser = users.find(
    (u) => u.app_metadata?.role === 'admin' || u.user_metadata?.role === 'admin',
  );

  // Strategy 2: check profiles table in Postgres
  if (!adminUser && DATABASE_URL) {
    console.log('\n🔍  Checking profiles table in database for admin role…');
    const pgClient = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
    await pgClient.connect();
    const res = await pgClient.query(`SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1`);
    await pgClient.end();

    if (res.rows.length > 0) {
      const adminId = res.rows[0].id;
      adminUser = users.find(u => u.id === adminId);
      if (adminUser) {
        console.log(`    Found admin via profiles table: ${adminUser.email}`);
      }
    }
  }

  if (adminUser) {
    // ── UPDATE existing admin ──────────────────────────────────────
    console.log(`\n✅  Found admin user:`);
    console.log(`    ID:    ${adminUser.id}`);
    console.log(`    Email: ${adminUser.email}`);
    console.log('\n🔄  Updating email and password…');

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      {
        email:         NEW_EMAIL,
        password:      NEW_PASSWORD,
        email_confirm: true,
        app_metadata:  { role: 'admin' },
        user_metadata: { role: 'admin' },
      },
    );

    if (updateError) {
      console.error('❌  Update failed:', updateError.message);
      process.exit(1);
    }
  } else {
    // ── CREATE a brand-new admin ───────────────────────────────────
    console.log('\n⚠️  No admin found. Creating a fresh admin account…');

    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email:         NEW_EMAIL,
      password:      NEW_PASSWORD,
      email_confirm: true,
      app_metadata:  { role: 'admin' },
      user_metadata: { role: 'admin' },
    });

    if (createError || !created.user) {
      console.error('❌  Create failed:', createError?.message ?? 'unknown');
      process.exit(1);
    }

    // Insert profile row
    if (DATABASE_URL) {
      const pgClient = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
      await pgClient.connect();
      await pgClient.query(
        `INSERT INTO public.profiles (id, role) VALUES ($1, 'admin') ON CONFLICT (id) DO UPDATE SET role = 'admin'`,
        [created.user.id],
      );
      await pgClient.end();
      console.log('    Profile row upserted in database.');
    }
  }

  console.log('\n🎉  Admin credentials reset successfully!');
  console.log('──────────────────────────────────────────');
  console.log(`  Email:    ${NEW_EMAIL}`);
  console.log(`  Password: ${NEW_PASSWORD}`);
  console.log('──────────────────────────────────────────');
  console.log('You can now log in to the frontend with these credentials.\n');
}

resetAdmin().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
