
// Mock Data and Logic (Copied from src to avoid ESM require issues in simple node script)

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

const SYSTEM_WAREHOUSES = [
    { id: 1, name: 'Chi nhánh 1' },
    { id: 2, name: 'Chi nhánh 2' },
    { id: 3, name: 'Kho tổng' },
    { id: 5, name: 'Kho HCM' }
];

const SYSTEM_PRICE_POLICIES = [
    { id: 101, code: 'CTL628922', name: 'Facebook' },
    { id: 102, code: 'CTL595297', name: 'Lazada' }
];

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
        missingRequired: missingRequired,
        missingOptionalSystem: missingOptionalSystem,
        extraHeaders: extraHeaders,
        matchedColumns: matchedColumns,
        warehouseColumns: warehouseColumns,
        pricePolicyColumns: pricePolicyColumns
    };
};

// ------------- TESTS -------------

console.log("Running Tests...");

// Test Case 1: All Required Present, Some Optional Missing
const headers1 = ["Tên sản phẩm*", "Hiển thị*", "Mã SKU", "Chi nhánh 1_Tồn kho"];
const result1 = analyzeHeaders(headers1);

if (result1.missingRequired.length === 0) {
    console.log("PASS: Required headers found.");
} else {
    console.error("FAIL: Missing required headers but shouldn't be.", result1.missingRequired);
}

if (result1.missingOptionalSystem.includes("Mô tả sản phẩm")) {
    console.log("PASS: Missing optional 'Mô tả sản phẩm' detected.");
} else {
    console.error("FAIL: Missing optional system header not detected.");
}

if (result1.warehouseColumns.length === 1 && result1.warehouseColumns[0].status === 'MATCHED') {
    console.log("PASS: Warehouse column detected.");
} else {
    console.error("FAIL: Warehouse column detection failed.");
}


// Test Case 2: Missing Required
const headers2 = ["Hiển thị*", "Mã SKU"];
const result2 = analyzeHeaders(headers2);

if (result2.missingRequired.includes("Tên sản phẩm*")) {
    console.log("PASS: Missing required 'Tên sản phẩm*' detected.");
} else {
    console.error("FAIL: Missing required header NOT detected.");
}

// Test Case 3: Extra/Junk Columns
const headers3 = ["Tên sản phẩm*", "Hiển thị*", "JunkColumn123"];
const result3 = analyzeHeaders(headers3);

if (result3.extraHeaders.includes("JunkColumn123")) {
    console.log("PASS: Extra header detected.");
} else {
    console.error("FAIL: Extra header NOT detected.", result3.extraHeaders);
}

console.log("Tests Completed.");
