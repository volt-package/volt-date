# Volt Date

A lightweight, zero-dependency date library to replace Day.js, built with Native-First philosophy using browser's Intl API.

## ✨ Features

- **Ultra-Lightweight**: Core only 11KB minified (ESM), plugins optional
- **Zero-Dependency**: Uses native JavaScript and Intl API only
- **Immutable**: All methods return new instances, preserving the original
- **Timezone Support**: Timezone handling using Intl API (optional plugin)
- **Plugin System**: Extensible architecture with optional plugins
- **Tree-Shakable**: Only import what you need
- **TypeScript**: Fully typed with first-class TypeScript support
- **Day.js Compatible API**: Familiar API for Day.js users

## 📦 Installation

```bash
npm install volt-date
# or
bun add volt-date
```

## 🚀 Quick Start

```typescript
import { VDate, volt } from 'volt-date';

// Create a date
const date = volt('2024-01-15T12:00:00Z');

// Get/Set values
console.log(date.year()); // 2024
console.log(date.month()); // 1
console.log(date.format('YYYY-MM-DD HH:mm')); // 2024-01-15 12:00

// Manipulation
const tomorrow = date.add(1, 'day');
const nextMonth = date.add(1, 'month');

// Chaining
const result = date
  .add(1, 'day')
  .startOf('day')
  .format('YYYY-MM-DD');

// With custom timezone
const seoul = volt('2024-01-15T12:00:00Z', { tz: 'Asia/Seoul' });
console.log(seoul.hour()); // 21 (UTC+9)
```

### Using Plugins

Plugins are optional and imported separately to keep the core bundle minimal.

```typescript
import { VDate, extend } from 'volt-date';
import { RelativeTimePlugin, TimezonePlugin } from 'volt-date/plugins';

// Enable plugins
extend(RelativeTimePlugin);
extend(TimezonePlugin);

// Now you can use plugin methods
const date = new VDate(Date.now() - 3600000);
console.log(date.fromNow()); // "1 hour ago"

const seoul = date.tz('Asia/Seoul');
console.log(seoul.format('HH:mm')); // Seoul time
```

## 📚 API Documentation

### Core Methods

#### Constructor

```typescript
const date = new VDate(date, config);
const date = volt(date, config);

// date can be:
// - Date object
// - ISO string: '2024-01-15T12:00:00Z'
// - Timestamp: 1234567890000
// - Array: [2024, 0, 15, 12, 0, 0]
// - Object: { year: 2024, month: 1, date: 15 }

// config options:
// { tz?: string, locale?: string }
```

#### Getting/Setting

```typescript
// Getters
date.year()      // Get year
date.month()     // Get month (1-12)
date.date()      // Get day of month
date.day()       // Get day of week (0-6)
date.hour()      // Get hour
date.minute()    // Get minute
date.second()    // Get second
date.millisecond() // Get millisecond

// Setters (return new VDate instance)
date.year(2025)
date.month(3)
date.hour(14)
```

#### Formatting

```typescript
date.format('YYYY-MM-DD');     // 2024-01-15
date.format('HH:mm:ss');       // 12:00:00
date.format('dddd, MMMM D');   // Monday, January 15

// Supported tokens:
// YYYY - Year (4 digit)
// MM - Month (01-12)
// DD - Day of month (01-31)
// dddd - Day name (Monday, Tuesday, ...)
// HH - Hour (00-23)
// mm - Minute (00-59)
// ss - Second (00-59)
```

#### Manipulation

```typescript
date.add(1, 'day')      // Add 1 day
date.subtract(3, 'month') // Subtract 3 months
date.startOf('month')   // Start of month (00:00:00)
date.endOf('year')      // End of year (23:59:59.999)

// Supported units: year, month, week, day, hour, minute, second, millisecond
```

#### Querying

```typescript
date.isBefore(other)
date.isAfter(other)
date.isSame(other, 'day')
date.isBetween(start, end)
date.isLeapYear()
```

#### Utilities

```typescript
date.clone()          // Clone the date
date.unix()           // Get Unix timestamp
date.toDate()         // Get native Date object
date.toObject()       // { year, month, date, hour, ... }
date.toArray()        // [year, month, date, hour, ...]
date.format('...')    // Format the date
date.diff(other)      // Difference in milliseconds
```

### Plugins

All plugins are optional and imported from `'volt-date/plugins'` to keep the core bundle minimal.

#### RelativeTimePlugin

Shows relative time like "3 days ago" using Intl.RelativeTimeFormat.

```typescript
import { VDate, extend } from 'volt-date';
import { RelativeTimePlugin } from 'volt-date/plugins';

extend(RelativeTimePlugin);

const date = new VDate(Date.now() - 3600000); // 1 hour ago
console.log(date.fromNow()); // "1 hour ago"
console.log(date.toNow());   // "in 1 hour"
```

#### TimezonePlugin

Manage timezones with explicit methods.

```typescript
import { VDate, extend } from 'volt-date';
import { TimezonePlugin } from 'volt-date/plugins';

extend(TimezonePlugin);

const date = new VDate('2024-01-15T12:00:00Z');
const seoul = date.tz('Asia/Seoul');
const utc = seoul.utc();
const local = seoul.local();
```

