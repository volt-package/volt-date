# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Volt-date is a lightweight, zero-dependency date library built to replace Day.js. It uses the Native-First philosophy, relying on browser's native Intl API for internationalization and timezone handling.

**Core Philosophy:**
- **Zero-Dependency**: No external dependencies, pure JavaScript + Intl API
- **Native-First**: Uses Intl API instead of locale JSON files or timezone databases
- **Immutable**: All methods return new instances
- **Modular**: Core (11KB) + optional plugins (21KB) architecture

## Development Commands

```bash
# Testing
bun test                    # Run all tests (233 tests)
bun test:watch             # Run tests in watch mode
bun test tests/core.test.ts # Run specific test file

# Building
bun run build              # Development build (unminified)
bun run build:prod         # Production build (minified)
bun run build:types        # Generate TypeScript declarations only

# Code Quality
bun run lint               # Check code with ESLint
bun run lint:fix           # Auto-fix ESLint issues
bun run format             # Format code with Prettier
bun run format:check       # Check code formatting
```

## Architecture

### Core Structure

The codebase is split into **core** (required) and **plugins** (optional):

**Core modules** (`src/`):
- `core.ts` - VDate class definition and configuration
- `getSet.ts` - Getter/setter methods injected into VDate prototype
- `format.ts` - Date formatting with token replacement
- `manipulate.ts` - Add/subtract/startOf/endOf methods
- `query.ts` - Comparison methods (isBefore, isAfter, isSame, etc.)
- `utils.ts` - Utility methods (diff, dayOfYear, isLeapYear, etc.)
- `plugin.ts` - Plugin system with `extend()` function
- `index.ts` - Main export (core only, no plugins)

**Plugin modules** (`src/plugins/`):
- `index.ts` - All plugin exports (separate bundle entry point)
- `calendar.ts` - Calendar formatting ("Today", "Yesterday", etc.)
- `customParseFormat.ts` - Parse dates with custom format strings
- `duration.ts` - Duration class for time spans
- `localeData.ts` - Locale-specific data (month names, weekdays)
- `localizedFormat.ts` - Localized formatting
- `minmax.ts` - Min/max date finding

### Method Injection Pattern

VDate methods are **dynamically added** to the prototype via injection functions:
- `addGetSetMethods(VDate)` - Adds year(), month(), date(), etc.
- `addFormatMethod(VDate)` - Adds format()
- `addManipulateMethods(VDate)` - Adds add(), subtract(), startOf(), endOf()
- `addQueryMethods(VDate)` - Adds isBefore(), isAfter(), isSame(), etc.
- `addUtilMethods(VDate)` - Adds diff(), dayOfYear(), isLeapYear(), etc.

**Important**: The VDate class interface is augmented via TypeScript interface merging (lines 101-160 in core.ts). This allows TypeScript to see dynamically added methods.

### Plugin System

Plugins extend VDate functionality via the `extend()` function:

```typescript
export type Plugin = (VDateClass: typeof VDate) => void;

export function extend(plugin: Plugin): void {
  if (registeredPlugins.has(plugin)) return; // Prevent duplicates
  registeredPlugins.add(plugin);
  plugin(VDate); // Execute plugin to modify VDate prototype
}
```

**Built-in plugins** (in `plugin.ts`):
- `RelativeTimePlugin` - fromNow(), toNow() methods
- `TimezonePlugin` - tz(), utc(), local() methods

**Note**: As of Phase 2, built-in plugins are NO LONGER auto-registered. Users must explicitly call `extend()` to use them.

### Bundle Architecture

The build produces **two separate bundles**:

1. **Core bundle** (`dist/index.{esm,cjs}.js`):
   - VDate class + core methods
   - Plugin system (`extend`)
   - NO plugins included
   - 11.27 KB (ESM) / 11.76 KB (CJS) minified

2. **Plugins bundle** (`dist/plugins/index.{esm,cjs}.js`):
   - All optional plugins
   - Built-in plugins (RelativeTimePlugin, TimezonePlugin)
   - 20.76 KB (ESM) / 21.26 KB (CJS) minified

**Package exports** (package.json):
```json
{
  ".": "./dist/index.{esm,cjs}.js",        // Core only
  "./plugins": "./dist/plugins/index.{esm,cjs}.js"  // All plugins
}
```

