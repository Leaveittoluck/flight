const { validateGenerateRequest } = require('./destinations.validator');

const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000';

function validPayload(overrides = {}) {
  return {
    departure_airport_id: 1,
    budget: 1000,
    anonymous_id: VALID_UUID,
    travellers: 2,
    trip_type_slug: 'beach',
    season: 'summer',
    ...overrides,
  };
}

describe('validateGenerateRequest', () => {
  it('accepts a valid full payload', () => {
    const result = validateGenerateRequest(validPayload());
    expect(result.success).toBe(true);
  });

  it('accepts budget_per_person when present, since it is optional', () => {
    const result = validateGenerateRequest(validPayload({ budget_per_person: 500 }));
    expect(result.success).toBe(true);
  });

  it('accepts a payload that omits budget_per_person entirely', () => {
    const result = validateGenerateRequest(validPayload());
    expect(result.success).toBe(true);
    expect(result.data.budget_per_person).toBeUndefined();
  });

  it('rejects a negative budget_per_person', () => {
    const result = validateGenerateRequest(validPayload({ budget_per_person: -10 }));
    expect(result.success).toBe(false);
  });

  it('rejects a missing departure_airport_id', () => {
    const { departure_airport_id, ...rest } = validPayload();
    const result = validateGenerateRequest(rest);
    expect(result.success).toBe(false);
  });

  it('rejects a non-positive budget', () => {
    const result = validateGenerateRequest(validPayload({ budget: 0 }));
    expect(result.success).toBe(false);
  });

  it('rejects a missing anonymous_id', () => {
    const { anonymous_id, ...rest } = validPayload();
    const result = validateGenerateRequest(rest);
    expect(result.success).toBe(false);
  });

  it('rejects a non-UUID anonymous_id', () => {
    const result = validateGenerateRequest(validPayload({ anonymous_id: 'not-a-uuid' }));
    expect(result.success).toBe(false);
  });

  it.each([0, 7])('rejects travellers out of the 1-6 range (%i)', (travellers) => {
    const result = validateGenerateRequest(validPayload({ travellers }));
    expect(result.success).toBe(false);
  });

  it.each([1, 6])('accepts travellers at the 1-6 boundary (%i)', (travellers) => {
    const result = validateGenerateRequest(validPayload({ travellers }));
    expect(result.success).toBe(true);
  });

  it('rejects an empty trip_type_slug', () => {
    const result = validateGenerateRequest(validPayload({ trip_type_slug: '' }));
    expect(result.success).toBe(false);
  });

  it('rejects a missing season with a helpful message', () => {
    const { season, ...rest } = validPayload();
    const result = validateGenerateRequest(rest);
    expect(result.success).toBe(false);
    expect(result.error.issues.some((e) => e.path.join('.') === 'season')).toBe(true);
  });

  it('rejects a season that is not one of the valid values', () => {
    const result = validateGenerateRequest(validPayload({ season: 'monsoon' }));
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toMatch(/spring, summer, autumn, fall, winter/);
  });

  it('accepts season case-insensitively', () => {
    const result = validateGenerateRequest(validPayload({ season: 'SUMMER' }));
    expect(result.success).toBe(true);
  });

  it('accepts "fall" as a valid season alias for autumn', () => {
    const result = validateGenerateRequest(validPayload({ season: 'fall' }));
    expect(result.success).toBe(true);
  });
});
