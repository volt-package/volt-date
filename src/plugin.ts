import { VDate } from './core';

export type Plugin = (VDateClass: typeof VDate) => void;

const registeredPlugins = new Set<Plugin>();

export function extend(plugin: Plugin): void {
  if (registeredPlugins.has(plugin)) {
    return;
  }
  registeredPlugins.add(plugin);
  plugin(VDate);
}

export function RelativeTimePlugin(VDateClass: typeof VDate): void {
  (VDateClass.prototype as any).fromNow = function (options?: Intl.RelativeTimeFormatOptions): string {
    const locale = this.getLocale();
    const now = new VDate();
    const diff = this.unix() - now.unix();
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', ...options });

    const seconds = Math.round(diff / 1000);
    const minutes = Math.round(diff / (1000 * 60));
    const hours = Math.round(diff / (1000 * 60 * 60));
    const days = Math.round(diff / (1000 * 60 * 60 * 24));
    const months = Math.round(diff / (1000 * 60 * 60 * 24 * 30));
    const years = Math.round(diff / (1000 * 60 * 60 * 24 * 365));

    if (Math.abs(seconds) < 60) return rtf.format(seconds, 'second');
    else if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute');
    else if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');
    else if (Math.abs(days) < 30) return rtf.format(days, 'day');
    else if (Math.abs(months) < 12) return rtf.format(months, 'month');
    return rtf.format(years, 'year');
  };

  (VDateClass.prototype as any).toNow = function (options?: Intl.RelativeTimeFormatOptions): string {
    const locale = this.getLocale();
    const now = new VDate();
    const diff = now.unix() - this.unix();
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', ...options });

    const seconds = Math.round(diff / 1000);
    const minutes = Math.round(diff / (1000 * 60));
    const hours = Math.round(diff / (1000 * 60 * 60));
    const days = Math.round(diff / (1000 * 60 * 60 * 24));
    const months = Math.round(diff / (1000 * 60 * 60 * 24 * 30));
    const years = Math.round(diff / (1000 * 60 * 60 * 24 * 365));

    if (Math.abs(seconds) < 60) return rtf.format(-seconds, 'second');
    else if (Math.abs(minutes) < 60) return rtf.format(-minutes, 'minute');
    else if (Math.abs(hours) < 24) return rtf.format(-hours, 'hour');
    else if (Math.abs(days) < 30) return rtf.format(-days, 'day');
    else if (Math.abs(months) < 12) return rtf.format(-months, 'month');
    return rtf.format(-years, 'year');
  };
}

export function TimezonePlugin(VDateClass: typeof VDate): void {
  (VDateClass.prototype as any).tz = function (timezone: string): VDate {
    return new VDate(this.toDate(), { tz: timezone, locale: this.getLocale() });
  };

  (VDateClass.prototype as any).utc = function (): VDate {
    return new VDate(this.toDate(), { tz: 'UTC', locale: this.getLocale() });
  };

  (VDateClass.prototype as any).local = function (): VDate {
    try {
      const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return new VDate(this.toDate(), { tz: localTz, locale: this.getLocale() });
    } catch {
      return new VDate(this.toDate(), { tz: 'UTC', locale: this.getLocale() });
    }
  };
}
