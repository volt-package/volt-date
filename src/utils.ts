import { VDate } from './core';

export function addUtilMethods(VDateClass: typeof VDate): void {
  // dayOfYear - 연중 일 수
  (VDateClass.prototype as any).dayOfYear = function (): number {
    const year = this.year();
    const month = this.month() - 1; // 0-11
    const day = this.date();

    const isLeapYear =
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

    const daysInMonths = [
      31, // Jan
      isLeapYear ? 29 : 28, // Feb
      31, // Mar
      30, // Apr
      31, // May
      30, // Jun
      31, // Jul
      31, // Aug
      30, // Sep
      31, // Oct
      30, // Nov
      31, // Dec
    ];

    let totalDays = day;
    for (let i = 0; i < month; i++) {
      totalDays += daysInMonths[i];
    }

    return totalDays;
  };

  // weekOfYear - 연중 주차 (ISO 8601)
  (VDateClass.prototype as any).weekOfYear = function (): number {
    let date = this.clone();
    const year = date.year();

    // ISO 8601 week date system
    // Thursday of each week is used to determine the week number
    date = date.day(4); // Move to Thursday of current week

    // Get January 4th of the current year
    let jan4 = new VDate(new Date(Date.UTC(year, 0, 4)), {
      tz: this.getTimezone(),
      locale: this.getLocale(),
    });
    jan4 = jan4.day(4); // Move to Thursday

    // Calculate the difference in weeks
    const diff = date.diff(jan4, 'day');
    const week = Math.floor(diff / 7) + 1;

    return Math.max(1, week);
  };

  // isLeapYear - 윤년 확인
  (VDateClass.prototype as any).isLeapYear = function (): boolean {
    const year = this.year();
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  // toObject - 객체로 변환
  (VDateClass.prototype as any).toObject = function (): Record<string, number> {
    return {
      years: this.year(),
      months: this.month(),
      date: this.date(),
      hours: this.hour(),
      minutes: this.minute(),
      seconds: this.second(),
      milliseconds: this.millisecond(),
    };
  };

  // toArray - 배열로 변환
  (VDateClass.prototype as any).toArray = function (): number[] {
    return [
      this.year(),
      this.month() - 1, // 0-11
      this.date(),
      this.hour(),
      this.minute(),
      this.second(),
      this.millisecond(),
    ];
  };

  // quarterOfYear - 분기 반환
  (VDateClass.prototype as any).quarter = function (): number {
    return Math.ceil(this.month() / 3);
  };
}
