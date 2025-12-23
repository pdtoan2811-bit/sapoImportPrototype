import * as XLSX from 'xlsx';
import fs from 'fs';

const filePath = '../product_import_template_full_with_lot_date-d3pIyglG (2).xlsx';

try {
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];

    console.log(JSON.stringify(headers));
} catch (error) {
    console.error("Error reading file:", error);
}
