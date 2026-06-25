const { validatePatchProfile } = require('./profile.validator');

describe('validatePatchProfile', () => {
  it('accepts a normal display name', () => {
    const result = validatePatchProfile({ display_name: 'Alex' });
    expect(result.success).toBe(true);
    expect(result.data.display_name).toBe('Alex');
  });

  it('rejects an empty display name', () => {
    const result = validatePatchProfile({ display_name: '' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Name cannot be empty');
  });

  it('trims whitespace before validating, so a whitespace-only name is rejected', () => {
    const result = validatePatchProfile({ display_name: '    ' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Name cannot be empty');
  });

  it('trims surrounding whitespace from an otherwise valid name', () => {
    const result = validatePatchProfile({ display_name: '  Alex  ' });
    expect(result.success).toBe(true);
    expect(result.data.display_name).toBe('Alex');
  });

  it('accepts a name exactly at the 100 character boundary', () => {
    const name = 'a'.repeat(100);
    expect(validatePatchProfile({ display_name: name }).success).toBe(true);
  });

  it('rejects a name over the 100 character limit', () => {
    const name = 'a'.repeat(101);
    const result = validatePatchProfile({ display_name: name });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Name must be 100 characters or fewer');
  });

  it('rejects a missing display_name', () => {
    expect(validatePatchProfile({}).success).toBe(false);
  });
});
