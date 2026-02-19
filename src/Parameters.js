// Parameters.js
import * as XLSX from 'xlsx';

let data = [];

// Load the Excel file from public folder
export async function loadData() {
    const response = await fetch('/Parameters.xlsx'); // path relative to public/
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
}

// Lookup function
export function lookup(searchValue, returnColIndex) {
    if (!data.length) throw new Error("Excel data not loaded yet. Call loadData() first.");
    if (!searchValue) return "";

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (!row) continue;
        if (String(row[0]).trim() === String(searchValue).trim()) {
            return row[returnColIndex - 1] ?? 0;
        }
    }
    return 0;
}
