const { upsertGoogleUser, findById } = require('../repositories/users.repository');

async function findOrCreateGoogleUser(profile) {
  const email        = profile.emails?.[0]?.value || '';
  const avatar_url   = profile.photos?.[0]?.value || null;
  const display_name = profile.displayName || email;

  return upsertGoogleUser({ google_id: profile.id, email, display_name, avatar_url });
}

async function getUserById(id) {
  return findById(id);
}

module.exports = { findOrCreateGoogleUser, getUserById };
