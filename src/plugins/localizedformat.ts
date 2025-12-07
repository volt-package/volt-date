import { VDate } from '../core';

export function LocalizedFormatPlugin(VDateClass: typeof VDate): void {
  (VDateClass.prototype as any).formatLocalized = function (format: string): string {
    // L   -> MM/DD/YYYY (locale-specific date)
    // LL  -> MMMM D, YYYY (month name, day, year)
    // LLL -> MMMM D, YYYY HH:mm (with time)
    // LLLL-> dddd, MMMM D, YYYY (full date with weekday)

    let result = format;
    const locale = this.getLocale();
    const timezone = this.getTimezone();

    // Map locale to common date formats
    const isUS = locale.startsWith('en-US');
    const isGB = locale.startsWith('en-GB');
    const isFR = locale.startsWith('fr');
    const isDEU = locale.startsWith('de');

    if (result.includes('LLLL')) {
      // Full format with weekday: "Sunday, December 7, 2025"
      result = result.replace('LLLL', 'dddd, MMMM D, YYYY');
    } else if (result.includes('LLL')) {
      // Medium format with time: "December 7, 2025 2:30 PM"
      result = result.replace('LLL', 'MMMM D, YYYY HH:mm');
    } else if (result.includes('LL')) {
      // Long format: "December 7, 2025"
      result = result.replace('LL', 'MMMM D, YYYY');
    } else if (result.includes('L')) {
      // Short date format (locale-specific)
      if (isUS) {
        result = result.replace('L', 'MM/DD/YYYY'); // 12/07/2025
      } else if (isGB || isFR || isDEU) {
        result = result.replace('L', 'DD/MM/YYYY'); // 07/12/2025
      } else {
        // Default international format
        result = result.replace('L', 'YYYY-MM-DD');
      }
    }

    // Format using the resolved pattern
    return this.format(result);
  };

  // Add convenience method for direct localized format
  (VDateClass.prototype as any).format = function (pattern: string): string {
    // Check if it's a localized format token
    if (/^L+$/.test(pattern)) {
      return this.formatLocalized(pattern);
    }

    // Otherwise use original format method (call the stored original)
    return (VDateClass.prototype as any)._format.call(this, pattern);
  };

  // Store the original format method before override
  if (!(VDateClass.prototype as any)._format) {
    (VDateClass.prototype as any)._format = (VDateClass.prototype as any).format;
  }
}
