import { VDate } from './core';

export type ManipulateUnit =
  | 'year'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond';
export type StartEndUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second';

export function addManipulateMethods(VDateClass: typeof VDate): void {
  (VDateClass.prototype as any).add = function (value: number, unit: ManipulateUnit): VDate {
    switch (unit) {
      case 'year': {
        const newDate = this.clone();
        const newYear = this.year() + value;
        // Handle day overflow for leap year transitions (e.g., Feb 29)
        const month = this.month() - 1; // Convert to 0-11 for Date calculation
        const day = this.date();
        const maxDay = new Date(Date.UTC(newYear, month + 1, 0)).getUTCDate();
        const fixedDay = Math.min(day, maxDay);
        // Set date first to avoid overflow, then year
        newDate['$d'].setUTCDate(fixedDay);
        newDate['$d'].setUTCFullYear(newYear);
        return newDate;
      }
      case 'month': {
        let year = this.year();
        let month = this.month() - 1 + value; // Convert to 0-11, add value, convert back
        let day = this.date();
        year += Math.floor(month / 12);
        month = ((month % 12) + 12) % 12; // Proper modulo for negative numbers
        const maxDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
        if (day > maxDay) day = maxDay;
        return this.year(year)
          .month(month + 1)
          .date(day); // Convert back to 1-12
      }
      case 'week':
        return this.add(value * 7, 'day');
      case 'day': {
        const newDate = this.clone();
        newDate['$d'].setUTCDate(this.date() + value);
        return newDate;
      }
      case 'hour': {
        const ms = value * 60 * 60 * 1000;
        const newDate = new VDate(new Date(this.getInternalDate().getTime() + ms), {
          tz: this.getTimezone(),
          locale: this.getLocale(),
        });
        return newDate;
      }
      case 'minute': {
        const ms = value * 60 * 1000;
        const newDate = new VDate(new Date(this.getInternalDate().getTime() + ms), {
          tz: this.getTimezone(),
          locale: this.getLocale(),
        });
        return newDate;
      }
      case 'second': {
        const ms = value * 1000;
        const newDate = new VDate(new Date(this.getInternalDate().getTime() + ms), {
          tz: this.getTimezone(),
          locale: this.getLocale(),
        });
        return newDate;
      }
      case 'millisecond': {
        const newDate = new VDate(new Date(this.getInternalDate().getTime() + value), {
          tz: this.getTimezone(),
          locale: this.getLocale(),
        });
        return newDate;
      }
      default:
        throw new Error(`Unknown unit: ${unit}`);
    }
  };

  (VDateClass.prototype as any).subtract = function (value: number, unit: ManipulateUnit): VDate {
    return this.add(-value, unit);
  };

  (VDateClass.prototype as any).startOf = function (unit: StartEndUnit): VDate {
    let result = this.clone();
    switch (unit) {
      case 'year':
        result = result.month(1).date(1).hour(0).minute(0).second(0).millisecond(0);
        break;
      case 'month':
        result = result.date(1).hour(0).minute(0).second(0).millisecond(0);
        break;
      case 'week': {
        const dayOfWeek = result.day();
        result = result.add(-dayOfWeek, 'day').hour(0).minute(0).second(0).millisecond(0);
        break;
      }
      case 'day':
        result = result.hour(0).minute(0).second(0).millisecond(0);
        break;
      case 'hour':
        result = result.minute(0).second(0).millisecond(0);
        break;
      case 'minute':
        result = result.second(0).millisecond(0);
        break;
      case 'second':
        result = result.millisecond(0);
        break;
    }
    return result;
  };

  (VDateClass.prototype as any).endOf = function (unit: string): VDate {
    let result = this.clone();
    switch (unit) {
      case 'year':
        result = result.month(12).date(31).hour(23).minute(59).second(59).millisecond(999);
        break;
      case 'month': {
        const nextMonth =
          result.month() === 12
            ? result.year(result.year() + 1).month(1)
            : result.month(result.month() + 1);
        result = nextMonth.date(1).add(-1, 'day').hour(23).minute(59).second(59).millisecond(999);
        break;
      }
      case 'week': {
        const dayOfWeek = result.day();
        const daysUntilSaturday = 6 - dayOfWeek;
        result = result
          .add(daysUntilSaturday, 'day')
          .hour(23)
          .minute(59)
          .second(59)
          .millisecond(999);
        break;
      }
      case 'day':
        result = result.hour(23).minute(59).second(59).millisecond(999);
        break;
      case 'hour':
        result = result.minute(59).second(59).millisecond(999);
        break;
      case 'minute':
        result = result.second(59).millisecond(999);
        break;
      case 'second':
        result = result.millisecond(999);
        break;
    }
    return result;
  };

  (VDateClass.prototype as any).diff = function (
    compared: any,
    unit: ManipulateUnit = 'millisecond',
    precise: boolean = false
  ): number {
    const other =
      compared instanceof (this.constructor as any)
        ? compared
        : new (this.constructor as any)(compared);

    const diff = this.unix() - other.unix();

    switch (unit) {
      case 'year': {
        const months = this.diff(other, 'month', precise);
        return precise ? months / 12 : Math.floor(months / 12);
      }
      case 'month': {
        const thisDate = this.clone().startOf('month');
        const otherDate = other.clone().startOf('month');
        let months = 0;
        let current = otherDate.clone();

        if (diff < 0) {
          while (current.isBefore(thisDate)) {
            months++;
            current = current.add(1, 'month');
          }
          months = -months;
        } else {
          while (current.isBefore(thisDate)) {
            months++;
            current = current.add(1, 'month');
          }
        }

        if (precise) {
          const remainingDays = thisDate.diff(current.add(-1, 'month'), 'day');
          const daysInMonth = current.add(-1, 'month').daysInMonth();
          return months + remainingDays / daysInMonth;
        }

        return months;
      }
      case 'week':
        return precise
          ? diff / (1000 * 60 * 60 * 24 * 7)
          : Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
      case 'day':
        return precise ? diff / (1000 * 60 * 60 * 24) : Math.floor(diff / (1000 * 60 * 60 * 24));
      case 'hour':
        return precise ? diff / (1000 * 60 * 60) : Math.floor(diff / (1000 * 60 * 60));
      case 'minute':
        return precise ? diff / (1000 * 60) : Math.floor(diff / (1000 * 60));
      case 'second':
        return precise ? diff / 1000 : Math.floor(diff / 1000);
      case 'millisecond':
        return diff;
      default:
        throw new Error(`Unknown unit: ${unit}`);
    }
  };

  (VDateClass.prototype as any).daysInMonth = function (): number {
    return new Date(Date.UTC(this.year(), this.month(), 0)).getUTCDate();
  };
}
