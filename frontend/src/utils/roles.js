const LEGACY_USER_ROLES = ['student', 'instructor', 'freelancer'];
const LEGACY_ENTREPRISE_ROLES = ['company', 'enterprise'];

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  ENTREPRISE: 'entreprise',
};

export function normalizeRole(role) {
  if (!role) return ROLES.USER;
  if (LEGACY_USER_ROLES.includes(role)) return ROLES.USER;
  if (LEGACY_ENTREPRISE_ROLES.includes(role)) return ROLES.ENTREPRISE;
  if (role === ROLES.ADMIN || role === ROLES.USER || role === ROLES.ENTREPRISE) {
    return role;
  }
  return ROLES.USER;
}

export function dashboardPathForRole(role) {
  const normalized = normalizeRole(role);
  if (normalized === ROLES.ADMIN) return '/dashboard/admin';
  if (normalized === ROLES.ENTREPRISE) return '/dashboard/enterprise';
  return '/dashboard/user';
}

export function isAdmin(role) {
  return normalizeRole(role) === ROLES.ADMIN;
}
