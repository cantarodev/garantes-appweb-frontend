import { parse } from 'date-fns';

export const convertToPeriodDate = (period) => {
  const date = parse(period, 'yyyyMM', new Date());
  return date;
};
