import { describe, expect, it } from 'vitest';
import { splitRange, reorder, swapReorder, insertSingle } from './order';

describe('splitRange', () => {
  it('should split range into equal parts', () => {
    expect(splitRange(0, 10, 5)).toEqual([2, 4, 6, 8]);
    expect(splitRange(1, 5, 3)).toEqual([2.333333333333333, 3.6666666666666665]);
  });

  it('should handle zero range', () => {
    expect(splitRange(5, 5, 3)).toEqual([5, 5]);
  });
});

describe('reorder', () => {
  it('should handle reorder at start', () => {
    const getOrder = (i: number) => i + 1;
    const result = reorder(2, 0, 5, getOrder);
    expect(result).toEqual([0, -1]);
  });

  it('should handle reorder at end', () => {
    const getOrder = (i: number) => i + 1;
    const result = reorder(2, 5, 5, getOrder);
    expect(result).toEqual([6, 7]);
  });

  it('should handle reorder in middle', () => {
    const getOrder = (i: number) => i * 2;
    const result = reorder(2, 2, 5, getOrder);
    expect(result).toEqual([2.6666666666666665, 3.333333333333333]);
  });
});

describe('swapReorder', () => {
  it('should handle swap at start', () => {
    const getOrder = (i: number) => i + 1;
    const result = swapReorder(2, 1, 0, 5, getOrder);
    expect(result).toEqual([0, -1]);
  });

  it('should handle swap at end', () => {
    const getOrder = (i: number) => i + 1;
    const result = swapReorder(2, 1, 4, 5, getOrder);
    expect(result).toEqual([6, 7]);
  });

  it('should handle swap in middle when dropping after source', () => {
    const getOrder = (i: number) => i * 2;
    const result = swapReorder(2, 1, 3, 5, getOrder);
    expect(result).toEqual([6.666666666666667, 7.333333333333333]);
  });

  it('should handle swap in middle when dropping before source', () => {
    const getOrder = (i: number) => i * 2;
    const result = swapReorder(2, 3, 1, 5, getOrder);
    expect(result).toEqual([0.6666666666666666, 1.3333333333333333]);
  });
});

describe('insertSingle', () => {
  it('should handle insert before first element', () => {
    const getOrder = (i: number) => i + 1;
    const result = insertSingle(0, 5, getOrder, false);
    expect(result).toEqual(0);
  });

  it('should handle insert after last element', () => {
    const getOrder = (i: number) => i + 1;
    const result = insertSingle(4, 5, getOrder, true);
    expect(result).toEqual(6);
  });

  it('should handle insert between elements with isInsertAfter=true', () => {
    const getOrder = (i: number) => i * 2;
    const result = insertSingle(2, 5, getOrder, true);
    expect(result).toEqual(5);
  });

  it('should handle insert between elements with isInsertAfter=false', () => {
    const getOrder = (i: number) => i * 2;
    const result = insertSingle(2, 5, getOrder, false);
    expect(result).toEqual(3);
  });
});