#### CalendarPlugin

Get calendar formatted dates.

```typescript
import { VDate, extend } from 'volt-date';
import { CalendarPlugin } from 'volt-date/plugins';

extend(CalendarPlugin);

const date = new VDate();
console.log(date.calendar()); // "Today at 12:00"
```

#### DurationPlugin

Work with time durations.

```typescript
import { VDate, extend } from 'volt-date';
import { DurationPlugin, Duration } from 'volt-date/plugins';

extend(DurationPlugin);

const duration = new Duration(1, 'hour');
console.log(duration.asMilliseconds()); // 3600000
console.log(duration.humanize());       // "an hour"

// Or via VDate static method
const d = (VDate as any).duration(1, 'hour');
```

#### LocaleDataPlugin

Get locale-specific information.

```typescript
import { VDate, extend } from 'volt-date';
import { LocaleDataPlugin } from 'volt-date/plugins';

extend(LocaleDataPlugin);

const date = new VDate();
const localeData = (date as any).localeData();
console.log(localeData.months); // ["January", "February", ...]
```

#### MinMaxPlugin

Find minimum or maximum date from a list.

```typescript
import { VDate, extend } from 'volt-date';
import { MinMaxPlugin } from 'volt-date/plugins';

extend(MinMaxPlugin);

const dates = [
  new VDate('2024-01-15'),
  new VDate('2024-01-20'),
  new VDate('2024-01-10')
];

const max = (VDate as any).max(dates);
const min = (VDate as any).min(dates);
```

#### CustomParseFormatPlugin

Parse dates with custom formats.

```typescript
import { VDate, extend } from 'volt-date';
import { CustomParseFormatPlugin } from 'volt-date/plugins';

extend(CustomParseFormatPlugin);

const date = (VDate as any).parseFormat('01/15/2024', 'MM/DD/YYYY');
console.log(date.format('YYYY-MM-DD')); // "2024-01-15"
```

## 🔧 Development

### Setup

```bash
# Install dependencies
bun install

# Run tests
bun run test

# Run tests in watch mode
bun run test:watch

# Build
bun run build

# Build for production
bun run build:prod

# Lint
bun run lint

# Format code
bun run format

# Check formatting
bun run format:check
```

### Project Structure

```
volt-date/
├── src/
│   ├── core.ts              # VDate core class
│   ├── format.ts            # Format method implementation
│   ├── getSet.ts            # Getter/Setter methods
│   ├── manipulate.ts        # Add/Subtract/StartOf/EndOf
│   ├── query.ts             # Comparison methods
│   ├── utils.ts             # Utility methods
│   ├── plugin.ts            # Plugin system
│   ├── plugins/
│   │   ├── index.ts         # Plugin exports
│   │   ├── calendar.ts
│   │   ├── customParseFormat.ts
│   │   ├── duration.ts
│   │   ├── localeData.ts
│   │   ├── localizedFormat.ts
│   │   └── minmax.ts
│   └── index.ts             # Main exports (core only)
├── tests/
│   └── *.test.ts
├── dist/
│   ├── index.esm.js         # Core bundle (ESM)
│   ├── index.cjs.js         # Core bundle (CJS)
│   └── plugins/
│       ├── index.esm.js     # Plugins bundle (ESM)
│       └── index.cjs.js     # Plugins bundle (CJS)
├── eslint.config.js         # ESLint configuration
├── .prettierrc              # Prettier configuration
└── package.json
```

## 🎯 Design Philosophy

### Native-First
Uses browser's native Intl API for all internationalization and timezone handling. No locale JSON files or timezone databases required.

### Zero-Dependency
Pure JavaScript with no external dependencies. All functionality comes from JavaScript standards and the Intl API.

### Immutable
All methods that modify dates return new instances, following functional programming principles.

### Plugin Architecture
Core bundle is minimal (11KB minified). Optional plugins are imported separately, allowing you to only include what you need.

### Tree-Shakable
Built with ESM-first approach. Unused code is eliminated during build, keeping your bundle size minimal.

### Day.js Compatible
Familiar API for Day.js users, making migration straightforward.

## 🧪 Testing

The project includes 233 tests covering:
- Core functionality (getters, setters, manipulation)
- Timezone calculations
- Localization
- Plugins
- Edge cases (leap years, month boundaries, etc.)

Run tests with:
```bash
bun run test
```

## 📊 Bundle Size

Production build (minified):

**Core (required)**
- ESM: 11.27 KB
- CJS: 11.76 KB

**Plugins (optional)**
- ESM: 20.76 KB
- CJS: 21.26 KB

**Total if using all features**: ~32 KB (ESM) / ~33 KB (CJS)

The modular architecture allows you to import only what you need, keeping your bundle size minimal.

## 🛠️ Technologies

- **TypeScript**: For type safety
- **Bun**: For development and testing
- **Vitest**: For testing
- **ESLint**: For code quality
- **Prettier**: For code formatting

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Built with ❤️ for lightweight date handling in modern JavaScript applications.
