import { VDate } from '../core';

export function MinMaxPlugin(VDateClass: typeof VDate): void {
  // Static method: get the maximum date from a list
  (VDateClass as any).max = function (...dates: any[]): VDate {
    // Handle both spread arguments and array as single argument
    const dateList = dates.length === 1 && Array.isArray(dates[0]) ? dates[0] : dates;

    if (dateList.length === 0) {
      throw new Error('At least one date is required for max()');
    }

    let max = dateList[0] instanceof VDateClass ? dateList[0] : new VDateClass(dateList[0]);

    for (let i = 1; i < dateList.length; i++) {
      const current = dateList[i] instanceof VDateClass ? dateList[i] : new VDateClass(dateList[i]);
      if (current.unix() > max.unix()) {
        max = current;
      }
    }

    return max;
  };

  // Static method: get the minimum date from a list
  (VDateClass as any).min = function (...dates: any[]): VDate {
    // Handle both spread arguments and array as single argument
    const dateList = dates.length === 1 && Array.isArray(dates[0]) ? dates[0] : dates;

    if (dateList.length === 0) {
      throw new Error('At least one date is required for min()');
    }

    let min = dateList[0] instanceof VDateClass ? dateList[0] : new VDateClass(dateList[0]);

    for (let i = 1; i < dateList.length; i++) {
      const current = dateList[i] instanceof VDateClass ? dateList[i] : new VDateClass(dateList[i]);
      if (current.unix() < min.unix()) {
        min = current;
      }
    }

    return min;
  };
}
