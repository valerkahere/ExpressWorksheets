import { createCarZSchema } from '../../src/models/cars.js';

const validCar = {
  make: 'Una',
  model: '0871234567',
  year: 1980,
};

describe('Test Car Validation', () => {
  it('should pass for the following valid data', () => {
    expect(() => createCarZSchema.parse(validCar)).not.toThrow();
  });
  it('should pass for the following valid data - no date', () => {
    expect(() =>
      createCarZSchema.parse({
        ...validCar,
        year: undefined,
      })
    ).not.toThrow();
  });
  it('fail no model', () => {
    expect(() =>
      createCarZSchema.parse({
        make: 'asdf',
      })
    ).toThrow();
  });
  it('fail no make', () => {
    expect(() =>
      createCarZSchema.parse({
        model: 'asdf',
      })
    ).toThrow();
  });
  it('too early year', () => {
    expect(() =>
      createCarZSchema.parse({
        make: 'asdf',
        model: '0871234567',
        year: 1949,
      })
    ).toThrow();
  });
  it('should fail unparsable year', () => {
    expect(() =>
      createCarZSchema.parse({
        make: 'asdf',
        model: '0871234567',
        year: 1920.2,
      })
    ).toThrow();
  });
});
