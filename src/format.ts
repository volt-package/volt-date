import { VDate } from './core';

export function clearFormatterCache(): void {
  // Formatter cache was removed as each call creates new formatter
  // This function is kept for API compatibility
}

export function addFormatMethod(VDateClass: typeof VDate): void {
  (VDateClass.prototype as any).format = function (pattern: string): string {
    let result = pattern;
    const locale = this.getLocale();
    const timezone = this.getTimezone();
    const marker = '\uFFF0';
    const replacements: Record<string, string> = {};
    let markerCount = 0;

    // Get or create formatter for caching
    const getOrCreateFormatter = (opts: Intl.DateTimeFormatOptions): Intl.DateTimeFormat => {
      return new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        ...opts,
      });
    };

    // Token replacers
    const replacers: Record<string, () => string> = {
      YYYY: () => (this.year() as number).toString(),
      YY: () => (this.year() as number).toString().slice(-2),
      Q: () => Math.ceil((this.month() as number) / 3).toString(),
      MMMM: () => getOrCreateFormatter({ month: 'long' }).format(this.toDate()),
      MMM: () => getOrCreateFormatter({ month: 'short' }).format(this.toDate()),
      MM: () => (this.month() as number).toString().padStart(2, '0'),
      M: () => (this.month() as number).toString(),
      dddd: () => getOrCreateFormatter({ weekday: 'long' }).format(this.toDate()),
      ddd: () => getOrCreateFormatter({ weekday: 'short' }).format(this.toDate()),
      DD: () => (this.date() as number).toString().padStart(2, '0'),
      D: () => (this.date() as number).toString(),
      dd: () => (this.day() as number).toString().padStart(2, '0'),
      d: () => (this.day() as number).toString(),
      HH: () => (this.hour() as number).toString().padStart(2, '0'),
      H: () => (this.hour() as number).toString(),
      hh: () => {
        const h = this.hour() as number;
        return (h === 0 ? 12 : h > 12 ? h - 12 : h).toString().padStart(2, '0');
      },
      h: () => {
        const h = this.hour() as number;
        return (h === 0 ? 12 : h > 12 ? h - 12 : h).toString();
      },
      kk: () => {
        const h = this.hour() as number;
        return (h === 0 ? 24 : h).toString().padStart(2, '0');
      },
      k: () => {
        const h = this.hour() as number;
        return (h === 0 ? 24 : h).toString();
      },
      mm: () => (this.minute() as number).toString().padStart(2, '0'),
      m: () => (this.minute() as number).toString(),
      ss: () => (this.second() as number).toString().padStart(2, '0'),
      s: () => (this.second() as number).toString(),
      SSS: () => (this.millisecond() as number).toString().padStart(3, '0'),
      SS: () => Math.floor((this.millisecond() as number) / 10).toString().padStart(2, '0'),
      S: () => Math.floor((this.millisecond() as number) / 100).toString(),
      X: () => Math.floor(this.unix() / 1000).toString(),
      x: () => this.unix().toString(),
      A: () => ((this.hour() as number) >= 12 ? 'PM' : 'AM'),
      a: () => ((this.hour() as number) >= 12 ? 'pm' : 'am'),
      Z: () => {
        const fmt = new Intl.DateTimeFormat('en-US', {
          timeZoneName: 'shortOffset',
          timeZone: timezone,
        });
        const parts = fmt.formatToParts(this.toDate());
        return parts.find((p) => p.type === 'timeZoneName')?.value || '';
      },
      z: () => timezone,
      T: () => 'T',
    };

    // Token patterns in longest-first order to avoid conflicts
    const patterns = [
      'YYYY', 'YY', 'MMMM', 'MMM', 'MM', 'M', 'dddd', 'ddd', 'DD', 'D', 'dd', 'd',
      'HH', 'H', 'hh', 'h', 'kk', 'k', 'mm', 'm', 'ss', 's', 'SSS', 'SS', 'S',
      'X', 'x', 'Q', 'A', 'a', 'Z', 'z', 'T',
    ];

    // Replace tokens with markers
    for (const pattern of patterns) {
      const replacer = replacers[pattern];
      if (!replacer) continue;
      while (result.includes(pattern)) {
        const replacement = replacer();
        const key = `${marker}${markerCount}${marker}`;
        replacements[key] = replacement;
        result = result.replace(pattern, key);
        markerCount++;
      }
    }

    // Replace markers with actual values
    for (const [key, value] of Object.entries(replacements)) {
      result = result.replace(key, value);
    }

    return result;
  };
}
