// Plans that grant Explorer Membership access.
// Includes legacy DB values (pro, adventurer) so existing users are not broken
// during the migration period before all rows are updated to 'explorer'.
export function isExplorer(plan) {
  return plan === 'explorer' || plan === 'pro' || plan === 'adventurer'
}
