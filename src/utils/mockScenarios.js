
// Pre-defined scenarios to simulate file analysis results
// This allows testing the UI without needing to drag-and-drop specific files every time.

export const SCENARIOS = {
    HAPPY_PATH: {
        name: "Trường hợp chuẩn (Happy Path)",
        description: "File chuẩn, đầy đủ mọi cột bắt buộc. Hệ thống tự động ghép nối kho thành công 100%.",
        type: "success",
        file: { name: "file_chuan_nhap_khau.xlsx", size: 1024 * 45 },
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
        name: "Thiếu cột bắt buộc (Lỗi chặn)",
        description: "File thiếu cột 'Tên sản phẩm*' và 'Hiển thị*'. Hệ thống báo lỗi đỏ và chặn nút nhập file.",
        type: "error",
        file: { name: "file_thieu_cot_bat_buoc.csv", size: 1024 * 12 },
        analysis: {
            totalColumns: 30,
            fileHeaders: ["Mã SKU", "Giá", "Mô tả sản phẩm"],
            missingRequired: ["Tên sản phẩm*", "Hiển thị*"],
            missingOptional: ["Đường dẫn/Alias", "Nhãn hiệu"],
            missingColumns: ["Tên sản phẩm*", "Hiển thị*", "Đường dẫn/Alias", "Nhãn hiệu"],
            matchedColumns: {},
            warehouseColumns: []
        }
    },

    MISSING_OPTIONAL: {
        name: "Thiếu cột tùy chọn (Cảnh báo nhẹ)",
        description: "File thiếu cột 'Giá', 'Mã SKU'. Hệ thống hiển thị thông báo xám, vẫn cho phép nhập file.",
        type: "warning",
        file: { name: "file_thieu_thong_tin_phu.xlsx", size: 1024 * 25 },
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
        name: "Xung đột kho hàng",
        description: "Phát hiện cột 'Kho Lạ' (không có trong hệ thống) và 'CN1' (cần xác nhận). Cần ghép nối thủ công.",
        type: "info",
        file: { name: "file_sai_ten_kho.xlsx", size: 1024 * 30 },
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
                    status: "MATCHED",
                    matchedWarehouse: { id: 1, name: "Chi nhánh 1" }
                }
            ]
        }
    },

    EXCESS_LOCATIONS: {
        name: "Cửa hàng chỉ có 1 kho (File 2+ cột kho)",
        description: "Cửa hàng chỉ có 'Chi nhánh 1', nhưng file có cột 'Chi nhánh 1' và 'Kho HCM'. Cột thừa sẽ báo lỗi.",
        type: "warning",
        file: { name: "file_thua_kho.xlsx", size: 1024 * 32 },
        systemWarehouses: [
            { id: 1, name: 'Chi nhánh 1' }
        ],
        analysis: {
            totalColumns: 35,
            fileHeaders: ["Tên sản phẩm*", "Hiển thị*", "Chi nhánh 1_Tồn kho", "Kho HCM_Tồn kho"],
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
                    fileHeader: "Kho HCM_Tồn kho",
                    extractedName: "Kho HCM",
                    status: "UNKNOWN",
                    matchedWarehouse: null
                }
            ]
        }
    },

    EMPTY_STATE: {
        name: "Đặt lại trạnh thái (Reset)",
        description: "Xóa toàn bộ dữ liệu mẫu, quay về màn hình upload trống.",
        type: "neutral",
        file: null,
        analysis: null
    }
};
