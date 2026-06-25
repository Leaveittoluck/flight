const { validateClickRequest } = require('./clicks.validator');

const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000';

function validPayload(overrides = {}) {
  return {
    destination_id: 42,
    click_type: 'flight',
    anonymous_id: VALID_UUID,
    ...overrides,
  };
}

describe('validateClickRequest', () => {
  it('accepts a valid flight click', () => {
    expect(validateClickRequest(validPayload()).success).toBe(true);
  });

  it('accepts a valid hotel click', () => {
    expect(validateClickRequest(validPayload({ click_type: 'hotel' })).success).toBe(true);
  });

  it('rejects a click_type outside the flight/hotel enum', () => {
    expect(validateClickRequest(validPayload({ click_type: 'car' })).success).toBe(false);
  });

  it.each([0, -1])('rejects a non-positive destination_id (%i)', (destination_id) => {
    expect(validateClickRequest(validPayload({ destination_id })).success).toBe(false);
  });

  it('rejects a non-integer destination_id', () => {
    expect(validateClickRequest(validPayload({ destination_id: 1.5 })).success).toBe(false);
  });

  it('rejects a non-UUID anonymous_id', () => {
    expect(validateClickRequest(validPayload({ anonymous_id: 'nope' })).success).toBe(false);
  });

  it('rejects a payload missing destination_id', () => {
    const { destination_id, ...rest } = validPayload();
    expect(validateClickRequest(rest).success).toBe(false);
  });
});
