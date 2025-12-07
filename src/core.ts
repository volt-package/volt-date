import { addGetSetMethods } from './getset';
import { addFormatMethod } from './format';
import { addManipulateMethods, type ManipulateUnit, type StartEndUnit } from './manipulate';
import { addQueryMethods, type QueryUnit } from './query';
import { addUtilMethods } from './utils';
import { extend, RelativeTimePlugin, TimezonePlugin } from './plugin';
import { MinMaxPlugin } from './plugins/minmax';
import { LocaleDataPlugin } from './plugins/localedata';
import { CalendarPlugin } from './plugins/calendar';
import { LocalizedFormatPlugin } from './plugins/localizedformat';
import { DurationPlugin, Duration } from './plugins/duration';
import { CustomParseFormatPlugin } from './plugins/customparseformat';

export { extend, RelativeTimePlugin, TimezonePlugin };
export { MinMaxPlugin, LocaleDataPlugin, CalendarPlugin, LocalizedFormatPlugin, DurationPlugin, Duration };
export { CustomParseFormatPlugin };
export type { QueryUnit };

export interface VDateConfig {
  locale?: string;
  tz?: string;
}

export interface VDate {
  // Format method
  format(pattern: string): string;
  // Manipulate methods
  add(value: number, unit: ManipulateUnit): VDate;
  subtract(value: number, unit: ManipulateUnit): VDate;
  startOf(unit: StartEndUnit): VDate;
  endOf(unit: StartEndUnit): VDate;
  diff(compared: any, unit?: ManipulateUnit, precise?: boolean): number;
  daysInMonth(): number;
  // Getter/Setter methods
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
  // Query methods
  isBefore(compared: any, unit?: QueryUnit): boolean;
  isAfter(compared: any, unit?: QueryUnit): boolean;
  isSame(compared: any, unit?: QueryUnit): boolean;
  isSameOrBefore(compared: any, unit?: QueryUnit): boolean;
  isSameOrAfter(compared: any, unit?: QueryUnit): boolean;
  isBetween(start: any, end: any, unit?: QueryUnit, inclusivity?: '[)' | '[]' | '(]' | '()'): boolean;
  isDayjs(): boolean;
  // Utility methods
  dayOfYear(): number;
  weekOfYear(): number;
  isLeapYear(): boolean;
  quarter(): number;
  toObject(): Record<string, number>;
  toArray(): number[];
  // RelativeTimePlugin methods
  fromNow(options?: Intl.RelativeTimeFormatOptions): string;
  toNow(options?: Intl.RelativeTimeFormatOptions): string;
  // TimezonePlugin methods
  tz(timezone: string): VDate;
  utc(): VDate;
  local(): VDate;
  // Plugin methods (optional)
  localeData?(): any;
  calendar?(options?: any): string;
  formatLocalized?(format: string): string;
  toDuration?(compared?: any): Duration;
}

export class VDate {
  private $d: Date;
  private $tz: string;
  private $locale: string;

  constructor(date: Date | string | number | VDate | any[] | Record<string, number> = new Date(), config?: VDateConfig) {
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

// Register built-in plugins
extend(RelativeTimePlugin);
extend(TimezonePlugin);
