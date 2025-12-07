import { VDate } from '../core';

export interface CalendarFormat {
  sameElse: string;
  lastDay: string;
  lastWeek: string;
  lastMonth?: string;
  sameDay: string;
  nextDay: string;
  nextWeek: string;
  nextMonth?: string;
}

export function CalendarPlugin(VDateClass: typeof VDate): void {
  (VDateClass.prototype as any).calendar = function (
    options?: Partial<CalendarFormat>
  ): string {
    const now = new VDate();
    const today = now.clone().startOf('day');
    const tomorrow = today.clone().add(1, 'day');
    const yesterday = today.clone().subtract(1, 'day');

    const targetDay = this.clone().startOf('day');

    // Default formats
    const defaultFormats: CalendarFormat = {
      sameDay: '[Today at] HH:mm',
      lastDay: '[Yesterday at] HH:mm',
      lastWeek: 'dddd [at] HH:mm',
      sameElse: 'DD/MM/YYYY',
      nextDay: '[Tomorrow at] HH:mm',
      nextWeek: 'dddd [at] HH:mm',
    };

    const formats = { ...defaultFormats, ...options };

    let format = formats.sameElse;

    if (targetDay.isSame(today, 'day')) {
      format = formats.sameDay;
    } else if (targetDay.isSame(yesterday, 'day')) {
      format = formats.lastDay;
    } else if (targetDay.isSame(tomorrow, 'day')) {
      format = formats.nextDay;
    } else if (targetDay.isBefore(today) && targetDay.isAfter(today.subtract(7, 'day'))) {
      format = formats.lastWeek;
    } else if (targetDay.isAfter(today) && targetDay.isBefore(today.add(7, 'day'))) {
      format = formats.nextWeek;
    }

    // Replace [escaped text] markers and format the string
    let result = format;

    // Temporarily replace escaped text with markers (use unique marker)
    const marker = '__ESCAPED_';
    const escaped: Record<string, string> = {};
    let escapeCount = 0;

    // Extract escaped parts
    result = result.replace(/\[([^\]]+)\]/g, (_match: string, content: string) => {
      const key = `${marker}${escapeCount}__`;
      escaped[key] = content;
      escapeCount++;
      return key;
    });

    // Format the remaining string - need to use the original format method
    // Get the format method before Calendar plugin modifies it
    const formatResult = (VDateClass.prototype as any)._format
      ? (VDateClass.prototype as any)._format.call(this, result)
      : this.format(result);

    result = formatResult;

    // Replace escaped markers back
    for (const [key, value] of Object.entries(escaped)) {
      result = result.replace(key, value);
    }

    return result;
  };
}
