const fs = require('fs').promises;
const { parseMarkdown } = require('./parser');

async function main() {
  const args = process.argv.slice(2);
  const inputIndex = args.indexOf('--input');
  const outputIndex = args.indexOf('--output');

  if (inputIndex === -1 || outputIndex === -1) {
    console.error('Usage: node convert.js --input <file> --output <file>');
    process.exit(1);
  }

  const inputFile = args[inputIndex + 1];
  const outputFile = args[outputIndex + 1];

  try {
    const markdown = await fs.readFile(inputFile, 'utf-8');
    const data = await parseMarkdown(markdown);
    await fs.writeFile(outputFile, JSON.stringify(data, null, 2));
    console.log(`Successfully converted ${inputFile} to ${outputFile}`);
  } catch (error) {
    console.error('Error during conversion:', error);
    process.exit(1);
  }
}

main();
