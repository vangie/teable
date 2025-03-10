import { describe, it, expect } from 'vitest';
import { DateUtil } from './date';

describe('DateUtil Test', () => {
  const utcDateStr = '2023-07-15T16:00:00.000Z';
  const dateTimeFormat = DateUtil.NORM_DATETIME_PATTERN;
  const datePattern = DateUtil.NORM_DATE_PATTERN;
  const timeStr = '09:00:00';

  describe('America/Los_Angeles timezone', () => {
    const dateUtil = new DateUtil('America/Los_Angeles');

    it('should handle basic date operations', () => {
      expect(dateUtil.date(utcDateStr).format()).toBe('2023-07-15T09:00:00-07:00');
      expect(dateUtil.date(utcDateStr).format(DateUtil.NORM_DATETIME_PATTERN)).toBe(
        `2023-07-15 ${timeStr}`
      );
      expect(dateUtil.date(utcDateStr).toISOString()).toBe(utcDateStr);
    });

    it('should handle day offsets', () => {
      expect(dateUtil.offsetDay(1, dateUtil.date(utcDateStr)).format(dateTimeFormat)).toBe(
        `2023-07-16 ${timeStr}`
      );

      expect(dateUtil.offsetDay(-1, dateUtil.date(utcDateStr)).format(dateTimeFormat)).toBe(
        `2023-07-14 ${timeStr}`
      );

      expect(dateUtil.offsetDay(0, dateUtil.date(utcDateStr)).format(dateTimeFormat)).toBe(
        `2023-07-15 ${timeStr}`
      );
    });

    it('should handle week offsets', () => {
      expect(dateUtil.offsetWeek(1, dateUtil.date(utcDateStr)).format(dateTimeFormat)).toBe(
        `2023-07-22 ${timeStr}`
      );

      expect(dateUtil.offsetWeek(-1, dateUtil.date(utcDateStr)).format(dateTimeFormat)).toBe(
        `2023-07-08 ${timeStr}`
      );

      expect(dateUtil.offsetWeek(0, dateUtil.date(utcDateStr)).format(dateTimeFormat)).toBe(
        `2023-07-15 ${timeStr}`
      );
    });

    it('should handle month offsets', () => {
      expect(dateUtil.offsetMonth(1, dateUtil.date(utcDateStr)).format(dateTimeFormat)).toBe(
        `2023-08-15 ${timeStr}`
      );

      expect(dateUtil.offsetMonth(-1, dateUtil.date(utcDateStr)).format(dateTimeFormat)).toBe(
        `2023-06-15 ${timeStr}`
      );

      expect(dateUtil.offsetMonth(0, dateUtil.date(utcDateStr)).format(dateTimeFormat)).toBe(
        `2023-07-15 ${timeStr}`
      );
    });

    it('should handle convenience methods', () => {
      expect(dateUtil.tomorrow().format(datePattern)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(dateUtil.yesterday().format(datePattern)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(dateUtil.nextWeek().format(datePattern)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(dateUtil.lastWeek().format(datePattern)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(dateUtil.nextMonth().format(datePattern)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(dateUtil.lastMonth().format(datePattern)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(dateUtil.now()).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
      expect(dateUtil.today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('Asia/Shanghai timezone', () => {
    const dateUtil = new DateUtil('Asia/Shanghai');

    it('should handle basic date operations', () => {
      expect(dateUtil.date(utcDateStr).format()).toBe('2023-07-16T00:00:00+08:00');
      expect(dateUtil.date(utcDateStr).format(DateUtil.NORM_DATETIME_PATTERN)).toBe(
        '2023-07-16 00:00:00'
      );
      expect(dateUtil.date(utcDateStr).toISOString()).toBe(utcDateStr);
    });

    it('should handle day offsets', () => {
      expect(dateUtil.offsetDay(1, dateUtil.date(utcDateStr)).format(dateTimeFormat)).toBe(
        '2023-07-17 00:00:00'
      );

      expect(dateUtil.offsetDay(-1, dateUtil.date(utcDateStr)).format(dateTimeFormat)).toBe(
        '2023-07-15 00:00:00'
      );
    });

    it('should handle week offsets', () => {
      expect(dateUtil.offsetWeek(1, dateUtil.date(utcDateStr)).format(dateTimeFormat)).toBe(
        '2023-07-23 00:00:00'
      );

      expect(dateUtil.offsetWeek(-1, dateUtil.date(utcDateStr)).format(dateTimeFormat)).toBe(
        '2023-07-09 00:00:00'
      );
    });

    it('should handle month offsets', () => {
      expect(dateUtil.offsetMonth(1, dateUtil.date(utcDateStr)).format(dateTimeFormat)).toBe(
        '2023-08-16 00:00:00'
      );

      expect(dateUtil.offsetMonth(-1, dateUtil.date(utcDateStr)).format(dateTimeFormat)).toBe(
        '2023-06-16 00:00:00'
      );
    });
  });

  describe('UTC mode', () => {
    const dateUtil = new DateUtil('UTC', true);

    it('should handle UTC dates correctly', () => {
      expect(dateUtil.date(utcDateStr).format()).toBe('2023-07-15T16:00:00Z');
      expect(dateUtil.date(utcDateStr).format(DateUtil.NORM_DATETIME_PATTERN)).toBe(
        '2023-07-15 16:00:00'
      );
    });
  });
});
