import { VDate, extend } from 'volt-date';
import {
  RelativeTimePlugin,
  TimezonePlugin,
  CalendarPlugin,
  DurationPlugin,
  Duration,
  MinMaxPlugin,
} from 'volt-date/plugins';
import './style.css';

// Enable plugins
extend(RelativeTimePlugin);
extend(TimezonePlugin);
extend(CalendarPlugin);
extend(DurationPlugin);
extend(MinMaxPlugin);

const app = document.querySelector<HTMLDivElement>('#app')!;

// Create example sections
app.innerHTML = `
  <div class="container">
    <h1>⚡ Volt Date Examples</h1>
    <p class="subtitle">A lightweight, zero-dependency date library</p>

    <section class="example-section">
      <h2>📅 Core Features</h2>
      <div id="core-examples"></div>
    </section>

    <section class="example-section">
      <h2>🕐 Relative Time</h2>
      <div id="relative-examples"></div>
    </section>

    <section class="example-section">
      <h2>🌍 Timezones</h2>
      <div id="timezone-examples"></div>
    </section>

    <section class="example-section">
      <h2>📆 Calendar</h2>
      <div id="calendar-examples"></div>
    </section>

    <section class="example-section">
      <h2>⏱️ Duration</h2>
      <div id="duration-examples"></div>
    </section>

    <section class="example-section">
      <h2>🔍 Min/Max</h2>
      <div id="minmax-examples"></div>
    </section>

    <section class="example-section">
      <h2>🔄 Live Clock</h2>
      <div id="live-clock"></div>
    </section>
  </div>
`;

// Helper function to create example output
function addExample(containerId: string, label: string, value: string) {
  const container = document.getElementById(containerId);
  if (container) {
    const div = document.createElement('div');
    div.className = 'example-item';
    div.innerHTML = `
      <span class="example-label">${label}</span>
      <span class="example-value">${value}</span>
    `;
    container.appendChild(div);
  }
}

// Core Examples
const now = new VDate();
addExample('core-examples', 'Current date', now.format('YYYY-MM-DD HH:mm:ss'));
addExample('core-examples', 'Year', now.year().toString());
addExample('core-examples', 'Month', now.month().toString());
addExample('core-examples', 'Day of week', now.day().toString());
addExample('core-examples', 'Unix timestamp', now.unix().toString());

const tomorrow = now.add(1, 'day');
addExample('core-examples', 'Tomorrow', tomorrow.format('YYYY-MM-DD'));

const lastMonth = now.subtract(1, 'month');
addExample('core-examples', 'Last month', lastMonth.format('YYYY-MM-DD'));

const startOfYear = now.startOf('year');
addExample('core-examples', 'Start of year', startOfYear.format('YYYY-MM-DD HH:mm:ss'));

const endOfMonth = now.endOf('month');
addExample('core-examples', 'End of month', endOfMonth.format('YYYY-MM-DD HH:mm:ss'));

// Relative Time Examples
const oneHourAgo = new VDate(Date.now() - 3600000);
addExample('relative-examples', '1 hour ago', (oneHourAgo as any).fromNow());

const twoDaysAgo = new VDate(Date.now() - 2 * 24 * 3600000);
addExample('relative-examples', '2 days ago', (twoDaysAgo as any).fromNow());

const inThreeDays = new VDate(Date.now() + 3 * 24 * 3600000);
addExample('relative-examples', 'In 3 days', (inThreeDays as any).fromNow());

const oneWeekAgo = new VDate(Date.now() - 7 * 24 * 3600000);
addExample('relative-examples', '1 week ago (toNow)', (oneWeekAgo as any).toNow());

// Timezone Examples
const utcDate = new VDate('2024-01-15T12:00:00Z', { tz: 'UTC' });
addExample('timezone-examples', 'UTC time', `${utcDate.format('YYYY-MM-DD HH:mm')} (${utcDate.getTimezone()})`);

const seoulDate = (utcDate as any).tz('Asia/Seoul');
addExample('timezone-examples', 'Seoul time', `${seoulDate.format('YYYY-MM-DD HH:mm')} (${seoulDate.getTimezone()})`);

const nyDate = (utcDate as any).tz('America/New_York');
addExample('timezone-examples', 'New York time', `${nyDate.format('YYYY-MM-DD HH:mm')} (${nyDate.getTimezone()})`);

