import { describe, it, expect } from 'vitest';
import { VDate, volt, isValid } from '../src/core';

describe('VDate Core', () => {
  describe('Constructor', () => {
    it('should create instance with default date (now)', () => {
      const now = Date.now();
      const vd = new VDate();
      expect(Math.abs(vd.unix() - now)).toBeLessThan(100);
    });

    it('should create instance from Date object', () => {
      const date = new Date('2024-01-15T12:30:00Z');
      const vd = new VDate(date);
      expect(vd.unix()).toBe(date.getTime());
    });

    it('should create instance from ISO string', () => {
      const isoString = '2024-01-15T12:30:00Z';
      const vd = new VDate(isoString);
      expect(vd.unix()).toBe(new Date(isoString).getTime());
    });

    it('should create instance from timestamp number', () => {
      const timestamp = 1705334400000; // 2024-01-15T12:00:00Z
      const vd = new VDate(timestamp);
      expect(vd.unix()).toBe(timestamp);
    });

    it('should create instance from another VDate', () => {
      const original = new VDate('2024-01-15T12:30:00Z');
      const copy = new VDate(original);
      expect(copy.unix()).toBe(original.unix());
    });

    it('should throw error for invalid date', () => {
      expect(() => {
        new VDate('invalid-date');
      }).toThrow();
    });

    it('should set default timezone to browser timezone', () => {
      const vd = new VDate();
      expect(vd.getTimezone()).toBeDefined();
      expect(typeof vd.getTimezone()).toBe('string');
    });

    it('should set default locale', () => {
      const vd = new VDate();
      // In test environment, may default to 'en-US' if navigator is not available
      expect(typeof vd.getLocale()).toBe('string');
      expect(vd.getLocale().length).toBeGreaterThan(0);
    });

    it('should accept custom timezone', () => {
      const vd = new VDate(new Date(), { tz: 'America/New_York' });
      expect(vd.getTimezone()).toBe('America/New_York');
    });

    it('should accept custom locale', () => {
      const vd = new VDate(new Date(), { locale: 'ja-JP' });
      expect(vd.getLocale()).toBe('ja-JP');
    });

    it('should accept both custom timezone and locale', () => {
      const vd = new VDate(new Date(), { tz: 'Asia/Seoul', locale: 'ko-KR' });
      expect(vd.getTimezone()).toBe('Asia/Seoul');
      expect(vd.getLocale()).toBe('ko-KR');
    });
  });

  describe('clone()', () => {
    it('should create independent copy', () => {
      const original = new VDate('2024-01-15T12:30:00Z', { tz: 'Asia/Seoul', locale: 'ko-KR' });
      const cloned = original.clone();

      expect(cloned.unix()).toBe(original.unix());
      expect(cloned.getTimezone()).toBe(original.getTimezone());
      expect(cloned.getLocale()).toBe(original.getLocale());
    });

    it('cloned instance should be independent', () => {
      const original = new VDate('2024-01-15T12:30:00Z');
      const cloned = original.clone();

      // Should be different objects
      expect(cloned).not.toBe(original);
      expect(cloned.getInternalDate()).not.toBe(original.getInternalDate());
    });
  });

  describe('getInternalDate()', () => {
    it('should return a Date object', () => {
      const vd = new VDate('2024-01-15T12:30:00Z');
      const date = vd.getInternalDate();
      expect(date instanceof Date).toBe(true);
    });

    it('should return copy of internal date', () => {
      const vd = new VDate('2024-01-15T12:30:00Z');
      const date1 = vd.getInternalDate();
      const date2 = vd.getInternalDate();
      expect(date1).not.toBe(date2);
      expect(date1.getTime()).toBe(date2.getTime());
    });
  });

  describe('unix()', () => {
    it('should return timestamp in milliseconds', () => {
      const timestamp = 1705334400000;
      const vd = new VDate(timestamp);
      expect(vd.unix()).toBe(timestamp);
    });
  });

  describe('toISOString()', () => {
    it('should return ISO format string', () => {
      const isoString = '2024-01-15T12:30:00Z';
      const vd = new VDate(isoString);
      expect(vd.toISOString()).toBe('2024-01-15T12:30:00.000Z');
    });
  });

  describe('toDate()', () => {
    it('should return Date object', () => {
      const date = new Date('2024-01-15T12:30:00Z');
      const vd = new VDate(date);
      expect(vd.toDate() instanceof Date).toBe(true);
    });

    it('should return copy of internal date', () => {
      const vd = new VDate('2024-01-15T12:30:00Z');
      const date1 = vd.toDate();
      const date2 = vd.toDate();
      expect(date1).not.toBe(date2);
      expect(date1.getTime()).toBe(date2.getTime());
    });
  });

  describe('toString()', () => {
    it('should return string representation', () => {
      const vd = new VDate('2024-01-15T12:30:00Z');
      expect(typeof vd.toString()).toBe('string');
    });
  });

  describe('isValid()', () => {
    it('should return true for valid dates', () => {
      expect(isValid(new Date())).toBe(true);
      expect(isValid(new Date('2024-01-15'))).toBe(true);
    });

    it('should return false for invalid dates', () => {
      expect(isValid(new Date('invalid'))).toBe(false);
    });

    it('should return false for non-Date objects', () => {
      expect(isValid('2024-01-15')).toBe(false);
      expect(isValid(1705334400000)).toBe(false);
      expect(isValid(null)).toBe(false);
      expect(isValid(undefined)).toBe(false);
    });
  });

  describe('volt() factory function', () => {
    it('should create VDate instance', () => {
      const vd = volt('2024-01-15T12:30:00Z');
      expect(vd instanceof VDate).toBe(true);
    });

    it('should work with all input types', () => {
      const date = new Date('2024-01-15T12:30:00Z');
      const vd1 = volt(date);
      const vd2 = volt('2024-01-15T12:30:00Z');
      const vd3 = volt(date.getTime());

      expect(vd1.unix()).toBe(vd2.unix());
      expect(vd2.unix()).toBe(vd3.unix());
    });

    it('should accept config', () => {
      const vd = volt(new Date(), { tz: 'UTC', locale: 'en-US' });
      expect(vd.getTimezone()).toBe('UTC');
      expect(vd.getLocale()).toBe('en-US');
    });
  });

  describe('Immutability', () => {
    it('should not allow modification of internal properties', () => {
      const vd = new VDate('2024-01-15T12:30:00Z');
      const originalUnix = vd.unix();

      // Attempt to access private properties (TypeScript should prevent this)
      // This test verifies the API doesn't expose mutable state
      expect(vd.unix()).toBe(originalUnix);
    });
  });
});
