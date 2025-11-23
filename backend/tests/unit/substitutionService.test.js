const {
  getExerciseInfo,
  getAlternatives,
  validateSubstitution,
  getAllCategories,
  getExercisesByCategory,
} = require('../../src/services/substitutionService')

describe('Substitution Service', () => {
  describe('getExerciseInfo', () => {
    it('should return exercise info for known exercise', () => {
      const info = getExerciseInfo('Trap Bar Deadlift')
      expect(info).toBeDefined()
      expect(info.category).toBe('Lower Body - Posterior Chain')
      expect(info.type).toBe('Max Effort')
      expect(info.alternatives).toBeInstanceOf(Array)
    })

    it('should return null for unknown exercise', () => {
      const info = getExerciseInfo('Unknown Exercise')
      expect(info).toBeNull()
    })
  })

  describe('getAlternatives', () => {
    it('should return alternatives for an exercise', () => {
      const alternatives = getAlternatives('Trap Bar Deadlift')
      expect(alternatives).toBeInstanceOf(Array)
      expect(alternatives.length).toBeGreaterThan(0)
      expect(alternatives).toContain('Conventional Deadlift')
    })

    it('should filter alternatives based on reason', () => {
      const alternatives = getAlternatives('Floor Press Haltères', 'shoulder pain')
      expect(alternatives).toBeInstanceOf(Array)
      // Should filter out exercises with shoulder pain restriction
    })

    it('should return empty array for unknown exercise', () => {
      const alternatives = getAlternatives('Unknown Exercise')
      expect(alternatives).toEqual([])
    })
  })

  describe('validateSubstitution', () => {
    it('should validate substitution in same category', () => {
      // Both exercises need to be in the database
      const result = validateSubstitution('Trap Bar Deadlift', 'KB Swings')
      expect(result.isValid).toBe(true)
      // Different categories will give warning
      expect(result.message).toContain('Different movement category')
    })

    it('should accept same category substitution', () => {
      // Both Goblet Squats and Box Squats are in "Lower Body - Squat Pattern"
      const result = validateSubstitution('Goblet Squats', 'Box Squats')
      expect(result.isValid).toBe(true)
      expect(result.message).toContain('same category')
    })

    it('should warn about different categories', () => {
      const result = validateSubstitution('Trap Bar Deadlift', 'Box Squats')
      expect(result.isValid).toBe(true)
      expect(result.message).toContain('Different movement category')
      expect(result.warning).toBeDefined()
    })

    it('should handle unknown original exercise', () => {
      const result = validateSubstitution('Unknown Exercise', 'Bench Press')
      expect(result.isValid).toBe(false)
      expect(result.message).toContain('not found')
    })

    it('should allow custom exercises with warning', () => {
      const result = validateSubstitution('Trap Bar Deadlift', 'Custom Exercise')
      expect(result.isValid).toBe(true)
      expect(result.message).toContain('Custom exercise')
      expect(result.warning).toBeDefined()
    })
  })

  describe('getAllCategories', () => {
    it('should return array of categories', () => {
      const categories = getAllCategories()
      expect(categories).toBeInstanceOf(Array)
      expect(categories.length).toBeGreaterThan(0)
      expect(categories).toContain('Lower Body - Posterior Chain')
    })

    it('should return sorted categories', () => {
      const categories = getAllCategories()
      const sorted = [...categories].sort()
      expect(categories).toEqual(sorted)
    })
  })

  describe('getExercisesByCategory', () => {
    it('should return exercises in a category', () => {
      const exercises = getExercisesByCategory('Lower Body - Posterior Chain')
      expect(exercises).toBeInstanceOf(Array)
      expect(exercises).toContain('Trap Bar Deadlift')
    })

    it('should return empty array for non-existent category', () => {
      const exercises = getExercisesByCategory('Non-existent Category')
      expect(exercises).toEqual([])
    })
  })
})
