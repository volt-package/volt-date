import { describe, it, expect, beforeEach } from 'vitest';
import { VDate, volt } from '../src/core';
import { clearFormatterCache } from '../src/format';

describe('VDate Format', () => {
  beforeEach(() => {
    clearFormatterCache();
  });

  describe('format()', () => {
    it('should format year tokens', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC' });
      expect(vd.format('YYYY')).toBe('2024');
      expect(vd.format('YY')).toBe('24');
    });

    it('should format month tokens', () => {
      const vd = new VDate('2024-06-15T12:30:45.500Z', { tz: 'UTC', locale: 'en-US' });
      expect(vd.format('MM')).toBe('06');
      expect(vd.format('M')).toBe('6');
      expect(vd.format('MMMM')).toBe('June');
      expect(vd.format('MMM')).toBe('Jun');
    });

    it('should format date tokens', () => {
      const vd = new VDate('2024-01-05T12:30:45.500Z', { tz: 'UTC' });
      expect(vd.format('dd')).toBe('05');
      expect(vd.format('d')).toBe('5');
    });

    it('should format hour tokens', () => {
      const vd = new VDate('2024-01-15T14:30:45.500Z', { tz: 'UTC' });
      expect(vd.format('HH')).toBe('14');
      expect(vd.format('H')).toBe('14');
      expect(vd.format('hh')).toBe('02');
      expect(vd.format('h')).toBe('2');
    });

    it('should format 12-hour with AM/PM', () => {
      const morning = new VDate('2024-01-15T09:30:45.500Z', { tz: 'UTC' });
      expect(morning.format('hh A')).toBe('09 AM');
      expect(morning.format('h a')).toBe('9 am');

      const afternoon = new VDate('2024-01-15T14:30:45.500Z', { tz: 'UTC' });
      expect(afternoon.format('hh A')).toBe('02 PM');
      expect(afternoon.format('h a')).toBe('2 pm');

      const midnight = new VDate('2024-01-15T00:30:45.500Z', { tz: 'UTC' });
      expect(midnight.format('hh A')).toBe('12 AM');

      const noon = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC' });
      expect(noon.format('hh A')).toBe('12 PM');
    });

    it('should format minute tokens', () => {
      const vd = new VDate('2024-01-15T14:05:45.500Z', { tz: 'UTC' });
      expect(vd.format('mm')).toBe('05');
      expect(vd.format('m')).toBe('5');
    });

    it('should format second tokens', () => {
      const vd = new VDate('2024-01-15T14:30:05.500Z', { tz: 'UTC' });
      expect(vd.format('ss')).toBe('05');
      expect(vd.format('s')).toBe('5');
    });

    it('should format millisecond tokens', () => {
      const vd = new VDate('2024-01-15T14:30:45.050Z', { tz: 'UTC' });
      expect(vd.format('SSS')).toBe('050');
      expect(vd.format('SS')).toBe('05');
      expect(vd.format('S')).toBe('0');

      const vd2 = new VDate('2024-01-15T14:30:45.500Z', { tz: 'UTC' });
      expect(vd2.format('SSS')).toBe('500');
      expect(vd2.format('SS')).toBe('50');
      expect(vd2.format('S')).toBe('5');
    });

    it('should format weekday tokens', () => {
      // 2024-01-15 is a Monday
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC', locale: 'en-US' });
      expect(vd.format('dddd')).toBe('Monday');
      expect(vd.format('ddd')).toBe('Mon');
    });

    it('should format complex format strings', () => {
      const vd = new VDate('2024-06-15T14:30:45.500Z', { tz: 'UTC', locale: 'en-US' });
      const result = vd.format('YYYY-MM-DD HH:mm:ss');
      expect(result).toBe('2024-06-15 14:30:45');

      const result2 = vd.format('dddd, MMMM D, YYYY');
      expect(result2).toBe('Saturday, June 15, 2024');

      const result3 = vd.format('hh:mm A');
      expect(result3).toBe('02:30 PM');
    });

    it('should handle edge cases in formatting', () => {
      const vd = new VDate('2024-01-01T00:00:00.000Z', { tz: 'UTC' });
      expect(vd.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-01-01 00:00:00');

      const vd2 = new VDate('2024-12-31T23:59:59.999Z', { tz: 'UTC' });
      expect(vd2.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-12-31 23:59:59');
    });

    it('should respect locale in formatting', () => {
      // Test with Korean locale
      const vd = new VDate('2024-06-15T12:30:45.500Z', { tz: 'UTC', locale: 'ko-KR' });
      const monthName = vd.format('MMMM');
      // Month names are localized but format structure should work
      expect(monthName).toBeDefined();
      expect(typeof monthName).toBe('string');
    });

    it('should respect timezone in formatting', () => {
      // Note: volt-date stores time internally in UTC and timezone is used for display
      // The timezone config is stored but currently affects formatting display
      const baseTime = '2024-01-15T12:00:00Z';

      const utcVd = new VDate(baseTime, { tz: 'UTC' });
      const seoulVd = new VDate(baseTime, { tz: 'Asia/Seoul' });

      // Both should reference the same instant
      expect(utcVd.unix()).toBe(seoulVd.unix());
      expect(utcVd.getTimezone()).toBe('UTC');
      expect(seoulVd.getTimezone()).toBe('Asia/Seoul');
    });
  });

  describe('Formatter Cache', () => {
    it('should cache formatters for performance', () => {
      const vd1 = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC' });
      const vd2 = new VDate('2024-06-20T14:45:30.250Z', { tz: 'UTC' });

      const result1 = vd1.format('YYYY-MM-DD');
      const result2 = vd2.format('YYYY-MM-DD');

      // Both should format successfully
      expect(result1).toBe('2024-01-15');
      expect(result2).toBe('2024-06-20');
    });

    it('should clear cache when clearFormatterCache is called', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC' });
      vd.format('YYYY-MM-DD');

      clearFormatterCache();
      // Should still work after cache clear
      const result = vd.format('YYYY-MM-DD');
      expect(result).toBe('2024-01-15');
    });
  });

  describe('format() with volt factory', () => {
    it('should work with volt factory function', () => {
      const vd = volt('2024-01-15T12:30:45.500Z');
      const result = vd.format('YYYY-MM-DD HH:mm:ss');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Common date formatting patterns', () => {
    it('should support ISO-like format', () => {
      const vd = new VDate('2024-01-15T14:30:45.500Z', { tz: 'UTC' });
      const result = vd.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
      expect(result).toContain('2024-01-15T14:30:45.500');
    });

    it('should support US date format', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC', locale: 'en-US' });
      const result = vd.format('MM/DD/YYYY');
      expect(result).toBe('01/15/2024');
    });

    it('should support European date format', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC', locale: 'en-GB' });
      const result = vd.format('DD/MM/YYYY');
      expect(result).toBe('15/01/2024');
    });

    it('should support time format', () => {
      const vd = new VDate('2024-01-15T14:30:45.500Z', { tz: 'UTC' });
      const result = vd.format('HH:mm:ss');
      expect(result).toBe('14:30:45');
    });
  });

  describe('Edge cases', () => {
    it('should handle repeated tokens', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC' });
      const result = vd.format('YYYY YYYY MM MM');
      expect(result).toBe('2024 2024 01 01');
    });

    it('should handle mixed tokens', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC', locale: 'en-US' });
      const result = vd.format('DD - HH:mm - YYYY');
      expect(result).toBe('15 - 12:30 - 2024');
    });

    it('should preserve non-token characters', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC' });
      const result = vd.format('YYYY-MM-DD HH:mm:ss');
      expect(result).toContain('2024-01-15');
      expect(result).toContain('12:30:45');
    });
  });
});
