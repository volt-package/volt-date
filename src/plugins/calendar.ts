import { VDate } from '../core';

export interface CalendarFormat {
  sameElse: string;
  lastDay: string;
  lastWeek: string;
  sameDay: string;
  nextDay: string;
  nextWeek: string;
}

export function CalendarPlugin(VDateClass: typeof VDate): void {
  (VDateClass.prototype as any).calendar = function (options?: Partial<CalendarFormat>): string {
    const now = new VDateClass();
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
    } else if (targetDay.isBefore(today) && targetDay.isAfter(today.clone().subtract(7, 'day'))) {
      format = formats.lastWeek;
    } else if (targetDay.isAfter(today) && targetDay.isBefore(today.clone().add(7, 'day'))) {
      format = formats.nextWeek;
    }

    // Replace [escaped text] markers and format the string
    let result = format;

    // Extract escaped text (text within brackets) and replace with unique markers
    const marker = '\uFFF0\uFFF1'; // Use two Unicode private use characters to avoid token collision
    const escaped: string[] = [];

    // Extract escaped parts like [Today at] -> marker
    result = result.replace(/\[([^\]]+)\]/g, (_match: string, content: string) => {
      const index = escaped.length;
      escaped.push(content);
      return `${marker}${index}${marker}`;
    });

    // Now format the remaining tokens
    result = this.format(result);

    // Replace markers back with escaped text
    for (let i = 0; i < escaped.length; i++) {
      result = result.replace(new RegExp(`${marker}${i}${marker}`, 'g'), escaped[i]);
    }

    return result;
  };
}
