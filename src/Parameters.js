import * as XLSX from 'xlsx';

let data = [];

export async function loadData() {
    console.log("🚀 loadData() started");

    try {
        console.log("📡 Fetching /Parameters.xlsx ...");
        const response = await fetch('/Parameters.xlsx');

        console.log("📥 Response status:", response.status);

        if (!response.ok) {
            throw new Error("Fetch failed with status " + response.status);
        }

        const arrayBuffer = await response.arrayBuffer();
        console.log("📦 ArrayBuffer size:", arrayBuffer.byteLength);

        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        console.log("📊 Workbook sheets:", workbook.SheetNames);

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        console.log("✅ Excel loaded successfully");
        console.log("📄 Rows loaded:", data.length);

        return data;   // ⭐ THIS WAS MISSING

    } catch (error) {
        console.error("❌ loadData() FAILED:", error);
    }
}

export  async function lookup(searchValue, returnColIndex) {
    console.log("🔎 lookup() called");

    const data =  await loadData(); // Ensure data is loaded before lookup
    console.log("Current data length:", data.length);

    if (!data.length) {
        console.warn("⚠ Excel not loaded yet");
        return 0;
    }

    if (!searchValue) {
        console.warn("⚠ No search value provided");
        return "";
    }

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (!row) continue;

        if (String(row[0]).trim() === String(searchValue).trim()) {
            console.log("✅ Match found:", row);
            return row[returnColIndex - 1] ?? 0;
        }
    }

    console.warn("⚠ No match found");
    return 0;
}
