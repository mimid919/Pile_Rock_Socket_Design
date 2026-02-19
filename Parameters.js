// Parameters.js
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the Excel file
const workbook = XLSX.readFile(path.join(__dirname, 'Parameters.xlsx'));
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert sheet to 2D array
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

export function lookup(searchValue, returnColIndex, startRow = 4, endRow = 108) {
    if (searchValue === "" || searchValue === null || searchValue === undefined) return "";

    for (let i = startRow - 1; i < endRow; i++) {
        const row = data[i];
        if (!row) continue;
        if (row[0] === searchValue) {
            return row[returnColIndex - 1] ?? 0;
        }
    }
    return 0;
}
