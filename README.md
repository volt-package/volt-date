# Volt Date

A lightweight, zero-dependency date library to replace Day.js, built with Native-First philosophy using browser's Intl API.

## ✨ Features

- **Lightweight**: Minimal bundle size with no external dependencies
- **Zero-Dependency**: Uses native JavaScript and Intl API only
- **Immutable**: All methods return new instances, preserving the original
- **Timezone Support**: Built-in timezone handling using Intl API
- **Plugin System**: Extensible architecture for custom functionality
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
import { volt } from 'volt-date';

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

// Timezone support
const seoul = date.tz('Asia/Seoul');
console.log(seoul.hour()); // 21 (UTC+9)
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

#### RelativeTimePlugin

Shows relative time like "3 days ago" using Intl.RelativeTimeFormat.

```typescript
import { extend, RelativeTimePlugin } from 'volt-date';

extend(RelativeTimePlugin);

const date = volt(Date.now() - 3600000); // 1 hour ago
console.log(date.fromNow()); // "1 hour ago"
console.log(date.toNow());   // "in 1 hour"
```

#### TimezonePlugin

Manage timezones with explicit methods.

```typescript
import { extend, TimezonePlugin } from 'volt-date';

extend(TimezonePlugin);

const date = volt('2024-01-15T12:00:00Z');
const seoul = date.tz('Asia/Seoul');
const utc = seoul.utc();
const local = seoul.local();
```

#### CalendarPlugin

Get calendar formatted dates.

```typescript
import { extend, CalendarPlugin } from 'volt-date';

extend(CalendarPlugin);

const date = volt();
console.log(date.calendar()); // "Today at 12:00"
```

#### DurationPlugin

Work with time durations.

```typescript
import { extend, DurationPlugin } from 'volt-date';

extend(DurationPlugin);

const duration = volt.duration(1, 'hour');
console.log(duration.asMilliseconds()); // 3600000
console.log(duration.humanize());       // "an hour"
```

#### LocaleDataPlugin

Get locale-specific information.

```typescript
import { extend, LocaleDataPlugin } from 'volt-date';

extend(LocaleDataPlugin);

const date = volt().localeData();
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
│   │   ├── calendar.ts
│   │   ├── customParseFormat.ts
│   │   ├── duration.ts
│   │   ├── localeData.ts
│   │   ├── localizedFormat.ts
│   │   └── minmax.ts
│   └── index.ts
├── tests/
│   └── *.test.ts
├── eslint.config.js         # ESLint configuration
├── .prettierrc               # Prettier configuration
└── package.json
```

## 🎯 Design Philosophy

### Native-First
Uses browser's native Intl API for all internationalization and timezone handling. No locale JSON files or timezone databases required.

### Zero-Dependency
Pure JavaScript with no external dependencies. All functionality comes from JavaScript standards and the Intl API.

### Immutable
All methods that modify dates return new instances, following functional programming principles.

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

- ESM: ~41 KB
- CJS: ~42 KB
- (minified sizes will be smaller)

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
