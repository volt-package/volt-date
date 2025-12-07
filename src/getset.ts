import { VDate } from './core';

export function addGetSetMethods(VDateClass: typeof VDate): void {
  (VDateClass.prototype as any).year = function (value?: number): number | VDate {
    if (value === undefined) {
      return this.getInternalDate().getUTCFullYear();
    }
    const date = this.clone();
    date['$d'].setUTCFullYear(value);
    return date;
  };

  (VDateClass.prototype as any).month = function (value?: number): number | VDate {
    if (value === undefined) {
      return this.getInternalDate().getUTCMonth() + 1;
    }
    const date = this.clone();
    const currentDate = date['$d'].getUTCDate();
    date['$d'].setUTCMonth(value - 1);

    // Handle day overflow - clamp to last day of target month
    if (date['$d'].getUTCDate() !== currentDate) {
      // Day overflowed, set to last day of previous month
      date['$d'].setUTCDate(0);
    }

    return date;
  };

  (VDateClass.prototype as any).date = function (value?: number): number | VDate {
    if (value === undefined) {
      return this.getInternalDate().getUTCDate();
    }
    const date = this.clone();
    // Clamp value between 1 and days in month
    const year = date['$d'].getUTCFullYear();
    const month = date['$d'].getUTCMonth();
    const maxDays = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const clampedValue = Math.max(1, Math.min(value, maxDays));
    date['$d'].setUTCDate(clampedValue);
    return date;
  };

  (VDateClass.prototype as any).day = function (value?: number): number | VDate {
    if (value === undefined) {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: this.getTimezone(),
        weekday: 'short',
      });
      const weekdayStr = formatter.format(this.toDate());
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days.indexOf(weekdayStr);
    }
    const date = this.clone();
    const currentDay = (this.day() as number);
    const diff = value - currentDay;
    date['$d'].setUTCDate(date['$d'].getUTCDate() + diff);
    return date;
  };

  (VDateClass.prototype as any).hour = function (value?: number): number | VDate {
    if (value === undefined) {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: this.getTimezone(),
        hour: '2-digit',
        hour12: false,
      });
      const parts = formatter.formatToParts(this.toDate());
      const hourPart = parts.find((p) => p.type === 'hour');
      return parseInt(hourPart?.value || '0');
    }
    const date = this.clone();
    date['$d'].setUTCHours(value);
    return date;
  };

  (VDateClass.prototype as any).minute = function (value?: number): number | VDate {
    if (value === undefined) {
      return this.getInternalDate().getUTCMinutes();
    }
    const date = this.clone();
    date['$d'].setUTCMinutes(value);
    return date;
  };

  (VDateClass.prototype as any).second = function (value?: number): number | VDate {
    if (value === undefined) {
      return this.getInternalDate().getUTCSeconds();
    }
    const date = this.clone();
    date['$d'].setUTCSeconds(value);
    return date;
  };

  (VDateClass.prototype as any).millisecond = function (value?: number): number | VDate {
    if (value === undefined) {
      return this.getInternalDate().getUTCMilliseconds();
    }
    const date = this.clone();
    date['$d'].setUTCMilliseconds(value);
    return date;
  };

  (VDateClass.prototype as any).get = function (unit: string): number {
    switch (unit) {
      case 'year':
        return this.year() as number;
      case 'month':
        return this.month() as number;
      case 'date':
      case 'D':
        return this.date() as number;
      case 'day':
      case 'd':
        return this.day() as number;
      case 'hour':
      case 'H':
        return this.hour() as number;
      case 'minute':
      case 'm':
        return this.minute() as number;
      case 'second':
      case 's':
        return this.second() as number;
      case 'millisecond':
      case 'ms':
        return this.millisecond() as number;
      default:
        throw new Error(`Unknown unit: ${unit}`);
    }
  };

  (VDateClass.prototype as any).set = function (unit: string, value: number): VDate {
    switch (unit) {
      case 'year':
        return this.year(value);
      case 'month':
        return this.month(value);
      case 'date':
      case 'D':
        return this.date(value);
      case 'day':
      case 'd':
        return this.day(value);
      case 'hour':
      case 'H':
        return this.hour(value);
      case 'minute':
      case 'm':
        return this.minute(value);
      case 'second':
      case 's':
        return this.second(value);
      case 'millisecond':
      case 'ms':
        return this.millisecond(value);
      default:
        throw new Error(`Unknown unit: ${unit}`);
    }
  };
}
