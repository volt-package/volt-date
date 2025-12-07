import { addGetSetMethods } from "./getset";
import { addFormatMethod } from "./format";
import { addManipulateMethods } from "./manipulate";
import { addQueryMethods, type QueryUnit } from "./query";
import { addUtilMethods } from "./utils";
import { extend, RelativeTimePlugin, TimezonePlugin } from "./plugin";
import { MinMaxPlugin } from "./plugins/minmax";
import { LocaleDataPlugin } from "./plugins/localedata";
import { CalendarPlugin } from "./plugins/calendar";
import { LocalizedFormatPlugin } from "./plugins/localizedformat";
import { DurationPlugin, Duration } from "./plugins/duration";
import { CustomParseFormatPlugin } from "./plugins/customparseformat";

export { extend, RelativeTimePlugin, TimezonePlugin };
export {
  MinMaxPlugin,
  LocaleDataPlugin,
  CalendarPlugin,
  LocalizedFormatPlugin,
  DurationPlugin,
  Duration,
};
export { CustomParseFormatPlugin };
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
    date:
      | Date
      | string
      | number
      | VDate
      | any[]
      | Record<string, number> = new Date(),
    config?: VDateConfig
  ) {
    if (date instanceof VDate) {
      this.$d = new Date(date.$d.getTime());
    } else if (date instanceof Date) {
      this.$d = new Date(date.getTime());
    } else if (Array.isArray(date)) {
      // Array parsing: [year, month (0-11), day, hour, minute, second, millisecond]
      const [
        year,
        month = 0,
        day = 1,
        hour = 0,
        minute = 0,
        second = 0,
        millisecond = 0,
      ] = date;
      this.$d = new Date(
        Date.UTC(year, month, day, hour, minute, second, millisecond)
      );
    } else if (typeof date === "object" && date !== null) {
      // Object parsing: { year, month, date, hour, minute, second, millisecond }
      const {
        year,
        month,
        date: dateVal,
        hour = 0,
        minute = 0,
        second = 0,
        millisecond = 0,
      } = date;
      this.$d = new Date(
        Date.UTC(
          year,
          (month || 1) - 1,
          dateVal || 1,
          hour,
          minute,
          second,
          millisecond
        )
      );
    } else if (typeof date === "string" || typeof date === "number") {
      this.$d = new Date(date);
    } else {
      this.$d = new Date();
    }

    // Validate that the date is valid
    if (isNaN(this.$d.getTime())) {
      throw new Error("Invalid date");
    }

    try {
      this.$tz = config?.tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      this.$tz = "UTC";
    }

    try {
      if (config?.locale) {
        this.$locale = config.locale;
      } else if (typeof navigator !== "undefined" && navigator.language) {
        this.$locale = navigator.language;
      } else {
        this.$locale = "en-US";
      }
    } catch {
      this.$locale = "en-US";
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

export function volt(
  date: Date | string | number | VDate = new Date(),
  config?: VDateConfig
): VDate {
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
