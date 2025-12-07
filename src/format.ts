import { VDate } from "./core";

export function clearFormatterCache(): void {
  // Formatter cache was removed as each call creates new formatter
  // This function is kept for API compatibility
}

export function addFormatMethod(VDateClass: typeof VDate): void {
  (VDateClass.prototype as any).format = function (pattern: string): string {
    let result = pattern;
    const locale = this.getLocale();
    const timezone = this.getTimezone();
    const marker = "\uFFF0";
    const replacements: Record<string, string> = {};
    let markerCount = 0;

    // Get or create formatter for caching
    const getOrCreateFormatter = (
      opts: Intl.DateTimeFormatOptions
    ): Intl.DateTimeFormat => {
      return new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        ...opts,
      });
    };

    // Tokens in longest-first order to avoid conflicts
    const tokens = [
      {
        pattern: "YYYY",
        replacer: () => (this.year() as number).toString(),
      },
      {
        pattern: "YY",
        replacer: () => (this.year() as number).toString().slice(-2),
      },
      {
        pattern: "Q",
        replacer: () => {
          const month = this.month() as number;
          return Math.ceil(month / 3).toString();
        },
      },
      {
        pattern: "MMMM",
        replacer: () =>
          getOrCreateFormatter({ month: "long" }).format(this.toDate()),
      },
      {
        pattern: "MMM",
        replacer: () =>
          getOrCreateFormatter({ month: "short" }).format(this.toDate()),
      },
      {
        pattern: "MM",
        replacer: () => (this.month() as number).toString().padStart(2, "0"),
      },
      {
        pattern: "M",
        replacer: () => (this.month() as number).toString(),
      },
      {
        pattern: "dddd",
        replacer: () =>
          getOrCreateFormatter({ weekday: "long" }).format(this.toDate()),
      },
      {
        pattern: "ddd",
        replacer: () =>
          getOrCreateFormatter({ weekday: "short" }).format(this.toDate()),
      },
      {
        pattern: "DD",
        replacer: () => (this.date() as number).toString().padStart(2, "0"),
      },
      {
        pattern: "D",
        replacer: () => (this.date() as number).toString(),
      },
      {
        pattern: "dd",
        replacer: () => (this.day() as number).toString().padStart(2, "0"),
      },
      {
        pattern: "d",
        replacer: () => (this.day() as number).toString(),
      },
      {
        pattern: "HH",
        replacer: () => (this.hour() as number).toString().padStart(2, "0"),
      },
      {
        pattern: "H",
        replacer: () => (this.hour() as number).toString(),
      },
      {
        pattern: "hh",
        replacer: () => {
          let h = this.hour() as number;
          if (h === 0) h = 12;
          else if (h > 12) h -= 12;
          return h.toString().padStart(2, "0");
        },
      },
      {
        pattern: "h",
        replacer: () => {
          let h = this.hour() as number;
          if (h === 0) h = 12;
          else if (h > 12) h -= 12;
          return h.toString();
        },
      },
      {
        pattern: "kk",
        replacer: () => {
          let h = this.hour() as number;
          if (h === 0) h = 24;
          return h.toString().padStart(2, "0");
        },
      },
      {
        pattern: "k",
        replacer: () => {
          let h = this.hour() as number;
          if (h === 0) h = 24;
          return h.toString();
        },
      },
      {
        pattern: "mm",
        replacer: () => (this.minute() as number).toString().padStart(2, "0"),
      },
      {
        pattern: "m",
        replacer: () => (this.minute() as number).toString(),
      },
      {
        pattern: "ss",
        replacer: () => (this.second() as number).toString().padStart(2, "0"),
      },
      {
        pattern: "s",
        replacer: () => (this.second() as number).toString(),
      },
      {
        pattern: "SSS",
        replacer: () =>
          (this.millisecond() as number).toString().padStart(3, "0"),
      },
      {
        pattern: "SS",
        replacer: () =>
          Math.floor((this.millisecond() as number) / 10)
            .toString()
            .padStart(2, "0"),
      },
      {
        pattern: "S",
        replacer: () =>
          Math.floor((this.millisecond() as number) / 100).toString(),
      },
      {
        pattern: "X",
        replacer: () => Math.floor(this.unix() / 1000).toString(),
      },
      {
        pattern: "x",
        replacer: () => this.unix().toString(),
      },
      {
        pattern: "A",
        replacer: () => ((this.hour() as number) >= 12 ? "PM" : "AM"),
      },
      {
        pattern: "a",
        replacer: () => ((this.hour() as number) >= 12 ? "pm" : "am"),
      },
      {
        pattern: "Z",
        replacer: () => {
          const fmt = new Intl.DateTimeFormat("en-US", {
            timeZoneName: "shortOffset",
            timeZone: timezone,
          });
          const parts = fmt.formatToParts(this.toDate());
          return parts.find((p) => p.type === "timeZoneName")?.value || "";
        },
      },
      { pattern: "z", replacer: () => timezone },
      { pattern: "T", replacer: () => "T" },
    ];

    // Replace tokens with markers
    for (const token of tokens) {
      while (result.includes(token.pattern)) {
        const replacement = token.replacer();
        const key = `${marker}${markerCount}${marker}`;
        replacements[key] = replacement;
        result = result.replace(token.pattern, key);
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
