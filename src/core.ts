import { addGetSetMethods } from './getSet';
import { addFormatMethod } from './format';
import { addManipulateMethods } from './manipulate';
import { addQueryMethods, type QueryUnit } from './query';
import { addUtilMethods } from './utils';
import { extend } from './plugin';

export { extend };
export type { QueryUnit };

export interface VDateConfig {
  locale?: string;
  tz?: string;
}

export class VDate {
  private $d: Date;
  private $tz: string;
  private $locale: string;

  constructor(
    date: Date | string | number | VDate | any[] | Record<string, number> = new Date(),
    config?: VDateConfig
  ) {
    if (date instanceof VDate) {
      this.$d = new Date(date.$d.getTime());
    } else if (date instanceof Date) {
      this.$d = new Date(date.getTime());
    } else if (Array.isArray(date)) {
      // Array parsing: [year, month (0-11), day, hour, minute, second, millisecond]
      const [year, month = 0, day = 1, hour = 0, minute = 0, second = 0, millisecond = 0] = date;
      this.$d = new Date(Date.UTC(year, month, day, hour, minute, second, millisecond));
    } else if (typeof date === 'object' && date !== null) {
      // Object parsing: { year, month, date, hour, minute, second, millisecond }
      const { year, month, date: dateVal, hour = 0, minute = 0, second = 0, millisecond = 0 } = date;
      this.$d = new Date(Date.UTC(year, (month || 1) - 1, dateVal || 1, hour, minute, second, millisecond));
    } else if (typeof date === 'string' || typeof date === 'number') {
      this.$d = new Date(date);
    } else {
      this.$d = new Date();
    }

    // Validate that the date is valid
    if (isNaN(this.$d.getTime())) {
      throw new Error('Invalid date');
    }

    try {
      this.$tz = config?.tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      this.$tz = 'UTC';
    }

    try {
      if (config?.locale) {
        this.$locale = config.locale;
      } else if (typeof navigator !== 'undefined' && navigator.language) {
        this.$locale = navigator.language;
      } else {
        this.$locale = 'en-US';
      }
    } catch {
      this.$locale = 'en-US';
    }
  }

  clone(): VDate {
    return new VDate(this.$d, { tz: this.$tz, locale: this.$locale });
  }

  getInternalDate(): Date {
    return new Date(this.$d.getTime());
  }

  getTimezone(): string {
    return this.$tz;
  }

  getLocale(): string {
    return this.$locale;
  }

  unix(): number {
    return this.$d.getTime();
  }

  toISOString(): string {
    return this.$d.toISOString();
  }

  toDate(): Date {
    return new Date(this.$d.getTime());
  }

  toString(): string {
    return this.$d.toString();
  }
}

// Interface augmentation for dynamically added methods
export interface VDate {
  // Plugin methods (dynamically added by plugins)
  fromNow(options?: Intl.RelativeTimeFormatOptions): string;
  toNow(options?: Intl.RelativeTimeFormatOptions): string;
  tz(timezone: string): VDate;
  utc(): VDate;
  local(): VDate;
  localeData?(): any;
  calendar?(options?: any): string;
  formatLocalized?(format: string): string;
  toDuration?(compared?: any): any;

  // Manipulate methods (added by addManipulateMethods)
  add(value: number, unit: string): VDate;
  subtract(value: number, unit: string): VDate;
  startOf(unit: string): VDate;
  endOf(unit: string): VDate;
  diff(compared: any, unit?: string, precise?: boolean): number;
  daysInMonth(): number;

  // Getter/Setter methods (added by addGetSetMethods)
  year(): number;
  year(value: number): VDate;
  month(): number;
  month(value: number): VDate;
  date(): number;
  date(value: number): VDate;
  day(): number;
  day(value: number): VDate;
  hour(): number;
  hour(value: number): VDate;
  minute(): number;
  minute(value: number): VDate;
  second(): number;
  second(value: number): VDate;
  millisecond(): number;
  millisecond(value: number): VDate;
  get(unit: string): number;
  set(unit: string, value: number): VDate;

  // Query methods (added by addQueryMethods)
  isBefore(compared: any, unit?: string): boolean;
  isAfter(compared: any, unit?: string): boolean;
  isSame(compared: any, unit?: string): boolean;
  isSameOrBefore(compared: any, unit?: string): boolean;
  isSameOrAfter(compared: any, unit?: string): boolean;
  isBetween(start: any, end: any, unit?: string, inclusivity?: string): boolean;
  isDayjs(): boolean;

  // Utility methods (added by addUtilMethods)
  dayOfYear(): number;
  weekOfYear(): number;
  isLeapYear(): boolean;
  quarter(): number;
  toObject(): Record<string, number>;
  toArray(): number[];

  // Format method (added by addFormatMethod)
  format(pattern: string): string;
}

export function isValid(date: unknown): date is Date {
  if (!(date instanceof Date)) {
    return false;
  }
  return !isNaN(date.getTime());
}

export function volt(date: Date | string | number | VDate = new Date(), config?: VDateConfig): VDate {
  return new VDate(date, config);
}

// Add getter/setter methods to VDate class
addGetSetMethods(VDate);

// Add format method to VDate class
addFormatMethod(VDate);

// Add manipulation methods to VDate class
addManipulateMethods(VDate);

// Add query methods to VDate class
addQueryMethods(VDate);

// Add utility methods to VDate class
addUtilMethods(VDate);