const tokyoDate = (utcDate as any).tz('Asia/Tokyo');
addExample('timezone-examples', 'Tokyo time', `${tokyoDate.format('YYYY-MM-DD HH:mm')} (${tokyoDate.getTimezone()})`);

const localDate = (utcDate as any).local();
addExample('timezone-examples', 'Local time', `${localDate.format('YYYY-MM-DD HH:mm')} (${localDate.getTimezone()})`);

// Calendar Examples
const today = new VDate();
addExample('calendar-examples', 'Today', (today as any).calendar());

const yesterday = new VDate().subtract(1, 'day');
addExample('calendar-examples', 'Yesterday', (yesterday as any).calendar());

const tomorrowCal = new VDate().add(1, 'day');
addExample('calendar-examples', 'Tomorrow', (tomorrowCal as any).calendar());

const lastWeek = new VDate().subtract(5, 'day');
addExample('calendar-examples', 'Last week', (lastWeek as any).calendar());

const nextWeek = new VDate().add(5, 'day');
addExample('calendar-examples', 'Next week', (nextWeek as any).calendar());

// Duration Examples
const duration1 = new Duration(3600000, 'millisecond');
addExample('duration-examples', '3600000 ms', `${duration1.asHours()} hours`);

const duration2 = new Duration(90, 'minute');
addExample('duration-examples', '90 minutes', `${duration2.asHours()} hours`);

const duration3 = new Duration(7, 'day');
addExample('duration-examples', '7 days', `${duration3.asWeeks()} weeks`);

const duration4 = new Duration({ day: 1, hour: 2, minute: 30 });
addExample('duration-examples', '1d 2h 30m', `${duration4.asHours().toFixed(2)} hours`);

const duration5 = new Duration(5, 'second');
addExample('duration-examples', '5 seconds', duration5.humanize());

const duration6 = new Duration(2, 'day');
addExample('duration-examples', '2 days', duration6.humanize());

// Duration arithmetic
const d1 = new Duration(1, 'day');
const d2 = new Duration(12, 'hour');
const sum = d1.add(d2);
addExample('duration-examples', '1 day + 12 hours', `${sum.asHours()} hours`);

// Min/Max Examples
const dates = [new VDate('2024-01-15'), new VDate('2024-03-20'), new VDate('2024-01-10'), new VDate('2024-02-28')];

const maxDate = (VDate as any).max(dates);
addExample('minmax-examples', 'Maximum date', maxDate.format('YYYY-MM-DD'));

const minDate = (VDate as any).min(dates);
addExample('minmax-examples', 'Minimum date', minDate.format('YYYY-MM-DD'));

// Spread syntax
const max2 = (VDate as any).max(...dates);
addExample('minmax-examples', 'Max (spread)', max2.format('YYYY-MM-DD'));

const min2 = (VDate as any).min(...dates);
addExample('minmax-examples', 'Min (spread)', min2.format('YYYY-MM-DD'));

// Live Clock
function updateClock() {
  const clockContainer = document.getElementById('live-clock');
  if (!clockContainer) return;

  const currentTime = new VDate();

  clockContainer.innerHTML = `
    <div class="clock-grid">
      <div class="clock-item">
        <div class="clock-label">Current Time</div>
        <div class="clock-value">${currentTime.format('YYYY-MM-DD HH:mm:ss')}</div>
      </div>
      <div class="clock-item">
        <div class="clock-label">UTC</div>
        <div class="clock-value">${(currentTime as any).utc().format('HH:mm:ss')}</div>
      </div>
      <div class="clock-item">
        <div class="clock-label">Tokyo</div>
        <div class="clock-value">${(currentTime as any).tz('Asia/Tokyo').format('HH:mm:ss')}</div>
      </div>
      <div class="clock-item">
        <div class="clock-label">New York</div>
        <div class="clock-value">${(currentTime as any).tz('America/New_York').format('HH:mm:ss')}</div>
      </div>
      <div class="clock-item">
        <div class="clock-label">London</div>
        <div class="clock-value">${(currentTime as any).tz('Europe/London').format('HH:mm:ss')}</div>
      </div>
      <div class="clock-item">
        <div class="clock-label">Relative</div>
        <div class="clock-value">${(new VDate(Date.now() - 5000) as any).fromNow()}</div>
      </div>
    </div>
  `;
}

// Update clock every second
updateClock();
setInterval(updateClock, 1000);
