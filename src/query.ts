import { VDate } from './core';

export type QueryUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';

export function addQueryMethods(VDateClass: typeof VDate): void {
  // isBefore - 지정된 날짜보다 이전인지 확인
  (VDateClass.prototype as any).isBefore = function (
    compared: VDate | Date | string | number,
    unit?: QueryUnit
  ): boolean {
    const other = compared instanceof VDate ? compared : new VDate(compared);

    if (!unit) {
      return this.unix() < other.unix();
    }

    const a = this.clone().startOf(unit as any);
    const b = other.clone().startOf(unit as any);
    return a.unix() < b.unix();
  };

  // isAfter - 지정된 날짜보다 이후인지 확인
  (VDateClass.prototype as any).isAfter = function (
    compared: VDate | Date | string | number,
    unit?: QueryUnit
  ): boolean {
    const other = compared instanceof VDate ? compared : new VDate(compared);

    if (!unit) {
      return this.unix() > other.unix();
    }

    const a = this.clone().startOf(unit as any);
    const b = other.clone().startOf(unit as any);
    return a.unix() > b.unix();
  };

  // isSame - 지정된 날짜와 같은지 확인
  (VDateClass.prototype as any).isSame = function (
    compared: VDate | Date | string | number,
    unit?: QueryUnit
  ): boolean {
    const other = compared instanceof VDate ? compared : new VDate(compared);

    if (!unit) {
      return this.unix() === other.unix();
    }

    const a = this.clone().startOf(unit as any);
    const b = other.clone().startOf(unit as any);
    return a.unix() === b.unix();
  };

  // isSameOrBefore - 지정된 날짜와 같거나 이전인지 확인
  (VDateClass.prototype as any).isSameOrBefore = function (
    compared: VDate | Date | string | number,
    unit?: QueryUnit
  ): boolean {
    const other = compared instanceof VDate ? compared : new VDate(compared);
    return this.isSame(other, unit) || this.isBefore(other, unit);
  };

  // isSameOrAfter - 지정된 날짜와 같거나 이후인지 확인
  (VDateClass.prototype as any).isSameOrAfter = function (
    compared: VDate | Date | string | number,
    unit?: QueryUnit
  ): boolean {
    const other = compared instanceof VDate ? compared : new VDate(compared);
    return this.isSame(other, unit) || this.isAfter(other, unit);
  };

  // isBetween - 두 날짜 사이에 있는지 확인
  (VDateClass.prototype as any).isBetween = function (
    start: VDate | Date | string | number,
    end: VDate | Date | string | number,
    unit?: QueryUnit,
    inclusivity: '[)' | '[]' | '(]' | '()' = '[)'
  ): boolean {
    const startDate = start instanceof VDate ? start : new VDate(start);
    const endDate = end instanceof VDate ? end : new VDate(end);

    const isAfterStart =
      inclusivity[0] === '['
        ? this.isSameOrAfter(startDate, unit)
        : this.isAfter(startDate, unit);

    const isBeforeEnd =
      inclusivity[1] === ']'
        ? this.isSameOrBefore(endDate, unit)
        : this.isBefore(endDate, unit);

    return isAfterStart && isBeforeEnd;
  };

  // isDayjs - VDate 인스턴스인지 확인 (정적 메서드는 core에서)
  (VDateClass.prototype as any).isDayjs = function (): boolean {
    return this instanceof VDate;
  };
}
