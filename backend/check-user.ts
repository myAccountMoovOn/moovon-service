import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const email = process.argv[2] || 'jitakpradhan@gmail.com';
const newPassword = process.argv[3];

async function checkUser() {
  const SUPABASE_URL = process.env.SUPABASE_URL!;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing from .env');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`\n🔍 Searching for user in Supabase Auth: ${email}...`);

  const { data: { users }, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    console.error('❌ Failed to list users:', error.message);
    process.exit(1);
  }

  const targetUser = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  if (!targetUser) {
    console.log(`❌ User "${email}" was NOT found in Supabase Auth.`);
    process.exit(0);
  }

  console.log('\n✅ User Found in Supabase!');
  console.log('--------------------------------------------------');
  console.log(`  User ID:    ${targetUser.id}`);
  console.log(`  Email:      ${targetUser.email}`);
  console.log(`  Role:       ${targetUser.app_metadata?.role || targetUser.user_metadata?.role || 'customer'}`);
  console.log(`  Confirmed:  ${targetUser.email_confirmed_at ? 'Yes' : 'No'}`);
  console.log(`  Created At: ${targetUser.created_at}`);
  console.log('--------------------------------------------------');

  if (newPassword) {
    console.log(`\n🔄 Updating password for ${email}...`);
    const { error: updateError } = await supabase.auth.admin.updateUserById(targetUser.id, {
      password: newPassword,
    });
    if (updateError) {
      console.error('❌ Failed to update password:', updateError.message);
    } else {
      console.log(`🎉 Password updated successfully to: ${newPassword}`);
    }
  } else {
    console.log('\n💡 Note: Passwords are encrypted as secure hashes in Supabase Auth and cannot be read in plaintext.');
    console.log('To reset/set a password, run: npx ts-node check-user.ts jitakpradhan@gmail.com <new_password>');
  }
}

checkUser().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
