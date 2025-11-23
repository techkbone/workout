const XLSX = require('xlsx');
const path = require('path');

// Read the Excel file
const filePath = path.join(__dirname, '../../Programme_Westside_Rugby_Masters_2025-2026.xlsx');
const workbook = XLSX.readFile(filePath);

console.log('📊 EXCEL FILE ANALYSIS\n');
console.log('Sheet Names:', workbook.SheetNames);
console.log('\n');

// Analyze each sheet
workbook.SheetNames.forEach((sheetName, index) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`SHEET ${index + 1}: ${sheetName}`);
  console.log('='.repeat(60));

  const worksheet = workbook.Sheets[sheetName];
  const range = XLSX.utils.decode_range(worksheet['!ref']);

  console.log(`Range: ${worksheet['!ref']}`);
  console.log(`Rows: ${range.e.r + 1}, Columns: ${range.e.c + 1}`);

  // Convert to JSON to see structure
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

  console.log('\nFirst 20 rows:');
  jsonData.slice(0, 20).forEach((row, i) => {
    console.log(`Row ${i}:`, row);
  });

  // Also try with header detection
  console.log('\n\nWith header detection (first 10 entries):');
  const jsonWithHeaders = XLSX.utils.sheet_to_json(worksheet);
  console.log(JSON.stringify(jsonWithHeaders.slice(0, 10), null, 2));
});
