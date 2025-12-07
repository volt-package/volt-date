import { VDate } from '../core';

export function CustomParseFormatPlugin(VDateClass: typeof VDate): void {
  // Month names mapping
  const monthNames: { [key: string]: number } = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12,
  };

  // Token definitions with their regex patterns
  const tokenDefs = [
    { token: 'YYYY', regex: /\d{4}/, getValue: (v: string) => parseInt(v) },
    { token: 'YY', regex: /\d{2}/, getValue: (v: string) => 2000 + parseInt(v) },
    { token: 'MMMM', regex: /[a-z]+/i, getValue: (v: string) => monthNames[v.toLowerCase()] || 1 },
    { token: 'MMM', regex: /[a-z]{3}/i, getValue: (v: string) => monthNames[v.toLowerCase()] || 1 },
    { token: 'MM', regex: /\d{2}/, getValue: (v: string) => parseInt(v) },
    { token: 'M', regex: /\d{1,2}/, getValue: (v: string) => parseInt(v) },
    { token: 'DD', regex: /\d{2}/, getValue: (v: string) => parseInt(v) },
    { token: 'D', regex: /\d{1,2}/, getValue: (v: string) => parseInt(v) },
    { token: 'HH', regex: /\d{2}/, getValue: (v: string) => parseInt(v) },
    { token: 'H', regex: /\d{1,2}/, getValue: (v: string) => parseInt(v) },
    {
      token: 'hh',
      regex: /\d{2}/,
      getValue: (v: string) => {
        let h = parseInt(v);
        if (h === 12) h = 0;
        return h;
      },
    },
    {
      token: 'h',
      regex: /\d{1,2}/,
      getValue: (v: string) => {
        let h = parseInt(v);
        if (h === 12) h = 0;
        return h;
      },
    },
    { token: 'mm', regex: /\d{2}/, getValue: (v: string) => parseInt(v) },
    { token: 'm', regex: /\d{1,2}/, getValue: (v: string) => parseInt(v) },
    { token: 'ss', regex: /\d{2}/, getValue: (v: string) => parseInt(v) },
    { token: 's', regex: /\d{1,2}/, getValue: (v: string) => parseInt(v) },
    { token: 'SSS', regex: /\d{3}/, getValue: (v: string) => parseInt(v) },
    { token: 'SS', regex: /\d{2}/, getValue: (v: string) => parseInt(v) * 10 },
    { token: 'S', regex: /\d{1}/, getValue: (v: string) => parseInt(v) * 100 },
  ];

  // Static method to parse with custom format
  (VDateClass as any).parseFormat = function (
    dateString: string,
    formatString: string,
    locale?: string
  ): VDate {
    // Build regex pattern from format string
    let regexPattern = '';
    const tokens: Array<{ token: string; getValue: (v: string) => number; index: number }> = [];
    let formatIndex = 0;
    let groupIndex = 0;

    while (formatIndex < formatString.length) {
      let matched = false;

      // Try to match tokens (longest first)
      for (const tokenDef of tokenDefs.sort((a, b) => b.token.length - a.token.length)) {
        if (formatString.substr(formatIndex, tokenDef.token.length) === tokenDef.token) {
          regexPattern += `(${tokenDef.regex.source})`;
          tokens.push({
            token: tokenDef.token,
            getValue: tokenDef.getValue,
            index: groupIndex++,
          });
          formatIndex += tokenDef.token.length;
          matched = true;
          break;
        }
      }

      if (!matched) {
        // Regular character - escape it
        const char = formatString[formatIndex];
        regexPattern +=
          char === '.'
            ? '\\.'
            : char === '?'
              ? '\\?'
              : char === '*'
                ? '\\*'
                : char === '+'
                  ? '\\+'
                  : char === '^'
                    ? '\\^'
                    : char === '$'
                      ? '\\$'
                      : char === '{'
                        ? '\\{'
                        : char === '}'
                          ? '\\}'
                          : char === '['
                            ? '\\['
                            : char === ']'
                              ? '\\]'
                              : char === '|'
                                ? '\\|'
                                : char === '\\'
                                  ? '\\\\'
                                  : char === '('
                                    ? '\\('
                                    : char === ')'
                                      ? '\\)'
                                      : char;
        formatIndex++;
      }
    }

    // Match the date string
    const regex = new RegExp(`^${regexPattern}$`, 'i');
    const matches = dateString.match(regex);

    if (!matches) {
      throw new Error(`Unable to parse "${dateString}" with format "${formatString}"`);
    }

    // Extract values
    let year = new Date().getFullYear();
    let month = 1;
    let date = 1;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let milliseconds = 0;

    for (const token of tokens) {
      const value = matches[token.index + 1]; // groups start at index 1
      if (!value) continue;

      const numValue = token.getValue(value);

      switch (token.token) {
        case 'YYYY':
          year = numValue;
          break;
        case 'YY':
          year = numValue;
          break;
        case 'MMMM':
        case 'MMM':
          month = numValue;
          break;
        case 'MM':
        case 'M':
          month = numValue;
          break;
        case 'DD':
        case 'D':
          date = numValue;
          break;
        case 'HH':
        case 'H':
        case 'hh':
        case 'h':
          hours = numValue;
          break;
        case 'mm':
        case 'm':
          minutes = numValue;
          break;
        case 'ss':
        case 's':
          seconds = numValue;
          break;
        case 'SSS':
          milliseconds = numValue;
          break;
        case 'SS':
          milliseconds = numValue;
          break;
        case 'S':
          milliseconds = numValue;
          break;
      }
    }

    // Create date using UTC
    const timestamp = Date.UTC(year, month - 1, date, hours, minutes, seconds, milliseconds);
    return new VDateClass(timestamp, { locale });
  };
}
