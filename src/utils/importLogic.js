import * as XLSX from 'xlsx';

// Standard System Data
export const SYSTEM_WAREHOUSES = [
  { id: 1, name: 'Chi nhánh 1' },
  { id: 2, name: 'Chi nhánh 2' },
  { id: 3, name: 'Kho tổng' },
  { id: 4, name: 'Cửa hàng Hai Bà Trưng' },
  { id: 5, name: 'Kho HCM' },
  { id: 6, name: 'Kho Online' }
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
  const warehouseColumns = [];
  const missingRequired = [];
  const missingOptional = [];
  const matchedColumns = {}; // Map of SystemHeader -> FileHeader

  // 1. Check against ALL Expected Headers (Sample First Approach)
  EXPECTED_HEADERS.forEach(expected => {
    if (fileHeaders.includes(expected)) {
      matchedColumns[expected] = expected; // Auto-match exact names
    } else {
      if (expected.endsWith('*')) {
        missingRequired.push(expected);
      } else {
        missingOptional.push(expected);
      }
    }
  });

  // 2. Identify Warehouse Columns
  fileHeaders.forEach((header, index) => {
    if (typeof header !== 'string') return;

    // Check for suffix "_Tồn kho"
    if (header.endsWith('_Tồn kho')) {
      const prefix = header.substring(0, header.length - '_Tồn kho'.length);
      const match = findBestMatch(prefix);

      warehouseColumns.push({
        fileHeader: header,
        columnIndex: index,
        extractedName: prefix,
        status: match.status,
        matchedWarehouse: match.warehouse
      });
    }
  });

  return {
    totalColumns: fileHeaders.length,
    fileHeaders, // Return all file headers for mapping dropdowns
    warehouseColumns,
    missingRequired,
    missingOptional,
    matchedColumns
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
