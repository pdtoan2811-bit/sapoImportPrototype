
// Pre-defined scenarios to simulate file analysis results
// This allows testing the UI without needing to drag-and-drop specific files every time.

export const SCENARIOS = {
    HAPPY_PATH: {
        name: "Happy Path (Review Success)",
        description: "Perfect file. All required columns matched. Warehouses matched.",
        file: { name: "perfect_import.xlsx", size: 1024 * 45 },
        analysis: {
            totalColumns: 35,
            fileHeaders: [
                "Đường dẫn/Alias", "Tên sản phẩm*", "Mô tả sản phẩm", "Nhãn hiệu", "Loại sản phẩm",
                "Tags", "Yêu cầu vận chuyển", "Hiển thị*", "Thuộc tính 1", "Giá trị thuộc tính 1",
                "Chi nhánh 1_Tồn kho", "Kho tổng_Tồn kho"
            ],
            missingRequired: [],
            missingOptional: [],
            missingColumns: [],
            matchedColumns: {
                "Tên sản phẩm*": "Tên sản phẩm*",
                "Hiển thị*": "Hiển thị*"
            },
            warehouseColumns: [
                {
                    fileHeader: "Chi nhánh 1_Tồn kho",
                    extractedName: "Chi nhánh 1",
                    status: "MATCHED",
                    matchedWarehouse: { id: 1, name: "Chi nhánh 1" }
                },
                {
                    fileHeader: "Kho tổng_Tồn kho",
                    extractedName: "Kho tổng",
                    status: "MATCHED",
                    matchedWarehouse: { id: 3, name: "Kho tổng" }
                }
            ]
        }
    },

    MISSING_REQUIRED: {
        name: "Missing Required Columns",
        description: "File is missing 'Tên sản phẩm*' and 'Hiển thị*'. Blocks import.",
        file: { name: "missing_required.csv", size: 1024 * 12 },
        analysis: {
            totalColumns: 30,
            fileHeaders: ["Mã SKU", "Giá", "Mô tả sản phẩm"],
            missingRequired: ["Tên sản phẩm*", "Hiển thị*"],
            missingOptional: ["Đường dẫn/Alias", "Nhãn hiệu"], // simplified list
            missingColumns: ["Tên sản phẩm*", "Hiển thị*", "Đường dẫn/Alias", "Nhãn hiệu"],
            matchedColumns: {},
            warehouseColumns: []
        }
    },

    MISSING_OPTIONAL: {
        name: "Missing Optional (Subtle)",
        description: "File has required columns but lacks 'Giá' and 'Mã SKU'. Shows gray info box.",
        file: { name: "missing_optional.xlsx", size: 1024 * 25 },
        analysis: {
            totalColumns: 32,
            fileHeaders: ["Tên sản phẩm*", "Hiển thị*", "Mô tả sản phẩm"],
            missingRequired: [],
            missingOptional: ["Giá", "Mã SKU", "Barcode"],
            missingColumns: ["Giá", "Mã SKU", "Barcode"],
            matchedColumns: {
                "Tên sản phẩm*": "Tên sản phẩm*",
                "Hiển thị*": "Hiển thị*"
            },
            warehouseColumns: []
        }
    },

    WAREHOUSE_ISSUES: {
        name: "Warehouse Mapping Issues",
        description: "Contains 'Kho Lạ_Tồn kho' (Unknown) and 'CN1_Tồn kho' (Ambiguous).",
        file: { name: "warehouse_conflict.xlsx", size: 1024 * 30 },
        analysis: {
            totalColumns: 35,
            fileHeaders: ["Tên sản phẩm*", "Hiển thị*", "Kho Lạ_Tồn kho", "CN1_Tồn kho"],
            missingRequired: [],
            missingOptional: [],
            missingColumns: [],
            matchedColumns: {
                "Tên sản phẩm*": "Tên sản phẩm*",
                "Hiển thị*": "Hiển thị*"
            },
            warehouseColumns: [
                {
                    fileHeader: "Kho Lạ_Tồn kho",
                    extractedName: "Kho Lạ",
                    status: "UNKNOWN",
                    matchedWarehouse: null
                },
                {
                    fileHeader: "CN1_Tồn kho",
                    extractedName: "CN1",
                    status: "MATCHED", // Simulate fuzzy match found but needs confirmation if logic decides
                    matchedWarehouse: { id: 1, name: "Chi nhánh 1" }
                }
            ]
        }
    },

    EMPTY_STATE: {
        name: "Reset / Empty State",
        description: "Initial state with no file.",
        file: null,
        analysis: null
    }
};
