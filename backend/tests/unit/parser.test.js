const { parseMarkdown } = require('../../scripts/parser');

describe('Markdown Parser', () => {
  it('should correctly extract exercises from a sample markdown block', async () => {
    const markdown = `
### A1. Bench Press

- 5x5 @ 80%
- 1xAMRAP @ 80%

### B1. Squat

- 3x8 @ 70%
`;
    const expected = [
      {
        name: 'Bench Press',
        sets: [
          { reps: 5, sets: 5, percentage: 80 },
          { reps: 'AMRAP', sets: 1, percentage: 80 },
        ],
      },
      {
        name: 'Squat',
        sets: [{ reps: 8, sets: 3, percentage: 70 }],
      },
    ];
    const result = await parseMarkdown(markdown);
    expect(result).toEqual(expected);
  });

  it('should correctly extract exercises with lbs', async () => {
    const markdown = `
### C1. Overhead Press Haltères

- 3x8 @ 15 lbs
`;
    const expected = [
      {
        name: 'Overhead Press Haltères',
        sets: [
          { reps: 8, sets: 3, weight: 15, unit: 'lbs' },
        ],
      },
    ];
    const result = await parseMarkdown(markdown);
    expect(result).toEqual(expected);
  });
});
