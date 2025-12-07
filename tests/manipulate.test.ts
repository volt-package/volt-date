import { describe, it, expect } from 'vitest';
import { VDate, volt } from '../src/core';

describe('VDate Manipulate', () => {
  describe('add()', () => {
    it('should add years', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC' });
      const result = vd.add(1, 'year');

      expect(result.year()).toBe(2025);
      expect(result.month()).toBe(1);
      expect(result.date()).toBe(15);
      expect(vd.year()).toBe(2024); // original unchanged
    });

    it('should add months with overflow handling', () => {
      const vd = new VDate('2024-01-31T12:30:45.500Z', { tz: 'UTC' });
      const result = vd.add(1, 'month');

      expect(result.year()).toBe(2024);
      expect(result.month()).toBe(2);
      expect(result.date()).toBe(29); // February 2024 has 29 days
    });

    it('should add weeks', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC' });
      const result = vd.add(1, 'week');

      expect(result.date()).toBe(22);
      expect(result.month()).toBe(1);
    });

    it('should add days', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC' });
      const result = vd.add(10, 'day');

      expect(result.date()).toBe(25);
      expect(result.month()).toBe(1);
    });

    it('should add days across month boundary', () => {
      const vd = new VDate('2024-01-25T12:30:45.500Z', { tz: 'UTC' });
      const result = vd.add(10, 'day');

      expect(result.date()).toBe(4);
      expect(result.month()).toBe(2);
    });

    it('should add hours', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC' });
      const result = vd.add(5, 'hour');

      expect(result.hour()).toBe(17);
      expect(result.minute()).toBe(30);
      expect(result.second()).toBe(45);
    });

    it('should add minutes', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC' });
      const result = vd.add(30, 'minute');

      expect(result.minute()).toBe(0);
      expect(result.hour()).toBe(13);
    });

    it('should add seconds', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC' });
      const result = vd.add(30, 'second');

      expect(result.second()).toBe(15);
      expect(result.minute()).toBe(31);
    });

    it('should add milliseconds', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC' });
      const result = vd.add(500, 'millisecond');

      expect(result.millisecond()).toBe(0);
      expect(result.second()).toBe(46);
    });

    it('should handle negative values', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC' });
      const result = vd.add(-5, 'day');

      expect(result.date()).toBe(10);
    });

    it('should be chainable', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC' });
      const result = vd.add(1, 'year').add(1, 'month').add(1, 'day');

      expect(result.year()).toBe(2025);
      expect(result.month()).toBe(2);
      expect(result.date()).toBe(16);
    });
  });

  describe('subtract()', () => {
    it('should subtract years', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC' });
      const result = vd.subtract(1, 'year');

      expect(result.year()).toBe(2023);
    });

    it('should subtract months', () => {
      const vd = new VDate('2024-03-31T12:30:45.500Z', { tz: 'UTC' });
      const result = vd.subtract(1, 'month');

      expect(result.month()).toBe(2);
      expect(result.date()).toBe(29); // Feb 2024 has 29 days
    });

    it('should subtract days', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC' });
      const result = vd.subtract(10, 'day');

      expect(result.date()).toBe(5);
    });

    it('should subtract hours', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'UTC' });
      const result = vd.subtract(5, 'hour');

      expect(result.hour()).toBe(7);
    });
  });

  describe('startOf()', () => {
    it('should set to start of year', () => {
      const vd = new VDate('2024-06-15T14:30:45.500Z', { tz: 'UTC' });
      const result = vd.startOf('year');

      expect(result.year()).toBe(2024);
      expect(result.month()).toBe(1);
      expect(result.date()).toBe(1);
      expect(result.hour()).toBe(0);
      expect(result.minute()).toBe(0);
      expect(result.second()).toBe(0);
      expect(result.millisecond()).toBe(0);
    });

    it('should set to start of month', () => {
      const vd = new VDate('2024-06-15T14:30:45.500Z', { tz: 'UTC' });
      const result = vd.startOf('month');

      expect(result.year()).toBe(2024);
      expect(result.month()).toBe(6);
      expect(result.date()).toBe(1);
      expect(result.hour()).toBe(0);
      expect(result.minute()).toBe(0);
      expect(result.second()).toBe(0);
      expect(result.millisecond()).toBe(0);
    });

    it('should set to start of week (Sunday)', () => {
      // 2024-01-15 is Monday
      const vd = new VDate('2024-01-15T14:30:45.500Z', { tz: 'UTC' });
      const result = vd.startOf('week');

      expect(result.date()).toBe(14); // Previous Sunday
      expect(result.hour()).toBe(0);
      expect(result.minute()).toBe(0);
    });

    it('should set to start of day', () => {
      const vd = new VDate('2024-06-15T14:30:45.500Z', { tz: 'UTC' });
      const result = vd.startOf('day');

      expect(result.year()).toBe(2024);
      expect(result.month()).toBe(6);
      expect(result.date()).toBe(15);
      expect(result.hour()).toBe(0);
      expect(result.minute()).toBe(0);
      expect(result.second()).toBe(0);
      expect(result.millisecond()).toBe(0);
    });

    it('should set to start of hour', () => {
      const vd = new VDate('2024-06-15T14:30:45.500Z', { tz: 'UTC' });
      const result = vd.startOf('hour');

      expect(result.hour()).toBe(14);
      expect(result.minute()).toBe(0);
      expect(result.second()).toBe(0);
      expect(result.millisecond()).toBe(0);
    });

    it('should set to start of minute', () => {
      const vd = new VDate('2024-06-15T14:30:45.500Z', { tz: 'UTC' });
      const result = vd.startOf('minute');

      expect(result.minute()).toBe(30);
      expect(result.second()).toBe(0);
      expect(result.millisecond()).toBe(0);
    });

    it('should set to start of second', () => {
      const vd = new VDate('2024-06-15T14:30:45.500Z', { tz: 'UTC' });
      const result = vd.startOf('second');

      expect(result.second()).toBe(45);
      expect(result.millisecond()).toBe(0);
    });

    it('should not modify original', () => {
      const vd = new VDate('2024-06-15T14:30:45.500Z', { tz: 'UTC' });
      const original = vd.unix();

      vd.startOf('day');
      expect(vd.unix()).toBe(original);
    });
  });

  describe('endOf()', () => {
    it('should set to end of year', () => {
      const vd = new VDate('2024-06-15T14:30:45.500Z', { tz: 'UTC' });
      const result = vd.endOf('year');

      expect(result.year()).toBe(2024);
      expect(result.month()).toBe(12);
      expect(result.date()).toBe(31);
      expect(result.hour()).toBe(23);
      expect(result.minute()).toBe(59);
      expect(result.second()).toBe(59);
      expect(result.millisecond()).toBe(999);
    });

    it('should set to end of month', () => {
      const vd = new VDate('2024-06-15T14:30:45.500Z', { tz: 'UTC' });
      const result = vd.endOf('month');

      expect(result.year()).toBe(2024);
      expect(result.month()).toBe(6);
      expect(result.date()).toBe(30); // June has 30 days
      expect(result.hour()).toBe(23);
      expect(result.minute()).toBe(59);
      expect(result.second()).toBe(59);
      expect(result.millisecond()).toBe(999);
    });

    it('should set to end of day', () => {
      const vd = new VDate('2024-06-15T14:30:45.500Z', { tz: 'UTC' });
      const result = vd.endOf('day');

      expect(result.year()).toBe(2024);
      expect(result.month()).toBe(6);
      expect(result.date()).toBe(15);
      expect(result.hour()).toBe(23);
      expect(result.minute()).toBe(59);
      expect(result.second()).toBe(59);
      expect(result.millisecond()).toBe(999);
    });

    it('should set to end of hour', () => {
      const vd = new VDate('2024-06-15T14:30:45.500Z', { tz: 'UTC' });
      const result = vd.endOf('hour');

      expect(result.hour()).toBe(14);
      expect(result.minute()).toBe(59);
      expect(result.second()).toBe(59);
      expect(result.millisecond()).toBe(999);
    });

    it('should set to end of minute', () => {
      const vd = new VDate('2024-06-15T14:30:45.500Z', { tz: 'UTC' });
      const result = vd.endOf('minute');

      expect(result.minute()).toBe(30);
      expect(result.second()).toBe(59);
      expect(result.millisecond()).toBe(999);
    });

    it('should set to end of second', () => {
      const vd = new VDate('2024-06-15T14:30:45.500Z', { tz: 'UTC' });
      const result = vd.endOf('second');

      expect(result.second()).toBe(45);
      expect(result.millisecond()).toBe(999);
    });

    it('should not modify original', () => {
      const vd = new VDate('2024-06-15T14:30:45.500Z', { tz: 'UTC' });
      const original = vd.unix();

      vd.endOf('day');
      expect(vd.unix()).toBe(original);
    });
  });

  describe('Common patterns', () => {
    it('should handle date range queries', () => {
      const vd = new VDate('2024-06-15T14:30:45.500Z', { tz: 'UTC' });
      const startOfMonth = vd.startOf('month');
      const endOfMonth = vd.endOf('month');

      expect(startOfMonth.unix() < endOfMonth.unix()).toBe(true);
    });

    it('should work with timezone-aware dates', () => {
      const vd = new VDate('2024-01-15T12:30:45.500Z', { tz: 'Asia/Seoul' });
      const result = vd.add(1, 'day');

      expect(result.getTimezone()).toBe('Asia/Seoul');
    });

    it('should handle year boundaries', () => {
      const vd = new VDate('2024-12-31T23:00:00Z', { tz: 'UTC' });
      const result = vd.add(2, 'hour');

      expect(result.year()).toBe(2025);
      expect(result.month()).toBe(1);
      expect(result.date()).toBe(1);
      expect(result.hour()).toBe(1);
    });

    it('should handle leap year transitions', () => {
      const vd = new VDate('2024-02-29T12:00:00Z', { tz: 'UTC' }); // Leap year
      const result = vd.add(1, 'year');

      // 2025 is not a leap year, so Feb 29 -> Feb 28
      expect(result.month()).toBe(2);
      expect(result.date()).toBe(28);
    });
  });
});
