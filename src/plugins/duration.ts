import { VDate } from '../core';

type DurationUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';

export class Duration {
  private ms: number;

  constructor(input: number | { [key: string]: number }, unit: DurationUnit = 'millisecond') {
    if (typeof input === 'number') {
      // Convert to milliseconds
      switch (unit) {
        case 'year':
          this.ms = input * 365.25 * 24 * 60 * 60 * 1000;
          break;
        case 'month':
          this.ms = input * 30.44 * 24 * 60 * 60 * 1000;
          break;
        case 'week':
          this.ms = input * 7 * 24 * 60 * 60 * 1000;
          break;
        case 'day':
          this.ms = input * 24 * 60 * 60 * 1000;
          break;
        case 'hour':
          this.ms = input * 60 * 60 * 1000;
          break;
        case 'minute':
          this.ms = input * 60 * 1000;
          break;
        case 'second':
          this.ms = input * 1000;
          break;
        case 'millisecond':
        default:
          this.ms = input;
      }
    } else {
      // Object input
      this.ms = 0;
      if (input.year) this.ms += input.year * 365.25 * 24 * 60 * 60 * 1000;
      if (input.month) this.ms += input.month * 30.44 * 24 * 60 * 60 * 1000;
      if (input.week) this.ms += input.week * 7 * 24 * 60 * 60 * 1000;
      if (input.day) this.ms += input.day * 24 * 60 * 60 * 1000;
      if (input.hour) this.ms += input.hour * 60 * 60 * 1000;
      if (input.minute) this.ms += input.minute * 60 * 1000;
      if (input.second) this.ms += input.second * 1000;
      if (input.millisecond) this.ms += input.millisecond;
    }
  }

  // Convert to different units
  asMilliseconds(): number {
    return this.ms;
  }

  asSeconds(): number {
    return this.ms / 1000;
  }

  asMinutes(): number {
    return this.ms / (60 * 1000);
  }

  asHours(): number {
    return this.ms / (60 * 60 * 1000);
  }

  asDays(): number {
    return this.ms / (24 * 60 * 60 * 1000);
  }

  asWeeks(): number {
    return this.ms / (7 * 24 * 60 * 60 * 1000);
  }

  asMonths(): number {
    return this.ms / (30.44 * 24 * 60 * 60 * 1000);
  }

  asYears(): number {
    return this.ms / (365.25 * 24 * 60 * 60 * 1000);
  }

  // Add durations
  add(input: number | Duration, unit?: DurationUnit): Duration {
    const other = input instanceof Duration ? input.asMilliseconds() : new Duration(input, unit!).asMilliseconds();
    return new Duration(this.ms + other, 'millisecond');
  }

  // Subtract durations
  subtract(input: number | Duration, unit?: DurationUnit): Duration {
    const other = input instanceof Duration ? input.asMilliseconds() : new Duration(input, unit!).asMilliseconds();
    return new Duration(this.ms - other, 'millisecond');
  }

  // Get humanized string
  humanize(_locale?: string): string {
    const absMs = Math.abs(this.ms);
    const sign = this.ms < 0 ? 'ago' : 'in';

    if (absMs < 45000) {
      // Less than 45 seconds
      const seconds = Math.round(absMs / 1000);
      return `${seconds} second${seconds !== 1 ? 's' : ''} ${sign}`;
    } else if (absMs < 45 * 60 * 1000) {
      // Less than 45 minutes
      const minutes = Math.round(absMs / (60 * 1000));
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ${sign}`;
    } else if (absMs < 24 * 60 * 60 * 1000) {
      // Less than 24 hours
      const hours = Math.round(absMs / (60 * 60 * 1000));
      return `${hours} hour${hours !== 1 ? 's' : ''} ${sign}`;
    } else if (absMs < 7 * 24 * 60 * 60 * 1000) {
      // Less than 7 days
      const days = Math.round(absMs / (24 * 60 * 60 * 1000));
      return `${days} day${days !== 1 ? 's' : ''} ${sign}`;
    } else if (absMs < 30 * 24 * 60 * 60 * 1000) {
      // Less than 30 days
      const weeks = Math.round(absMs / (7 * 24 * 60 * 60 * 1000));
      return `${weeks} week${weeks !== 1 ? 's' : ''} ${sign}`;
    } else if (absMs < 365 * 24 * 60 * 60 * 1000) {
      // Less than 365 days
      const months = Math.round(absMs / (30.44 * 24 * 60 * 60 * 1000));
      return `${months} month${months !== 1 ? 's' : ''} ${sign}`;
    } else {
      const years = Math.round(absMs / (365.25 * 24 * 60 * 60 * 1000));
      return `${years} year${years !== 1 ? 's' : ''} ${sign}`;
    }
  }

  // Check if duration is valid
  isValid(): boolean {
    return !isNaN(this.ms) && isFinite(this.ms);
  }

  // Get duration as object
  asObject(): { [key: string]: number } {
    const years = Math.floor(this.ms / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor((this.ms % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    const weeks = Math.floor(
      ((this.ms % (365.25 * 24 * 60 * 60 * 1000)) % (30.44 * 24 * 60 * 60 * 1000)) / (7 * 24 * 60 * 60 * 1000)
    );
    const days = Math.floor(
      (((this.ms % (365.25 * 24 * 60 * 60 * 1000)) % (30.44 * 24 * 60 * 60 * 1000)) % (7 * 24 * 60 * 60 * 1000)) /
        (24 * 60 * 60 * 1000)
    );
    const hours = Math.floor(
      ((((this.ms % (365.25 * 24 * 60 * 60 * 1000)) % (30.44 * 24 * 60 * 60 * 1000)) % (7 * 24 * 60 * 60 * 1000)) %
        (24 * 60 * 60 * 1000)) /
        (60 * 60 * 1000)
    );
    const minutes = Math.floor(
      (((((this.ms % (365.25 * 24 * 60 * 60 * 1000)) % (30.44 * 24 * 60 * 60 * 1000)) % (7 * 24 * 60 * 60 * 1000)) %
        (24 * 60 * 60 * 1000)) %
        (60 * 60 * 1000)) /
        (60 * 1000)
    );
    const seconds = Math.floor(
      ((((((this.ms % (365.25 * 24 * 60 * 60 * 1000)) % (30.44 * 24 * 60 * 60 * 1000)) % (7 * 24 * 60 * 60 * 1000)) %
        (24 * 60 * 60 * 1000)) %
        (60 * 60 * 1000)) %
        (60 * 1000)) /
        1000
    );

    return {
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
    };
  }
}

export function DurationPlugin(VDateClass: typeof VDate): void {
  // Static method to create duration
  (VDateClass as any).duration = function (input: number | { [key: string]: number }, unit?: DurationUnit): Duration {
    return new Duration(input, unit);
  };

  // Check if something is a duration
  (VDateClass as any).isDuration = function (obj: any): obj is Duration {
    return obj instanceof Duration;
  };

  // Instance method: get duration from this date to another
  (VDateClass.prototype as any).toDuration = function (compared?: VDate | Date | string | number): Duration {
    const other = compared
      ? compared instanceof VDateClass
        ? compared
        : new VDateClass(compared)
      : new VDateClass();

    const diff = this.unix() - other.unix();
    return new Duration(diff, 'millisecond');
  };
}
