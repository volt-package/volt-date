import { describe, it, expect } from 'vitest';
import { VDate } from '../src/core';

describe('VDate Utilities', () => {
  describe('diff()', () => {
    it('should return difference in milliseconds by default', () => {
      const vd1 = new VDate('2024-01-15T12:30:00Z');
      const vd2 = new VDate('2024-01-15T12:30:05Z');
      expect(vd2.diff(vd1)).toBe(5000);
    });

    it('should return difference in seconds', () => {
      const vd1 = new VDate('2024-01-15T12:30:00Z');
      const vd2 = new VDate('2024-01-15T12:30:05Z');
      expect(vd2.diff(vd1, 'second')).toBe(5);
    });

    it('should return difference in minutes', () => {
      const vd1 = new VDate('2024-01-15T12:30:00Z');
      const vd2 = new VDate('2024-01-15T12:35:00Z');
      expect(vd2.diff(vd1, 'minute')).toBe(5);
    });

    it('should return difference in hours', () => {
      const vd1 = new VDate('2024-01-15T12:00:00Z');
      const vd2 = new VDate('2024-01-15T17:00:00Z');
      expect(vd2.diff(vd1, 'hour')).toBe(5);
    });

    it('should return difference in days', () => {
      const vd1 = new VDate('2024-01-15T12:00:00Z');
      const vd2 = new VDate('2024-01-20T12:00:00Z');
      expect(vd2.diff(vd1, 'day')).toBe(5);
    });

    it('should return difference in weeks', () => {
      const vd1 = new VDate('2024-01-15T12:00:00Z');
      const vd2 = new VDate('2024-02-05T12:00:00Z');
      expect(vd2.diff(vd1, 'week')).toBe(3);
    });

    it('should return difference in months', () => {
      const vd1 = new VDate('2024-01-15T12:00:00Z');
      const vd2 = new VDate('2024-04-15T12:00:00Z');
      expect(vd2.diff(vd1, 'month')).toBe(3);
    });

    it('should return difference in years', () => {
      const vd1 = new VDate('2024-01-15T12:00:00Z');
      const vd2 = new VDate('2027-01-15T12:00:00Z');
      expect(vd2.diff(vd1, 'year')).toBe(3);
    });

    it('should support precise calculation', () => {
      const vd1 = new VDate('2024-01-15T12:00:00Z');
      const vd2 = new VDate('2024-01-20T12:00:00Z');
      const diff = vd2.diff(vd1, 'day', true);
      expect(diff).toBe(5);
    });

    it('should handle negative differences', () => {
      const vd1 = new VDate('2024-01-20T12:00:00Z');
      const vd2 = new VDate('2024-01-15T12:00:00Z');
      expect(vd2.diff(vd1, 'day')).toBe(-5);
    });
  });

  describe('daysInMonth()', () => {
    it('should return 31 for January', () => {
      const vd = new VDate('2024-01-15T12:30:00Z');
      expect(vd.daysInMonth()).toBe(31);
    });

    it('should return 29 for February in leap year', () => {
      const vd = new VDate('2024-02-15T12:30:00Z');
      expect(vd.daysInMonth()).toBe(29);
    });

    it('should return 28 for February in non-leap year', () => {
      const vd = new VDate('2023-02-15T12:30:00Z');
      expect(vd.daysInMonth()).toBe(28);
    });

    it('should return 30 for April', () => {
      const vd = new VDate('2024-04-15T12:30:00Z');
      expect(vd.daysInMonth()).toBe(30);
    });
  });

  describe('dayOfYear()', () => {
    it('should return 1 for January 1st', () => {
      const vd = new VDate('2024-01-01T12:30:00Z');
      expect(vd.dayOfYear()).toBe(1);
    });

    it('should return 15 for January 15th', () => {
      const vd = new VDate('2024-01-15T12:30:00Z');
      expect(vd.dayOfYear()).toBe(15);
    });

    it('should return 366 for December 31st in leap year', () => {
      const vd = new VDate('2024-12-31T12:30:00Z');
      expect(vd.dayOfYear()).toBe(366);
    });

    it('should return 365 for December 31st in non-leap year', () => {
      const vd = new VDate('2023-12-31T12:30:00Z');
      expect(vd.dayOfYear()).toBe(365);
    });
  });

  describe('weekOfYear()', () => {
    it('should return week number', () => {
      const vd = new VDate('2024-01-15T12:30:00Z');
      const week = vd.weekOfYear();
      expect(typeof week).toBe('number');
      expect(week).toBeGreaterThan(0);
      expect(week).toBeLessThanOrEqual(53);
    });
  });

  describe('isLeapYear()', () => {
    it('should return true for leap year', () => {
      const vd = new VDate('2024-01-15T12:30:00Z');
      expect(vd.isLeapYear()).toBe(true);
    });

    it('should return false for non-leap year', () => {
      const vd = new VDate('2023-01-15T12:30:00Z');
      expect(vd.isLeapYear()).toBe(false);
    });

    it('should handle century years correctly', () => {
      const leap = new VDate('2000-01-15T12:30:00Z');
      const notLeap = new VDate('1900-01-15T12:30:00Z');
      expect(leap.isLeapYear()).toBe(true);
      expect(notLeap.isLeapYear()).toBe(false);
    });
  });

  describe('quarter()', () => {
    it('should return 1 for Q1 (Jan-Mar)', () => {
      expect(new VDate('2024-01-15T12:30:00Z').quarter()).toBe(1);
      expect(new VDate('2024-03-15T12:30:00Z').quarter()).toBe(1);
    });

    it('should return 2 for Q2 (Apr-Jun)', () => {
      expect(new VDate('2024-04-15T12:30:00Z').quarter()).toBe(2);
      expect(new VDate('2024-06-15T12:30:00Z').quarter()).toBe(2);
    });

    it('should return 3 for Q3 (Jul-Sep)', () => {
      expect(new VDate('2024-07-15T12:30:00Z').quarter()).toBe(3);
      expect(new VDate('2024-09-15T12:30:00Z').quarter()).toBe(3);
    });

    it('should return 4 for Q4 (Oct-Dec)', () => {
      expect(new VDate('2024-10-15T12:30:00Z').quarter()).toBe(4);
      expect(new VDate('2024-12-15T12:30:00Z').quarter()).toBe(4);
    });
  });

  describe('toObject()', () => {
    it('should return object representation', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z');
      const obj = vd.toObject();

      expect(obj.years).toBe(2024);
      expect(obj.months).toBe(1);
      expect(obj.date).toBe(15);
      expect(obj.hours).toBe(12);
      expect(obj.minutes).toBe(30);
      expect(obj.seconds).toBe(45);
      expect(obj.milliseconds).toBe(500);
    });
  });

  describe('toArray()', () => {
    it('should return array representation', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z');
      const arr = vd.toArray();

      expect(arr[0]).toBe(2024); // year
      expect(arr[1]).toBe(0); // month (0-11)
      expect(arr[2]).toBe(15); // date
      expect(arr[3]).toBe(12); // hour
      expect(arr[4]).toBe(30); // minute
      expect(arr[5]).toBe(45); // second
      expect(arr[6]).toBe(500); // millisecond
    });
  });

  describe('get() and set()', () => {
    it('should get values with get()', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z');

      expect(vd.get('year')).toBe(2024);
      expect(vd.get('month')).toBe(1);
      expect(vd.get('date')).toBe(15);
      expect(vd.get('hour')).toBe(12);
      expect(vd.get('minute')).toBe(30);
      expect(vd.get('second')).toBe(45);
      expect(vd.get('millisecond')).toBe(500);
    });

    it('should set values with set()', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z');
      const result = vd.set('year', 2025).set('month', 6).set('date', 20);

      expect(result.year()).toBe(2025);
      expect(result.month()).toBe(6);
      expect(result.date()).toBe(20);
    });

    it('should support alias units', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z');

      expect(vd.get('D')).toBe(15);
      expect(vd.get('d')).toBe(vd.day());
      expect(vd.get('H')).toBe(12);
      expect(vd.get('m')).toBe(30);
      expect(vd.get('s')).toBe(45);
      expect(vd.get('ms')).toBe(500);
    });
  });

  describe('day() setter', () => {
    it('should set day of week', () => {
      const vd = new VDate('2024-01-15T12:30:00Z'); // Monday
      const result = vd.day(0); // Sunday

      expect(result.day()).toBe(0);
      expect(result.unix()).not.toBe(vd.unix());
    });
  });

  describe('Array/Object parsing', () => {
    it('should parse array', () => {
      const vd = new VDate([2024, 0, 15, 12, 30, 45, 500]);

      expect(vd.year()).toBe(2024);
      expect(vd.month()).toBe(1); // Note: months are 1-indexed in getter
      expect(vd.date()).toBe(15);
      expect(vd.hour()).toBe(12);
      expect(vd.minute()).toBe(30);
      expect(vd.second()).toBe(45);
      expect(vd.millisecond()).toBe(500);
    });

    it('should parse object', () => {
      const vd = new VDate({
        year: 2024,
        month: 1,
        date: 15,
        hour: 12,
        minute: 30,
        second: 45,
        millisecond: 500,
      });

      expect(vd.year()).toBe(2024);
      expect(vd.month()).toBe(1);
      expect(vd.date()).toBe(15);
      expect(vd.hour()).toBe(12);
      expect(vd.minute()).toBe(30);
      expect(vd.second()).toBe(45);
      expect(vd.millisecond()).toBe(500);
    });

    it('should handle partial array', () => {
      const vd = new VDate([2024, 0, 15]);

      expect(vd.year()).toBe(2024);
      expect(vd.month()).toBe(1);
      expect(vd.date()).toBe(15);
      expect(vd.hour()).toBe(0);
    });

    it('should handle partial object', () => {
      const vd = new VDate({ year: 2024, date: 15 });

      expect(vd.year()).toBe(2024);
      expect(vd.date()).toBe(15);
      expect(vd.month()).toBe(1); // default
      expect(vd.hour()).toBe(0); // default
    });
  });
});
