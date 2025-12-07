import { describe, it, expect } from 'vitest';
import { VDate } from '../src/core';

describe('VDate Query', () => {
  describe('isBefore()', () => {
    it('should return true if before compared date', () => {
      const vd = new VDate('2024-01-15T12:30:00Z');
      const other = new VDate('2024-01-20T12:30:00Z');
      expect(vd.isBefore(other)).toBe(true);
    });

    it('should return false if after compared date', () => {
      const vd = new VDate('2024-01-20T12:30:00Z');
      const other = new VDate('2024-01-15T12:30:00Z');
      expect(vd.isBefore(other)).toBe(false);
    });

    it('should return false if same date', () => {
      const vd = new VDate('2024-01-15T12:30:00Z');
      const other = new VDate('2024-01-15T12:30:00Z');
      expect(vd.isBefore(other)).toBe(false);
    });

    it('should compare with unit', () => {
      const vd = new VDate('2024-01-15T23:59:59Z');
      const other = new VDate('2024-01-15T00:00:00Z');
      expect(vd.isBefore(other, 'day')).toBe(false); // same day when compared at day level
    });
  });

  describe('isAfter()', () => {
    it('should return true if after compared date', () => {
      const vd = new VDate('2024-01-20T12:30:00Z');
      const other = new VDate('2024-01-15T12:30:00Z');
      expect(vd.isAfter(other)).toBe(true);
    });

    it('should return false if before compared date', () => {
      const vd = new VDate('2024-01-15T12:30:00Z');
      const other = new VDate('2024-01-20T12:30:00Z');
      expect(vd.isAfter(other)).toBe(false);
    });

    it('should compare with unit', () => {
      const vd = new VDate('2024-02-15T12:30:00Z');
      const other = new VDate('2024-01-15T12:30:00Z');
      expect(vd.isAfter(other, 'month')).toBe(true);
    });
  });

  describe('isSame()', () => {
    it('should return true if same timestamp', () => {
      const vd = new VDate('2024-01-15T12:30:00Z');
      const other = new VDate('2024-01-15T12:30:00Z');
      expect(vd.isSame(other)).toBe(true);
    });

    it('should return false if different timestamp', () => {
      const vd = new VDate('2024-01-15T12:30:00Z');
      const other = new VDate('2024-01-15T12:31:00Z');
      expect(vd.isSame(other)).toBe(false);
    });

    it('should compare with unit (day)', () => {
      const vd = new VDate('2024-01-15T23:59:59Z');
      const other = new VDate('2024-01-15T00:00:00Z');
      expect(vd.isSame(other, 'day')).toBe(true);
    });

    it('should compare with unit (month)', () => {
      const vd = new VDate('2024-01-15T12:30:00Z');
      const other = new VDate('2024-01-20T12:30:00Z');
      expect(vd.isSame(other, 'month')).toBe(true);
    });
  });

  describe('isSameOrBefore()', () => {
    it('should return true if before', () => {
      const vd = new VDate('2024-01-15T12:30:00Z');
      const other = new VDate('2024-01-20T12:30:00Z');
      expect(vd.isSameOrBefore(other)).toBe(true);
    });

    it('should return true if same', () => {
      const vd = new VDate('2024-01-15T12:30:00Z');
      const other = new VDate('2024-01-15T12:30:00Z');
      expect(vd.isSameOrBefore(other)).toBe(true);
    });

    it('should return false if after', () => {
      const vd = new VDate('2024-01-20T12:30:00Z');
      const other = new VDate('2024-01-15T12:30:00Z');
      expect(vd.isSameOrBefore(other)).toBe(false);
    });
  });

  describe('isSameOrAfter()', () => {
    it('should return true if after', () => {
      const vd = new VDate('2024-01-20T12:30:00Z');
      const other = new VDate('2024-01-15T12:30:00Z');
      expect(vd.isSameOrAfter(other)).toBe(true);
    });

    it('should return true if same', () => {
      const vd = new VDate('2024-01-15T12:30:00Z');
      const other = new VDate('2024-01-15T12:30:00Z');
      expect(vd.isSameOrAfter(other)).toBe(true);
    });

    it('should return false if before', () => {
      const vd = new VDate('2024-01-15T12:30:00Z');
      const other = new VDate('2024-01-20T12:30:00Z');
      expect(vd.isSameOrAfter(other)).toBe(false);
    });
  });

  describe('isBetween()', () => {
    const start = new VDate('2024-01-10T12:30:00Z');
    const end = new VDate('2024-01-20T12:30:00Z');

    it('should return true if between (inclusive by default)', () => {
      const vd = new VDate('2024-01-15T12:30:00Z');
      expect(vd.isBetween(start, end)).toBe(true);
    });

    it('should include start date by default', () => {
      expect(start.isBetween(start, end)).toBe(true);
    });

    it('should exclude end date by default', () => {
      expect(end.isBetween(start, end)).toBe(false);
    });

    it('should return false if before start', () => {
      const vd = new VDate('2024-01-05T12:30:00Z');
      expect(vd.isBetween(start, end)).toBe(false);
    });

    it('should return false if after end', () => {
      const vd = new VDate('2024-01-25T12:30:00Z');
      expect(vd.isBetween(start, end)).toBe(false);
    });

    it('should support [] inclusivity (both inclusive)', () => {
      expect(end.isBetween(start, end, undefined, '[]')).toBe(true);
    });

    it('should support () exclusivity (both exclusive)', () => {
      expect(start.isBetween(start, end, undefined, '()')).toBe(false);
      expect(end.isBetween(start, end, undefined, '()')).toBe(false);
    });
  });

  describe('isDayjs()', () => {
    it('should return true for VDate instance', () => {
      const vd = new VDate();
      expect(vd.isDayjs()).toBe(true);
    });
  });
});