Users import like:
```typescript
import { VDate, extend } from 'volt-date';           // Core
import { DurationPlugin } from 'volt-date/plugins';  // Plugins
```

### Timezone Handling

All timezone operations use **Intl.DateTimeFormat**:
- VDate stores `$tz` (timezone string) and `$locale` (locale string)
- Getters (year(), month(), hour()) use Intl.DateTimeFormat with the stored timezone
- Setters create new VDate instances (immutability)
- No timezone database files needed

Example getter implementation:
```typescript
const formatter = new Intl.DateTimeFormat(locale, {
  timeZone: timezone,
  year: 'numeric'
});
const parts = formatter.formatToParts(date);
const yearPart = parts.find(p => p.type === 'year');
```

### Format Token System

The `format()` method uses a **marker replacement** strategy:
1. Replace tokens (YYYY, MM, DD, etc.) with unique markers
2. Store actual values in replacements map
3. Replace markers with values
4. This prevents tokens from matching other tokens' replacements

Tokens are processed **longest-first** to avoid conflicts (YYYY before YY, MMMM before MM).

## Key Testing Patterns

All tests use Vitest with 233 tests across 8 test files:
- `core.test.ts` - VDate constructor, basic methods
- `getset.test.ts` - Timezone-aware getters/setters
- `format.test.ts` - Format tokens and patterns
- `manipulate.test.ts` - Add/subtract/startOf/endOf
- `query.test.ts` - Comparison methods
- `utils.test.ts` - Utility methods, array/object parsing
- `plugin.test.ts` - Built-in plugins (RelativeTimePlugin, TimezonePlugin)
- `plugins.test.ts` - Optional plugins (MinMax, Duration, Calendar, etc.)

**Plugin tests must call `extend()`** in `beforeAll()` hooks since plugins are no longer auto-registered.

## Important ESLint Rules

- `@typescript-eslint/no-unsafe-declaration-merging: off` - Required for VDate interface augmentation
- `@typescript-eslint/no-explicit-any: warn` - Allowed for dynamic plugin methods
- `argsIgnorePattern: "^_"` - Unused params prefixed with _ are allowed

## Build Process Details

The build script runs:
1. Bundle core ESM + CJS (`src/index.ts`)
2. Bundle plugins ESM + CJS (`src/plugins/index.ts`)
3. Generate TypeScript declarations (`bunx tsc`)
4. **Postbuild cleanup**: Move files from intermediate folders (`dist/esm/`, `dist/cjs/`) to final locations, then delete intermediate folders

The `postbuild` script flattens the directory structure so exports work correctly.

## Bundle Size Optimization

Recent optimizations reduced bundle size:
- **Phase 1**: Code simplifications (Duration.asObject, format tokens, regex escaping)
- **Phase 2**: Plugin architecture refactoring (removed auto-registration of built-in plugins)
- Result: Core reduced from 21KB → 11KB (minified)

## Example Project

The `example/` folder contains an interactive Vite demo showcasing all volt-date features:
- Location: `/example`
- Tech: Vite + TypeScript + vanilla JS
- Features demonstrated: Core, RelativeTime, Timezones, Calendar, Duration, MinMax, Live Clock
- Run: `cd example && bun install && bun run dev`
- Uses local volt-date build via Vite resolve alias (configured in `vite.config.ts`)

## Known Issues & Fixes

### CalendarPlugin Implementation

**Critical**: CalendarPlugin must use `VDateClass` parameter instead of importing `VDate`:
```typescript
// WRONG
const now = new VDate();

// CORRECT
const now = new VDateClass();
```

This prevents bundler optimization issues where `new VDate()` becomes `new VDate` (no parentheses), causing Invalid date errors.

**Escaped Text Handling**: Calendar formats like `[Today at]` use double Unicode markers (`\uFFF0\uFFF1`) to avoid collision with format tokens. Single marker `\uFFF0` + index would create `￰0￰`, where `0` conflicts with format parsing.

### VDate Constructor Behavior

When copying VDate instances without config, timezone and locale are preserved:
```typescript
const date1 = new VDate('2024-01-15', { tz: 'Asia/Seoul' });
const date2 = new VDate(date1); // Preserves tz: 'Asia/Seoul'
```

This is essential for query methods (`isSame`, `isAfter`) that internally create new VDate instances.
