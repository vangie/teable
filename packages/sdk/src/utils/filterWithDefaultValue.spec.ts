import { CellValueType, DbFieldType, FieldType } from '@teable/core';
import type { IFieldVo, IFilter, IFilterItem, ILinkFieldOptions } from '@teable/core';
import { getBaseCollaboratorList, getRecords, PrincipalType } from '@teable/openapi';
import { describe, expect, it, vi } from 'vitest';
import {
  validateFilterOperators,
  generateValueByFilteredField,
  extractDefaultFieldsFromFilters,
} from './filterWithDefaultValue';

vi.mock('@teable/openapi', () => ({
  getBaseCollaboratorList: vi.fn(),
  getRecords: vi.fn(),
  PrincipalType: {
    User: 'User',
  },
}));

describe('validateFilterOperators', () => {
  it('should return false for undefined filter', () => {
    expect(validateFilterOperators(undefined)).toBe(false);
  });

  it('should validate single filter item with valid operator', () => {
    const filter: IFilterItem = {
      fieldId: 'field1',
      operator: 'is',
      value: 'test',
      isSymbol: false,
    };
    expect(validateFilterOperators(filter)).toBe(true);
  });

  it('should validate filter set with valid operators', () => {
    const filter: IFilter = {
      conjunction: 'and',
      filterSet: [
        {
          fieldId: 'field1',
          operator: 'is',
          value: 'test',
          isSymbol: false,
        },
      ],
    };
    expect(validateFilterOperators(filter)).toBe(true);
  });

  it('should return false for invalid operator', () => {
    const filter = {
      fieldId: 'field1',
      operator: 'invalid',
      value: 'test',
      isSymbol: false,
    } as unknown as IFilterItem;
    expect(validateFilterOperators(filter)).toBe(false);
  });

  it('should return false for or conjunction with multiple filters', () => {
    const filter: IFilter = {
      conjunction: 'or',
      filterSet: [
        {
          fieldId: 'field1',
          operator: 'is',
          value: 'test1',
          isSymbol: false,
        },
        {
          fieldId: 'field2',
          operator: 'is',
          value: 'test2',
          isSymbol: false,
        },
      ],
    };
    expect(validateFilterOperators(filter)).toBe(false);
  });
});

describe('generateValueByFilteredField', () => {
  const currentUserId = 'user1';
  const userMap = {
    user1: { id: 'user1', title: 'User 1' },
  };
  const linkMap = {
    link1: { id: 'link1', title: 'Link 1' },
  };

  const baseField: IFieldVo = {
    id: 'field1',
    name: 'Field',
    type: FieldType.SingleLineText,
    isMultipleCellValue: false,
    isComputed: false,
    options: {},
    cellValueType: CellValueType.String,
    dbFieldType: DbFieldType.Text,
    dbFieldName: 'field1',
  };

  it('should handle text fields', () => {
    const field = { ...baseField, type: FieldType.SingleLineText };
    expect(
      generateValueByFilteredField({
        value: 'test',
        field,
        currentUserId,
        userMap,
        linkMap,
      })
    ).toBe('test');
  });

  it('should handle null values', () => {
    const field = { ...baseField, type: FieldType.SingleLineText };
    expect(
      generateValueByFilteredField({
        value: null,
        field,
        currentUserId,
        userMap,
        linkMap,
      })
    ).toBeNull();
  });

  it('should handle date fields with today mode', () => {
    const field = { ...baseField, type: FieldType.Date };
    const now = new Date().toISOString().split('T')[0];
    const result = generateValueByFilteredField({
      value: { mode: 'today' },
      field,
      currentUserId,
      userMap,
      linkMap,
    }) as string;
    expect(result.startsWith(now)).toBeTruthy();
  });

  it('should handle date fields with exact date', () => {
    const field = { ...baseField, type: FieldType.Date };
    const exactDate = '2025-01-01T00:00:00.000Z';
    const result = generateValueByFilteredField({
      value: { mode: 'exactDate', exactDate },
      field,
      currentUserId,
      userMap,
      linkMap,
    });
    expect(result).toBe(exactDate);
  });

  it('should handle multiple link fields', () => {
    const field = {
      ...baseField,
      type: FieldType.Link,
      isMultipleCellValue: true,
      options: { foreignTableId: 'table1' } as ILinkFieldOptions,
    };
    expect(
      generateValueByFilteredField({
        value: ['link1'],
        field,
        currentUserId,
        userMap,
        linkMap,
      })
    ).toEqual([linkMap.link1]);
  });
});

describe('extractDefaultFieldsFromFilters', () => {
  const fieldMap: Record<string, IFieldVo> = {
    field1: {
      id: 'field1',
      name: 'Text Field',
      type: FieldType.SingleLineText,
      isMultipleCellValue: false,
      isComputed: false,
      options: {},
      cellValueType: CellValueType.String,
      dbFieldType: DbFieldType.Text,
      dbFieldName: 'field1',
    },
    field2: {
      id: 'field2',
      name: 'User Field',
      type: FieldType.User,
      isMultipleCellValue: false,
      isComputed: false,
      options: {},
      cellValueType: CellValueType.String,
      dbFieldType: DbFieldType.Text,
      dbFieldName: 'field2',
    },
    field3: {
      id: 'field3',
      name: 'Link Field',
      type: FieldType.Link,
      isMultipleCellValue: false,
      isComputed: false,
      options: { foreignTableId: 'table1' } as ILinkFieldOptions,
      cellValueType: CellValueType.String,
      dbFieldType: DbFieldType.Text,
      dbFieldName: 'field3',
    },
  };

  it('should extract fields from simple filter', async () => {
    const filter: IFilter = {
      conjunction: 'and',
      filterSet: [
        {
          fieldId: 'field1',
          operator: 'is',
          value: 'test',
          isSymbol: false,
        },
      ],
    };

    const result = await extractDefaultFieldsFromFilters({
      filter,
      fieldMap,
      currentUserId: 'user1',
      isAsync: false,
    });

    expect(result).toEqual({
      field1: 'test',
    });
  });

  it('should handle repeated fields', async () => {
    const filter: IFilter = {
      conjunction: 'and',
      filterSet: [
        {
          fieldId: 'field1',
          operator: 'is',
          value: 'test1',
          isSymbol: false,
        },
        {
          fieldId: 'field1',
          operator: 'is',
          value: 'test2',
          isSymbol: false,
        },
      ],
    };

    const result = await extractDefaultFieldsFromFilters({
      filter,
      fieldMap,
      currentUserId: 'user1',
      isAsync: false,
    });

    expect(result).toEqual({});
  });
});
