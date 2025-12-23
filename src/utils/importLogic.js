import * as XLSX from 'xlsx';

// Standard System Data
export const SYSTEM_WAREHOUSES = [
  { id: 1, name: 'Chi nhánh 1' },
  { id: 2, name: 'Chi nhánh 2' },
  { id: 3, name: 'Kho tổng' },
  { id: 4, name: 'Cửa hàng Hai Bà Trưng' },
  { id: 5, name: 'Kho HCM' },
  { id: 6, name: 'Kho Đà Nẵng' }
];

export const SYSTEM_PRICE_POLICIES = [
  { id: 101, code: 'CTL628922', name: 'Facebook' },
  { id: 102, code: 'CTL595297', name: 'Lazada' },
  { id: 103, code: 'CTL582343', name: 'Chat OmniAI' },
  { id: 104, code: 'CTL540995', name: 'POS' },
];

// Extracted from template
const EXPECTED_HEADERS = [
  "Đường dẫn/Alias", "Tên sản phẩm*", "Mô tả sản phẩm", "Nhãn hiệu", "Loại sản phẩm",
  "Tags", "Yêu cầu vận chuyển", "Hiển thị*", "Thuộc tính 1", "Giá trị thuộc tính 1",
  "Thuộc tính 2", "Giá trị thuộc tính 2", "Thuộc tính 3", "Giá trị thuộc tính 3",
  "Áp dụng thuế", "Mã SKU", "Barcode", "Đơn vị tính", "Ảnh đại diện", "Chú thích ảnh",
  "Thẻ tiêu đề(SEO Title)", "Thẻ mô tả(SEO Description)", "Mô tả ngắn", "Quản lý kho",
  "Quản lý lô - HSD", "Số ngày cảnh báo trước hết hạn", "Khối lượng", "Đơn vị khối lượng",
  "Ảnh phiên bản", "Cho phép tiếp tục mua khi hết hàng", "Giá", "Giá so sánh", "Giá vốn",
  "Id phiên bản"
];

const REQUIRED_HEADERS = EXPECTED_HEADERS.filter(h => h.endsWith('*'));

export const processFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Get headers (assume row 1)
        const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];

        const analysis = analyzeHeaders(headers || []);
        resolve(analysis);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

const analyzeHeaders = (fileHeaders) => {
  const matchedColumns = {}; // Map of SystemHeader -> FileHeader
  const missingRequired = [];

  // 1. Initial matching of EXPECTED_HEADERS to fileHeaders
  EXPECTED_HEADERS.forEach(expected => {
    if (fileHeaders.includes(expected)) {
      matchedColumns[expected] = expected;
    } else if (expected.endsWith('*')) {
      missingRequired.push(expected);
    }
  });

  // 3. Identify Warehouse Columns (suffix "_Tồn kho")
  const warehouseColumns = fileHeaders
    .filter(h => h.endsWith("_Tồn kho"))
    .map(h => {
      const extractedName = h.replace("_Tồn kho", "");
      const matched = SYSTEM_WAREHOUSES.find(w => w.name.toLowerCase() === extractedName.toLowerCase());
      return {
        fileHeader: h,
        extractedName: extractedName,
        status: matched ? 'MATCHED' : 'UNKNOWN',
        matchedWarehouse: matched || null
      };
    });

  // 4. Identify Price Policy Columns (suffix "_Thêm vào bảng giá")
  const pricePolicyColumns = fileHeaders
    .filter(h => h.endsWith("_Thêm vào bảng giá"))
    .map(h => {
      const extractedCode = h.replace("_Thêm vào bảng giá", "");
      const matched = SYSTEM_PRICE_POLICIES.find(p => p.code.toLowerCase() === extractedCode.toLowerCase());
      return {
        fileHeader: h,
        extractedCode: extractedCode,
        status: matched ? 'MATCHED' : 'UNKNOWN',
        matchedPolicy: matched || null
      };
    });

  // 5. Calculate Missing Columns for Generic Mapping
  // Create sets for quick lookup
  const matchedExpectedHeaders = new Set(Object.keys(matchedColumns)); // Headers from EXPECTED_HEADERS that were found
  const allExpectedHeadersSet = new Set(EXPECTED_HEADERS); // All expected headers
  const specialColumnsInFile = new Set([
    ...warehouseColumns.map(c => c.fileHeader),
    ...pricePolicyColumns.map(c => c.fileHeader)
  ]);

  // Find MISSING STANDARD OPTIONAL columns (System headers not required and not in file)
  const missingOptionalSystem = EXPECTED_HEADERS.filter(h =>
    !h.endsWith('*') && !fileHeaders.includes(h)
  );

  // Find EXTRA columns in file (Not Expected, Not Warehouse, Not PricePolicy)
  const extraHeaders = fileHeaders.filter(h =>
    !allExpectedHeadersSet.has(h) && // Not an expected header
    !specialColumnsInFile.has(h) // Not a special column (warehouse or price policy)
  );

  return {
    totalColumns: fileHeaders.length,
    fileHeaders: fileHeaders,
    missingRequired: missingRequired, // Strict required missing
    missingOptionalSystem: missingOptionalSystem, // System optional headers missing from file
    extraHeaders: extraHeaders, // Unknown/Extra columns in file
    matchedColumns: matchedColumns,
    warehouseColumns: warehouseColumns,
    pricePolicyColumns: pricePolicyColumns
  };
};

const findBestMatch = (inputName) => {
  const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const inputNorm = normalize(inputName);

  // 1. Exact Name Match (Case Insensitive)
  const exactMatch = SYSTEM_WAREHOUSES.find(w => w.name.toLowerCase() === inputName.toLowerCase());
  if (exactMatch) return { status: 'MATCHED', warehouse: exactMatch };

  // 2. Normalized Match
  const normMatch = SYSTEM_WAREHOUSES.find(w => normalize(w.name) === inputNorm);
  if (normMatch) return { status: 'MATCHED', warehouse: normMatch };

  // 3. Partial / Fuzzy Match (Naive implementation for demo)
  // If input contains warehouse name or vice versa
  const partialMatch = SYSTEM_WAREHOUSES.find(w => {
    const wNorm = normalize(w.name);
    return inputNorm.includes(wNorm) || wNorm.includes(inputNorm);
  });

  if (partialMatch) return { status: 'AMBIGUOUS', warehouse: partialMatch };

  return { status: 'UNKNOWN', warehouse: null };
};
