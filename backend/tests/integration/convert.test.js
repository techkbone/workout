const fs = require('fs').promises;
const { exec } = require('child_process');
const path = require('path');

jest.setTimeout(10000);

describe('Markdown to JSON Conversion Script', () => {
  const tempDir = path.join(__dirname, 'temp');
  const inputFile = path.join(tempDir, 'program.md');
  const outputFile = path.join(tempDir, 'program.json');

  beforeAll(async () => {
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterAll(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('should convert a markdown file to a valid JSON file', (done) => {
    const markdownContent = `
### A1. Bench Press

- 5x5 @ 80%
- 1xAMRAP @ 80%

### B1. Squat

- 3x8 @ 70%
`;
    const expectedJson = [
      {
        "name": "Bench Press",
        "sets": [
          { "sets": 5, "reps": 5, "percentage": 80 },
          { "sets": 1, "reps": "AMRAP", "percentage": 80 }
        ]
      },
      {
        "name": "Squat",
        "sets": [
          { "sets": 3, "reps": 8, "percentage": 70 }
        ]
      }
    ];

    fs.writeFile(inputFile, markdownContent).then(() => {
      exec(
        `node scripts/convert.js --input ${inputFile} --output ${outputFile}`,
        async (error, stdout, stderr) => {
          if (error) {
            return done(error);
          }
          const result = await fs.readFile(outputFile, 'utf-8');
          expect(JSON.parse(result)).toEqual(expectedJson);
          done();
        }
      );
    });
  });

  it('should convert a markdown file with lbs to a valid JSON file', (done) => {
    const markdownContent = `
### C1. Overhead Press Haltères

- 3x8 @ 15 lbs
`;
    const expectedJson = [
      {
        "name": "Overhead Press Haltères",
        "sets": [
          { "sets": 3, "reps": 8, "weight": 15, "unit": "lbs" }
        ]
      }
    ];

    fs.writeFile(inputFile, markdownContent).then(() => {
      exec(
        `node scripts/convert.js --input ${inputFile} --output ${outputFile}`,
        async (error, stdout, stderr) => {
          if (error) {
            return done(error);
          }
          const result = await fs.readFile(outputFile, 'utf-8');
          expect(JSON.parse(result)).toEqual(expectedJson);
          done();
        }
      );
    });
  });
});
