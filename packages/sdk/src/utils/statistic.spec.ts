import { CellValueType, StatisticsFunc } from '@teable/core';
import { describe, expect, it } from 'vitest';
import type { IFieldInstance } from '../model';
import { bytesToMB, percentFormatting, statisticsValue2DisplayValue } from './statistic';

describe('percentFormatting', () => {
  it('should return integer value as is', () => {
    expect(percentFormatting(42)).toBe(42);
  });

  it('should format decimal value to 2 decimal places', () => {
    expect(percentFormatting(42.125)).toBe('42.12');
  });

  it('should handle zero', () => {
    expect(percentFormatting(0)).toBe(0);
  });
});

describe('bytesToMB', () => {
  it('should convert bytes to MB string', () => {
    expect(bytesToMB(2097152)).toBe('2.00');
  });

  it('should return 0 for values less than 1MB', () => {
    expect(bytesToMB(500000)).toBe('0');
  });

  it('should handle zero bytes', () => {
    expect(bytesToMB(0)).toBe('0');
  });
});

describe('statisticsValue2DisplayValue', () => {
  const mockField = {
    type: 'text',
    isComputed: false,
    isPrimary: false,
    isLookup: false,
    name: 'Test Field',
    description: '',
    options: {},
    dbFieldType: 'text',
    cellValueType: CellValueType.String,
    cellValue2String: (value: unknown) => String(value),
    id: 'fldxxxx',
    dbFieldName: 'fld_xxx',
    notNull: false,
    unique: false,
    required: false,
    isMultipleCellValue: false,
    isMultipleCollaboratorValue: false,
    hasError: false,
  } as unknown as IFieldInstance;

  const numberField = {
    ...mockField,
    cellValueType: CellValueType.Number,
  } as unknown as IFieldInstance;

  const dateTimeField = {
    ...mockField,
    cellValueType: CellValueType.DateTime,
  } as unknown as IFieldInstance;

  const textField = {
    ...mockField,
    cellValueType: CellValueType.String,
  } as unknown as IFieldInstance;

  it('should handle count statistics', () => {
    expect(statisticsValue2DisplayValue(StatisticsFunc.Count, 5, numberField)).toBe('5');
    expect(statisticsValue2DisplayValue(StatisticsFunc.Count, 0, numberField)).toBe('0');
  });

  it('should handle empty/filled statistics', () => {
    expect(statisticsValue2DisplayValue(StatisticsFunc.Empty, 3, numberField)).toBe('3');
    expect(statisticsValue2DisplayValue(StatisticsFunc.Filled, 7, numberField)).toBe('7');
  });

  it('should handle unique statistics', () => {
    expect(statisticsValue2DisplayValue(StatisticsFunc.Unique, 4, numberField)).toBe('4');
  });

  it('should handle checked/unchecked statistics', () => {
    expect(statisticsValue2DisplayValue(StatisticsFunc.Checked, 2, numberField)).toBe('2');
    expect(statisticsValue2DisplayValue(StatisticsFunc.UnChecked, 8, numberField)).toBe('8');
  });

  it('should handle date range statistics', () => {
    expect(statisticsValue2DisplayValue(StatisticsFunc.DateRangeOfDays, 5, dateTimeField)).toBe(
      '5'
    );
    expect(statisticsValue2DisplayValue(StatisticsFunc.DateRangeOfMonths, 3, dateTimeField)).toBe(
      '3'
    );
  });

  it('should handle numeric statistics for number fields', () => {
    expect(statisticsValue2DisplayValue(StatisticsFunc.Max, 100, numberField)).toBe('100');
    expect(statisticsValue2DisplayValue(StatisticsFunc.Min, 0, numberField)).toBe('0');
    expect(statisticsValue2DisplayValue(StatisticsFunc.Sum, 500, numberField)).toBe('500');
    expect(statisticsValue2DisplayValue(StatisticsFunc.Average, 50, numberField)).toBe('50');
  });

  it('should handle date statistics for datetime fields', () => {
    expect(
      statisticsValue2DisplayValue(StatisticsFunc.LatestDate, '2025-03-01', dateTimeField)
    ).toBe('2025-03-01');
    expect(
      statisticsValue2DisplayValue(StatisticsFunc.EarliestDate, '2025-01-01', dateTimeField)
    ).toBe('2025-01-01');
  });

  it('should handle percentage statistics', () => {
    expect(statisticsValue2DisplayValue(StatisticsFunc.PercentEmpty, 25.5, textField)).toBe(
      '25.5%'
    );
    expect(statisticsValue2DisplayValue(StatisticsFunc.PercentFilled, 74.5, textField)).toBe(
      '74.5%'
    );
    expect(statisticsValue2DisplayValue(StatisticsFunc.PercentUnique, 50, textField)).toBe('50%');
    expect(statisticsValue2DisplayValue(StatisticsFunc.PercentChecked, 30, textField)).toBe('30%');
    expect(statisticsValue2DisplayValue(StatisticsFunc.PercentUnChecked, 70, textField)).toBe(
      '70%'
    );
  });

  it('should handle attachment size statistics', () => {
    expect(
      statisticsValue2DisplayValue(StatisticsFunc.TotalAttachmentSize, 2097152, textField)
    ).toBe('2.00MB');
  });

  it('should handle null values', () => {
    expect(statisticsValue2DisplayValue(StatisticsFunc.Sum, null, numberField)).toBe('0');
    expect(statisticsValue2DisplayValue(StatisticsFunc.Average, null, numberField)).toBe('null');
  });
});
