# Volt Date - Example

This is an interactive example showcasing all features of volt-date library.

## Features Demonstrated

- 📅 **Core Features**: Date manipulation, formatting, getters/setters
- 🕐 **Relative Time**: fromNow(), toNow() with various time ranges
- 🌍 **Timezones**: Multiple timezone conversions (UTC, Seoul, Tokyo, New York, London)
- 📆 **Calendar**: Calendar-style formatting (Today, Yesterday, Tomorrow)
- ⏱️ **Duration**: Duration calculations and humanization
- 🔍 **Min/Max**: Finding minimum and maximum dates
- 🔄 **Live Clock**: Real-time clock updates across multiple timezones

## Running the Example

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## How it Works

The example uses the local volt-date build via `"volt-date": "file:.."` in package.json. This creates a direct file system link to the parent directory.

Before running the example:
1. Build volt-date: `cd .. && bun run build`
2. Install example deps: `bun install`
3. Run dev server: `bun run dev`

All plugins are imported from `volt-date/plugins` and explicitly registered using `extend()`.

## Live Features

The page includes a live clock that updates every second, showing:
- Current local time
- UTC time
- Time in multiple timezones
- Relative time formatting

This demonstrates the real-time capabilities and accuracy of volt-date.
