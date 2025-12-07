import { describe, it, expect, beforeAll } from 'vitest';
import { VDate, extend, MinMaxPlugin, LocaleDataPlugin, CalendarPlugin, DurationPlugin, Duration, CustomParseFormatPlugin } from '../src/core';

describe('Tier 4 Plugins', () => {
  describe('MinMax Plugin', () => {
    beforeAll(function () {
      extend(MinMaxPlugin);
    });

    it('should find maximum date with spread arguments', () => {
      const d1 = new VDate('2024-01-15');
      const d2 = new VDate('2024-01-20');
      const d3 = new VDate('2024-01-10');

      const max = (VDate as any).max(d1, d2, d3);
      expect(max.unix()).toBe(d2.unix());
    });

    it('should find maximum date with array argument', () => {
      const dates = [new VDate('2024-01-15'), new VDate('2024-01-20'), new VDate('2024-01-10')];
      const max = (VDate as any).max(dates);
      expect(max.unix()).toBe(dates[1].unix());
    });

    it('should find minimum date with spread arguments', () => {
      const d1 = new VDate('2024-01-15');
      const d2 = new VDate('2024-01-20');
      const d3 = new VDate('2024-01-10');

      const min = (VDate as any).min(d1, d2, d3);
      expect(min.unix()).toBe(d3.unix());
    });

    it('should find minimum date with array argument', () => {
      const dates = [new VDate('2024-01-15'), new VDate('2024-01-20'), new VDate('2024-01-10')];
      const min = (VDate as any).min(dates);
      expect(min.unix()).toBe(dates[2].unix());
    });

    it('should throw error on empty list', () => {
      expect(() => (VDate as any).max()).toThrow();
      expect(() => (VDate as any).min()).toThrow();
    });
  });

  describe('LocaleData Plugin', () => {
    beforeAll(function () {
      extend(LocaleDataPlugin);
    });

    it('should return locale data with months', () => {
      const vd = new VDate('2024-01-15', { locale: 'en-US' });
      const data = (vd as any).localeData();

      expect(data.months).toBeDefined();
      expect(data.months.length).toBe(12);
      expect(data.months[0].toLowerCase()).toContain('january');
    });

    it('should return short month names', () => {
      const vd = new VDate('2024-01-15', { locale: 'en-US' });
      const data = (vd as any).localeData();

      expect(data.monthsShort).toBeDefined();
      expect(data.monthsShort.length).toBe(12);
      expect(data.monthsShort[0].toLowerCase()).toContain('jan');
    });

    it('should return weekday names', () => {
      const vd = new VDate('2024-01-15', { locale: 'en-US' });
      const data = (vd as any).localeData();

      expect(data.weekdays).toBeDefined();
      expect(data.weekdays.length).toBe(7);
      expect(data.weekdaysShort).toBeDefined();
      expect(data.weekdaysShort.length).toBe(7);
    });

    it('should return meridiem (AM/PM)', () => {
      const vd = new VDate('2024-01-15', { locale: 'en-US' });
      const data = (vd as any).localeData();

      expect(data.meridiem).toBeDefined();
      expect(data.meridiem.am).toBeDefined();
      expect(data.meridiem.pm).toBeDefined();
    });
  });

  describe('Calendar Plugin', () => {
    beforeAll(function () {
      extend(CalendarPlugin);
    });

    it('should format as "Today" for current date', () => {
      const today = new VDate();
      const result = (today as any).calendar();

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should format as "Yesterday" for previous day', () => {
      const yesterday = new VDate().subtract(1, 'day');
      const result = (yesterday as any).calendar();

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should format as "Tomorrow" for next day', () => {
      const tomorrow = new VDate().add(1, 'day');
      const result = (tomorrow as any).calendar();

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should support custom format options', () => {
      const today = new VDate();
      const options = { sameDay: 'YYYY-MM-DD HH:mm' };
      const result = (today as any).calendar(options);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('2025');
    });

    it('should format last week dates', () => {
      const lastWeek = new VDate().subtract(5, 'day');
      const result = (lastWeek as any).calendar();

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should format next week dates', () => {
      const nextWeek = new VDate().add(5, 'day');
      const result = (nextWeek as any).calendar();

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('Duration Plugin', () => {
    beforeAll(function () {
      extend(DurationPlugin);
    });

    it('should create duration from milliseconds', () => {
      const duration = new Duration(1000, 'millisecond');
      expect(duration.asSeconds()).toBe(1);
    });

    it('should create duration from seconds', () => {
      const duration = new Duration(60, 'second');
      expect(duration.asMinutes()).toBe(1);
    });

    it('should create duration from minutes', () => {
      const duration = new Duration(60, 'minute');
      expect(duration.asHours()).toBe(1);
    });

    it('should create duration from hours', () => {
      const duration = new Duration(24, 'hour');
      expect(duration.asDays()).toBeCloseTo(1);
    });

    it('should create duration from days', () => {
      const duration = new Duration(7, 'day');
      expect(duration.asWeeks()).toBe(1);
    });

    it('should create duration from object', () => {
      const duration = new Duration({ day: 1, hour: 2 });
      expect(duration.asDays()).toBeGreaterThan(1);
    });

    it('should add durations', () => {
      const d1 = new Duration(1, 'day');
      const d2 = new Duration(1, 'day');
      const result = d1.add(d2);

      expect(result.asDays()).toBe(2);
    });

    it('should subtract durations', () => {
      const d1 = new Duration(2, 'day');
      const d2 = new Duration(1, 'day');
      const result = d1.subtract(d2);

      expect(result.asDays()).toBe(1);
    });

    it('should humanize duration', () => {
      const d1 = new Duration(5, 'second');
      const humanized = d1.humanize();

      expect(humanized).toContain('second');
    });

    it('should humanize large durations', () => {
      const d1 = new Duration(2, 'day');
      const humanized = d1.humanize();

      expect(humanized).toContain('day');
    });

    it('should convert to object', () => {
      const d = new Duration({ day: 2, hour: 5 });
      const obj = d.asObject();

      expect(obj.days).toBeGreaterThan(0);
      expect(obj.hours).toBeGreaterThan(0);
    });

    it('should create duration via static method', () => {
      const duration = (VDate as any).duration(1, 'day');
      expect(duration).toBeInstanceOf(Duration);
    });

    it('should check if duration is valid', () => {
      const duration = new Duration(100);
      expect(duration.isValid()).toBe(true);
    });

    it('should get duration from VDate instance', () => {
      const d1 = new VDate('2024-01-15');
      const d2 = new VDate('2024-01-20');
      const duration = (d1 as any).toDuration(d2);

      expect(duration).toBeInstanceOf(Duration);
      expect(Math.abs(duration.asDays())).toBe(5);
    });
  });

  describe('CustomParseFormat Plugin', () => {
    beforeAll(function () {
      extend(CustomParseFormatPlugin);
    });

    it('should parse date with YYYY-MM-DD format', () => {
      const vd = (VDate as any).parseFormat('2024-01-15', 'YYYY-MM-DD');

      expect(vd.year()).toBe(2024);
      expect(vd.month()).toBe(1);
      expect(vd.date()).toBe(15);
    });

    it('should parse date with MM/DD/YYYY format', () => {
      const vd = (VDate as any).parseFormat('01/15/2024', 'MM/DD/YYYY');

      expect(vd.year()).toBe(2024);
      expect(vd.month()).toBe(1);
      expect(vd.date()).toBe(15);
    });

    it('should parse date with time', () => {
      const vd = (VDate as any).parseFormat('2024-01-15 14:30:45', 'YYYY-MM-DD HH:mm:ss');

      expect(vd.year()).toBe(2024);
      expect(vd.hour()).toBe(14);
      expect(vd.minute()).toBe(30);
      expect(vd.second()).toBe(45);
    });

    it('should parse month names', () => {
      const vd = (VDate as any).parseFormat('January 15, 2024', 'MMMM DD, YYYY');

      expect(vd.year()).toBe(2024);
      expect(vd.month()).toBe(1);
      expect(vd.date()).toBe(15);
    });

    it('should parse short month names', () => {
      const vd = (VDate as any).parseFormat('Jan 15, 2024', 'MMM DD, YYYY');

      expect(vd.year()).toBe(2024);
      expect(vd.month()).toBe(1);
      expect(vd.date()).toBe(15);
    });

    it('should parse 2-digit year', () => {
      const vd = (VDate as any).parseFormat('24-01-15', 'YY-MM-DD');

      expect(vd.year()).toBe(2024);
    });

    it('should parse with milliseconds', () => {
      const vd = (VDate as any).parseFormat('2024-01-15T14:30:45.500', 'YYYY-MM-DDTHH:mm:ss.SSS');

      expect(vd.millisecond()).toBe(500);
    });

    it('should throw on invalid format', () => {
      expect(() => {
        (VDate as any).parseFormat('not-a-date', 'YYYY-MM-DD');
      }).toThrow();
    });

    it('should support locale parameter', () => {
      const vd = (VDate as any).parseFormat('2024-01-15', 'YYYY-MM-DD', 'ja-JP');

      expect(vd.getLocale()).toBe('ja-JP');
    });
  });
});
