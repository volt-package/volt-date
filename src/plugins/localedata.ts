import { VDate } from '../core';

export interface LocaleData {
  months: string[];
  monthsShort: string[];
  weekdays: string[];
  weekdaysShort: string[];
  weekdaysMin: string[];
  meridiem: {
    am: string;
    pm: string;
  };
}

export function LocaleDataPlugin(VDateClass: typeof VDate): void {
  (VDateClass.prototype as any).localeData = function (): LocaleData {
    const locale = this.getLocale();
    const timezone = this.getTimezone();

    // Create formatters for different parts
    const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'long', timeZone: timezone });
    const monthShortFormatter = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: timezone });
    const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: timezone });
    const weekdayShortFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: timezone });
    const weekdayMinFormatter = new Intl.DateTimeFormat(locale, { weekday: 'narrow', timeZone: timezone });

    // Get all months
    const months = [];
    const monthsShort = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(Date.UTC(2024, i, 1));
      months.push(monthFormatter.format(date));
      monthsShort.push(monthShortFormatter.format(date));
    }

    // Get all weekdays (0-6: Sunday-Saturday)
    const weekdays = [];
    const weekdaysShort = [];
    const weekdaysMin = [];
    for (let i = 0; i < 7; i++) {
      // Start from Sunday (January 7, 2024 was Sunday)
      const date = new Date(Date.UTC(2024, 0, 7 + i));
      weekdays.push(weekdayFormatter.format(date));
      weekdaysShort.push(weekdayShortFormatter.format(date));
      weekdaysMin.push(weekdayMinFormatter.format(date));
    }

    // Determine meridiem format from locale
    const amDate = new Date(Date.UTC(2024, 0, 1, 9, 0, 0));
    const pmDate = new Date(Date.UTC(2024, 0, 1, 21, 0, 0));

    // Try to extract AM/PM from formatted time
    const amFormatter = new Intl.DateTimeFormat(locale, { hour: 'numeric', timeZone: timezone });
    const amFormatted = amFormatter.format(amDate);
    const pmFormatted = amFormatter.format(pmDate);

    // Extract AM/PM indicators (usually last 2 characters)
    const amText = amFormatted.slice(-2) === pmFormatted.slice(-2) ? 'AM' : amFormatted.slice(-2);
    const pmText = pmFormatted.slice(-2);

    return {
      months,
      monthsShort,
      weekdays,
      weekdaysShort,
      weekdaysMin,
      meridiem: {
        am: amText,
        pm: pmText,
      },
    };
  };
}
