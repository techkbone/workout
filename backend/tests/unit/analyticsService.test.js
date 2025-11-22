const {
  calculateEstimated1RM,
  calculateEstimated1RMBrzycki,
} = require('../../src/services/analyticsService');

describe('Analytics Service', () => {
  describe('calculateEstimated1RM', () => {
    it('should return the weight for 1 rep', () => {
      expect(calculateEstimated1RM(100, 1)).toBe(100);
    });

    it('should calculate estimated 1RM using Epley formula for 5 reps', () => {
      // 100 × (1 + 5/30) = 100 × 1.1667 = 116.67 ≈ 117
      expect(calculateEstimated1RM(100, 5)).toBe(117);
    });

    it('should calculate estimated 1RM for 3 reps', () => {
      // 100 × (1 + 3/30) = 100 × 1.1 = 110
      expect(calculateEstimated1RM(100, 3)).toBe(110);
    });

    it('should calculate estimated 1RM for 10 reps', () => {
      // 100 × (1 + 10/30) = 100 × 1.333 = 133.3 ≈ 133
      expect(calculateEstimated1RM(100, 10)).toBe(133);
    });

    it('should handle fractional weights', () => {
      // 45 × (1 + 5/30) = 45 × 1.1667 = 52.5 ≈ 53
      expect(calculateEstimated1RM(45, 5)).toBe(53);
    });
  });

  describe('calculateEstimated1RMBrzycki', () => {
    it('should return the weight for 1 rep', () => {
      expect(calculateEstimated1RMBrzycki(100, 1)).toBe(100);
    });

    it('should calculate estimated 1RM using Brzycki formula for 5 reps', () => {
      // 100 × (36 / (37 - 5)) = 100 × (36/32) = 112.5 ≈ 113
      expect(calculateEstimated1RMBrzycki(100, 5)).toBe(113);
    });

    it('should calculate estimated 1RM for 10 reps', () => {
      // 100 × (36 / (37 - 10)) = 100 × (36/27) = 133.33 ≈ 133
      expect(calculateEstimated1RMBrzycki(100, 10)).toBe(133);
    });

    it('should handle very high reps by returning the weight', () => {
      // Formula breaks down at >= 37 reps
      expect(calculateEstimated1RMBrzycki(100, 37)).toBe(100);
      expect(calculateEstimated1RMBrzycki(100, 50)).toBe(100);
    });
  });
});
