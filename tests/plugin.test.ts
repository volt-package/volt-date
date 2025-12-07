import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VDate, volt, extend, RelativeTimePlugin, TimezonePlugin } from '../src/core';

describe('VDate Plugins', () => {
  describe('RelativeTimePlugin', () => {
    it('should show relative time in fromNow', () => {
      // Create a date in the past
      const past = new VDate(Date.now() - 60000); // 1 minute ago
      const result = past.fromNow();

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should show relative time in toNow', () => {
      // Create a date in the past
      const past = new VDate(Date.now() - 3600000); // 1 hour ago
      const result = past.toNow();

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle future dates in fromNow', () => {
      // Create a date in the future
      const future = new VDate(Date.now() + 86400000); // 1 day in the future
      const result = future.fromNow();

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle future dates in toNow', () => {
      // Create a date in the future
      const future = new VDate(Date.now() + 86400000); // 1 day in the future
      const result = future.toNow();

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should respect locale in relative time', () => {
      const past = new VDate(Date.now() - 60000, { locale: 'en-US' });
      const result = past.fromNow();

      expect(typeof result).toBe('string');
    });

    it('should handle very recent times', () => {
      const vd = new VDate(Date.now() - 5000); // 5 seconds ago
      const result = vd.fromNow();

      expect(typeof result).toBe('string');
    });

    it('should handle very old times', () => {
      const vd = new VDate(Date.now() - 365 * 24 * 60 * 60 * 1000); // 1 year ago
      const result = vd.fromNow();

      expect(typeof result).toBe('string');
    });
  });

  describe('TimezonePlugin', () => {
    it('should change timezone with tz()', () => {
      const vd = new VDate('2024-01-15T12:00:00Z', { tz: 'UTC' });
      const seoulVd = vd.tz('Asia/Seoul');

      expect(seoulVd.getTimezone()).toBe('Asia/Seoul');
      expect(vd.getTimezone()).toBe('UTC'); // original unchanged
    });

    it('should set to UTC with utc()', () => {
      const vd = new VDate('2024-01-15T12:00:00Z', { tz: 'Asia/Seoul' });
      const utcVd = vd.utc();

      expect(utcVd.getTimezone()).toBe('UTC');
    });

    it('should set to local timezone with local()', () => {
      const vd = new VDate('2024-01-15T12:00:00Z', { tz: 'UTC' });
      const localVd = vd.local();

      // Should have a valid timezone
      expect(localVd.getTimezone()).toBeDefined();
      expect(typeof localVd.getTimezone()).toBe('string');
    });

    it('should preserve data when changing timezone', () => {
      const vd = new VDate('2024-01-15T12:00:00Z', { tz: 'UTC' });
      const original = vd.unix();

      const seoulVd = vd.tz('Asia/Seoul');
      expect(seoulVd.unix()).toBe(original); // Same UTC time
    });

    it('should show correct local time in different timezones', () => {
      const utcTime = '2024-01-15T12:00:00Z';

      const utcVd = new VDate(utcTime, { tz: 'UTC' });
      expect(utcVd.hour()).toBe(12);

      const seoulVd = new VDate(utcTime, { tz: 'Asia/Seoul' });
      expect(seoulVd.hour()).toBe(21); // UTC+9

      const nyVd = new VDate(utcTime, { tz: 'America/New_York' });
      expect(nyVd.hour()).toBe(7); // UTC-5
    });

    it('tz() should be chainable', () => {
      const vd = new VDate('2024-01-15T12:00:00Z');
      const result = vd.tz('Asia/Seoul').format('HH:mm');

      expect(typeof result).toBe('string');
    });
  });

  describe('Plugin System', () => {
    it('should have RelativeTimePlugin methods available', () => {
      const vd = new VDate();

      expect(typeof vd.fromNow).toBe('function');
      expect(typeof vd.toNow).toBe('function');
    });

    it('should have TimezonePlugin methods available', () => {
      const vd = new VDate();

      expect(typeof vd.tz).toBe('function');
      expect(typeof vd.utc).toBe('function');
      expect(typeof vd.local).toBe('function');
    });

    it('should prevent duplicate plugin registration', () => {
      // This test verifies that calling extend multiple times with the same plugin
      // doesn't cause issues
      const customPlugin = (VDateClass: typeof VDate) => {
        VDateClass.prototype.customMethod = function () {
          return 'custom';
        };
      };

      extend(customPlugin);
      const vd1 = new VDate();

      // Try to register again
      extend(customPlugin);
      const vd2 = new VDate();

      // Both should have the method
      expect(typeof vd1.customMethod).toBe('function');
      expect(typeof vd2.customMethod).toBe('function');
    });

    it('should allow creating custom plugins', () => {
      const CustomPlugin = (VDateClass: typeof VDate) => {
        VDateClass.prototype.getDayOfYear = function () {
          const start = this.clone().startOf('year');
          const diff = this.unix() - start.unix();
          return Math.floor(diff / (24 * 60 * 60 * 1000)) + 1;
        };
      };

      extend(CustomPlugin);
      const vd = new VDate('2024-01-15T00:00:00Z', { tz: 'UTC' });

      // getDayOfYear should be available
      const dayOfYear = (vd as any).getDayOfYear();
      expect(typeof dayOfYear).toBe('number');
      expect(dayOfYear).toBeGreaterThan(0);
      expect(dayOfYear).toBeLessThanOrEqual(366);
    });
  });

  describe('Integration', () => {
    it('should work with factory function', () => {
      const vd = volt('2024-01-15T12:00:00Z', { tz: 'Asia/Seoul' });

      expect(typeof vd.fromNow).toBe('function');
      expect(typeof vd.tz).toBe('function');
      expect(vd.getTimezone()).toBe('Asia/Seoul');
    });

    it('should chain plugin methods with core methods', () => {
      const vd = new VDate('2024-01-15T12:00:00Z', { tz: 'UTC' });
      const result = vd.tz('Asia/Seoul').format('YYYY-MM-DD HH:mm');

      expect(typeof result).toBe('string');
      expect(result).toContain('2024-01-15');
      expect(result).toContain('21:00'); // Seoul time (UTC+9)
    });

    it('should work with manipulation methods', () => {
      const vd = new VDate('2024-01-15T12:00:00Z', { tz: 'UTC' });
      const result = vd.add(1, 'day').tz('Asia/Seoul').fromNow();

      expect(typeof result).toBe('string');
    });
  });
});

declare global {
  interface VDate {
    getDayOfYear?(): number;
    customMethod?(): string;
  }
}
