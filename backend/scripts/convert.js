const fs = require('fs').promises;
const path = require('path');
const { parseExcelProgram } = require('./excelParser');

/**
 * Convert Excel workout program to JSON format
 * Supports both .xlsx Excel files and legacy .md markdown files
 */
async function main() {
  const args = process.argv.slice(2);
  const inputIndex = args.indexOf('--input');
  const outputIndex = args.indexOf('--output');

  if (inputIndex === -1 || outputIndex === -1) {
    console.error('Usage: node convert.js --input <file> --output <file>');
    console.error('Supports: .xlsx (Excel) or .md (Markdown - legacy)');
    process.exit(1);
  }

  const inputFile = args[inputIndex + 1];
  const outputFile = args[outputIndex + 1];

  try {
    const ext = path.extname(inputFile).toLowerCase();
    let data;

    if (ext === '.xlsx') {
      // Parse Excel file (new preferred method)
      console.log(`📊 Parsing Excel file: ${inputFile}`);
      data = parseExcelProgram(inputFile);
      console.log(`✅ Parsed ${data.phases.length} phases, ${data.exercises.length} exercises`);
    } else if (ext === '.md') {
      // Legacy Markdown support
      console.log(`📝 Parsing Markdown file (legacy): ${inputFile}`);
      const { parseMarkdown } = require('./parser');
      const markdown = await fs.readFile(inputFile, 'utf-8');
      data = await parseMarkdown(markdown);
      console.log('⚠️  Warning: Markdown parsing is deprecated. Consider using Excel format.');
    } else {
      throw new Error(`Unsupported file format: ${ext}. Use .xlsx or .md`);
    }

    // Write JSON output
    await fs.writeFile(outputFile, JSON.stringify(data, null, 2));
    console.log(`\n✅ Successfully converted to ${outputFile}`);
    console.log(`📦 File size: ${(JSON.stringify(data).length / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Error during conversion:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
