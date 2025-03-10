import { describe, expect, it } from 'vitest';
import { minidenticon } from './minidenticon';

describe('minidenticon', () => {
  describe('simpleHash', () => {
    it('should generate consistent hash for same input', () => {
      const hash1 = minidenticon('test');
      const hash2 = minidenticon('test');
      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different inputs', () => {
      const hash1 = minidenticon('test1');
      const hash2 = minidenticon('test2');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('minidenticon', () => {
    it('should generate empty SVG for empty seed', () => {
      const result = minidenticon();
      expect(result).toBe(
        '<svg viewBox="-1.5 -1.5 8 8" xmlns="http://www.w3.org/2000/svg" fill="hsl(40 95% 45%)"></svg>'
      );
    });

    it('should generate SVG with custom saturation and lightness', () => {
      const result = minidenticon('test', 80, 60);
      expect(result).toContain('fill="hsl(');
      expect(result).toContain(' 80% 60%');
    });

    it('should generate SVG with custom hash function', () => {
      const customHash = (str: string) => str.length;
      const result = minidenticon('test', 95, 45, customHash);
      expect(result).toContain('<svg');
      expect(result).toContain('</svg>');
    });

    it('should generate valid SVG with rect elements', () => {
      const result = minidenticon('test');
      expect(result).toContain('<rect');
      expect(result).toContain('width="1" height="1"');
    });

    it('should handle special characters in seed', () => {
      const result = minidenticon('test!@#$%^&*()');
      expect(result).toContain('<svg');
      expect(result).toContain('</svg>');
    });

    it('should handle unicode characters in seed', () => {
      const result = minidenticon('测试');
      expect(result).toContain('<svg');
      expect(result).toContain('</svg>');
    });

    it('should generate SVG with correct viewBox', () => {
      const result = minidenticon('test');
      expect(result).toContain('viewBox="-1.5 -1.5 8 8"');
    });

    it('should generate SVG with correct namespace', () => {
      const result = minidenticon('test');
      expect(result).toContain('xmlns="http://www.w3.org/2000/svg"');
    });
  });
});
