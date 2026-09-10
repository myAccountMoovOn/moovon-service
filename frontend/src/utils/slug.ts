export function getCompanySlug(user: any): string {
  if (!user) return 'company';
  const raw =
    user.companyName ||
    user.company_name ||
    user.company?.name ||
    user.user_metadata?.companyName ||
    user.companyCode ||
    user.companyId;

  if (!raw) return 'company';

  // Sanitize: strip out special characters except alphanumeric, hyphen, underscore
  // e.g. "Abcelectronics" -> "Abcelectronics"
  // e.g. "ABC Electronics" -> "ABCElectronics"
  // e.g. "company1" -> "company1"
  const slug = raw.toString().trim().replace(/[^a-zA-Z0-9_-]/g, '');
  return slug || 'company';
}
