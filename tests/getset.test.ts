import { describe, it, expect } from 'vitest';
import { VDate, volt } from '../src/core';

describe('VDate Getters/Setters (Timezone-aware)', () => {
  describe('year()', () => {
    it('should get year in timezone', () => {
      const vd = new VDate('2024-01-15T12:30:00Z', { tz: 'UTC' });
      expect(vd.year()).toBe(2024);
    });

    it('should set year and return new instance', () => {
      const vd = new VDate('2024-01-15T12:30:00Z', { tz: 'UTC' });
      const updated = vd.year(2025);

      expect(updated).toBeInstanceOf(VDate);
      expect(updated).not.toBe(vd);
      expect(updated.year()).toBe(2025);
      expect(vd.year()).toBe(2024); // original unchanged
    });

    it('should preserve other components when setting year', () => {
      const vd = new VDate('2024-06-15T14:30:45.500Z', { tz: 'UTC' });
      const updated = vd.year(2025);

      expect(updated.month()).toBe(6);
      expect(updated.date()).toBe(15);
      expect(updated.hour()).toBe(14);
      expect(updated.minute()).toBe(30);
      expect(updated.second()).toBe(45);
      expect(updated.millisecond()).toBe(500);
    });
  });

  describe('month()', () => {
    it('should get month in timezone', () => {
      const vd = new VDate('2024-06-15T12:30:00Z', { tz: 'UTC' });
      expect(vd.month()).toBe(6);
    });

    it('should set month and return new instance', () => {
      const vd = new VDate('2024-01-15T12:30:00Z', { tz: 'UTC' });
      const updated = vd.month(6);

      expect(updated).not.toBe(vd);
      expect(updated.month()).toBe(6);
      expect(vd.month()).toBe(1);
    });

    it('should handle month overflow with day adjustment', () => {
      const vd = new VDate('2024-01-31T12:30:00Z', { tz: 'UTC' });
      const updated = vd.month(2); // February (28 days in 2024)

      expect(updated.month()).toBe(2);
      expect(updated.date()).toBe(29); // 2024 is a leap year
    });

    it('should handle month overflow in non-leap year', () => {
      const vd = new VDate('2023-01-31T12:30:00Z', { tz: 'UTC' });
      const updated = vd.month(2);

      expect(updated.month()).toBe(2);
      expect(updated.date()).toBe(28); // February 2023 has 28 days
    });
  });

  describe('date()', () => {
    it('should get date in timezone', () => {
      const vd = new VDate('2024-01-15T12:30:00Z', { tz: 'UTC' });
      expect(vd.date()).toBe(15);
    });

    it('should set date and return new instance', () => {
      const vd = new VDate('2024-01-15T12:30:00Z', { tz: 'UTC' });
      const updated = vd.date(20);

      expect(updated).not.toBe(vd);
      expect(updated.date()).toBe(20);
      expect(vd.date()).toBe(15);
    });

    it('should clamp date to valid range', () => {
      const vd = new VDate('2024-01-15T12:30:00Z', { tz: 'UTC' });
      const updated = vd.date(31); // January has 31 days

      expect(updated.date()).toBe(31);

      const updated2 = vd.date(35); // Out of range
      expect(updated2.date()).toBe(31); // Clamped to max
    });

    it('should clamp date to 1 minimum', () => {
      const vd = new VDate('2024-01-15T12:30:00Z', { tz: 'UTC' });
      const updated = vd.date(0);

      expect(updated.date()).toBe(1);
    });
  });

  describe('day()', () => {
    it('should get weekday (0=Sunday, 6=Saturday)', () => {
      // 2024-01-14 is Sunday
      const vd = new VDate('2024-01-14T12:00:00Z', { tz: 'UTC' });
      expect(vd.day()).toBe(0);

      // 2024-01-15 is Monday
      const vd2 = new VDate('2024-01-15T12:00:00Z', { tz: 'UTC' });
      expect(vd2.day()).toBe(1);
    });

    it('should be read-only', () => {
      const vd = new VDate('2024-01-15T12:30:00Z', { tz: 'UTC' });
      const dayValue = vd.day();
      expect(typeof dayValue).toBe('number');
      expect(dayValue >= 0 && dayValue <= 6).toBe(true);
    });
  });

  describe('hour()', () => {
    it('should get hour in timezone', () => {
      const vd = new VDate('2024-01-15T14:30:00Z', { tz: 'UTC' });
      expect(vd.hour()).toBe(14);
    });

    it('should set hour and return new instance', () => {
      const vd = new VDate('2024-01-15T14:30:00Z', { tz: 'UTC' });
      const updated = vd.hour(9);

      expect(updated).not.toBe(vd);
      expect(updated.hour()).toBe(9);
      expect(vd.hour()).toBe(14);
    });

    it('should handle hour wrapping', () => {
      const vd = new VDate('2024-01-15T14:30:00Z', { tz: 'UTC' });
      const updated = vd.hour(25); // Should wrap

      expect(updated.hour()).toBe(1);
    });

    it('should handle negative hour wrapping', () => {
      const vd = new VDate('2024-01-15T14:30:00Z', { tz: 'UTC' });
      const updated = vd.hour(-1); // Should wrap to 23

      expect(updated.hour()).toBe(23);
    });
  });

  describe('minute()', () => {
    it('should get minute in timezone', () => {
      const vd = new VDate('2024-01-15T14:35:00Z', { tz: 'UTC' });
      expect(vd.minute()).toBe(35);
    });

    it('should set minute and return new instance', () => {
      const vd = new VDate('2024-01-15T14:35:00Z', { tz: 'UTC' });
      const updated = vd.minute(45);

      expect(updated).not.toBe(vd);
      expect(updated.minute()).toBe(45);
      expect(vd.minute()).toBe(35);
    });

    it('should handle minute wrapping', () => {
      const vd = new VDate('2024-01-15T14:35:00Z', { tz: 'UTC' });
      const updated = vd.minute(75); // Should wrap

      expect(updated.minute()).toBe(15);
    });
  });

  describe('second()', () => {
    it('should get second in timezone', () => {
      const vd = new VDate('2024-01-15T14:35:45Z', { tz: 'UTC' });
      expect(vd.second()).toBe(45);
    });

    it('should set second and return new instance', () => {
      const vd = new VDate('2024-01-15T14:35:45Z', { tz: 'UTC' });
      const updated = vd.second(30);

      expect(updated).not.toBe(vd);
      expect(updated.second()).toBe(30);
      expect(vd.second()).toBe(45);
    });

    it('should handle second wrapping', () => {
      const vd = new VDate('2024-01-15T14:35:45Z', { tz: 'UTC' });
      const updated = vd.second(65); // Should wrap

      expect(updated.second()).toBe(5);
    });
  });

  describe('millisecond()', () => {
    it('should get millisecond', () => {
      const vd = new VDate('2024-01-15T14:35:45.500Z', { tz: 'UTC' });
      expect(vd.millisecond()).toBe(500);
    });

    it('should set millisecond and return new instance', () => {
      const vd = new VDate('2024-01-15T14:35:45.500Z', { tz: 'UTC' });
      const updated = vd.millisecond(250);

      expect(updated).not.toBe(vd);
      expect(updated.millisecond()).toBe(250);
      expect(vd.millisecond()).toBe(500);
    });

    it('should handle millisecond wrapping', () => {
      const vd = new VDate('2024-01-15T14:35:45.500Z', { tz: 'UTC' });
      const updated = vd.millisecond(1500); // Should wrap

      expect(updated.millisecond()).toBe(500);
    });
  });

  describe('Timezone-aware behavior', () => {
    it('should respect timezone when getting components', () => {
      // 2024-01-15 12:00:00 UTC is different in different timezones
      const utcVd = new VDate('2024-01-15T12:00:00Z', { tz: 'UTC' });
      expect(utcVd.hour()).toBe(12);

      // In Asia/Seoul (UTC+9)
      const seoulVd = new VDate('2024-01-15T12:00:00Z', { tz: 'Asia/Seoul' });
      expect(seoulVd.hour()).toBe(21); // 12:00 UTC = 21:00 Seoul time

      // In America/New_York (UTC-5)
      const nyVd = new VDate('2024-01-15T12:00:00Z', { tz: 'America/New_York' });
      expect(nyVd.hour()).toBe(7); // 12:00 UTC = 07:00 NY time
    });

    it('should preserve timezone across setter operations', () => {
      const seoulVd = new VDate('2024-01-15T12:00:00Z', { tz: 'Asia/Seoul' });
      const updated = seoulVd.hour(10);

      expect(updated.getTimezone()).toBe('Asia/Seoul');
    });
  });

  describe('Chaining and Immutability', () => {
    it('should allow method chaining', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC' });
      const result = vd.year(2025).month(6).date(20).hour(14).minute(45).second(30);

      expect(result.year()).toBe(2025);
      expect(result.month()).toBe(6);
      expect(result.date()).toBe(20);
      expect(result.hour()).toBe(14);
      expect(result.minute()).toBe(45);
      expect(result.second()).toBe(30);

      // Original unchanged
      expect(vd.year()).toBe(2024);
    });

    it('should not modify original instance', () => {
      const vd = new VDate('2024-01-15T12:30:00Z', { tz: 'UTC' });
      const original = vd.unix();

      vd.year(2025);
      vd.month(6);
      vd.date(20);
      vd.hour(14);

      expect(vd.unix()).toBe(original);
    });
  });
});
