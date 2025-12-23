
import React, { useState } from 'react';
import { X, AlertTriangle, AlertOctagon, ChevronDown, CheckCircle, ExternalLink, Info } from 'lucide-react';
import FileUploader from './FileUploader';
import MappingResolution from './MappingResolution';
import { processFile, SYSTEM_WAREHOUSES, SYSTEM_PRICE_POLICIES } from '../utils/importLogic';
import PricePolicyMapping from './PricePolicyMapping';


const ImportModal = ({ onClose, externalScenario }) => {
    const [file, setFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);

    const [warehouseMapping, setWarehouseMapping] = useState({});
    const [pricePolicyMapping, setPricePolicyMapping] = useState({});
    const [importType, setImportType] = useState('normal');
    const [currentSystemWarehouses, setCurrentSystemWarehouses] = useState(SYSTEM_WAREHOUSES);
    const [currentSystemPricePolicies, setCurrentSystemPricePolicies] = useState(SYSTEM_PRICE_POLICIES);

    // Handle External Scenario Injection (Dev Mode)
    React.useEffect(() => {
        if (externalScenario) {
            if (externalScenario.file === null) {
                // Empty State
                handleClear();
            } else {
                setFile(externalScenario.file);
                const result = externalScenario.analysis;
                setAnalysis(result);

                // Set Custom Warehouses if scenario has them, otherwise reset to default
                if (externalScenario.systemWarehouses) {
                    setCurrentSystemWarehouses(externalScenario.systemWarehouses);
                } else {
                    setCurrentSystemWarehouses(SYSTEM_WAREHOUSES);
                }

                const initialWarehouseMapping = {};
                if (result.warehouseColumns) {
                    result.warehouseColumns.forEach(col => {
                        if (col.status === 'MATCHED' && col.matchedWarehouse) {
                            initialWarehouseMapping[col.fileHeader] = col.matchedWarehouse.id;
                        }
                    });
                }
                setWarehouseMapping(initialWarehouseMapping);

                // Set Custom Price Policies if scenario has them
                if (externalScenario.systemPricePolicies) {
                    setCurrentSystemPricePolicies(externalScenario.systemPricePolicies);
                } else {
                    setCurrentSystemPricePolicies(SYSTEM_PRICE_POLICIES);
                }

                // Initialize Price Policy Mapping
                const initialPriceMapping = {};
                if (result.pricePolicyColumns) {
                    result.pricePolicyColumns.forEach(col => {
                        if (col.status === 'MATCHED' && col.matchedPolicy) {
                            initialPriceMapping[col.fileHeader] = col.matchedPolicy.id;
                        }
                    });
                }
                setPricePolicyMapping(initialPriceMapping);
            }
        }
    }, [externalScenario]);

    const handleFileSelect = async (selectedFile) => {
        setFile(selectedFile);
        try {
            const result = await processFile(selectedFile);
            setAnalysis(result);

            // ... (rest of logic handles warehouse mapping init)
            const initialWarehouseMapping = {};
            result.warehouseColumns.forEach(col => {
                if (col.status === 'MATCHED' && col.matchedWarehouse) {
                    initialWarehouseMapping[col.fileHeader] = col.matchedWarehouse.id;
                }
            });
            setWarehouseMapping(initialWarehouseMapping);

            // Initialize Price Policy Mapping
            const initialPriceMapping = {};
            if (result.pricePolicyColumns) {
                result.pricePolicyColumns.forEach(col => {
                    if (col.status === 'MATCHED' && col.matchedPolicy) {
                        initialPriceMapping[col.fileHeader] = col.matchedPolicy.id;
                    }
                });
            }
            setPricePolicyMapping(initialPriceMapping);

        } catch (error) {
            console.error("Error reading file", error);
            alert("Lỗi đọc file");
        }
    };

    const handleClear = () => {
        setFile(null);
        setAnalysis(null);
        setWarehouseMapping({});
    };

    const handleWarehouseMappingChange = (fileHeader, warehouseId) => {
        setWarehouseMapping(prev => ({ ...prev, [fileHeader]: warehouseId }));
    };

    const handlePricePolicyMappingChange = (fileHeader, policyId) => {
        setPricePolicyMapping(prev => ({ ...prev, [fileHeader]: policyId }));
    };





    // Check for Blocking Warehouse Error (Single Store Limit)
    // - There are unmatched warehouse columns (e.g. 'Kho HCM')
    // - AND the store only has 1 warehouse ('Chi nhánh 1')
    // This implies the file has MORE warehouses than the store allows.
    const hasUnresolvedWarehouses = analysis?.warehouseColumns.some(col =>
        col.status !== 'MATCHED' || !warehouseMapping[col.fileHeader]
    );
    const hasWarehouseBlockingError = analysis && currentSystemWarehouses.length === 1 && hasUnresolvedWarehouses;

    // Check for Blocking Price Policy Error (Store has NO policies but file has policy columns)
    const hasPricePolicyBlockingError = analysis &&
        analysis.pricePolicyColumns &&
        analysis.pricePolicyColumns.length > 0 &&
        currentSystemPricePolicies.length === 0;

    return (
        <div className="modal-backdrop">
            <div className="modal-container">

                {/* Header */}
                <div className="modal-header">
                    <h2 className="modal-title">Nhập file danh sách sản phẩm</h2>
                    <button onClick={onClose} className="modal-close-btn">
                        <X size={24} strokeWidth={2} />
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body custom-scrollbar">

                    {/* Warning Banner */}
                    <div className="warning-box">
                        <div style={{ marginTop: '2px' }}><AlertTriangle size={20} color="#F57C00" strokeWidth={2} /></div>
                        <div>
                            Mẫu nhập file sản phẩm đã được thay đổi vào 29/04/2025. Vui lòng kiểm tra và <a href="#" className="sapo-link">tải lại file mẫu</a> để tránh sai lệch dữ liệu.
                        </div>
                    </div>

                    {/* Import Type */}
                    <div>
                        <p className="font-bold mb-3" style={{ fontSize: '14px', margin: '0 0 12px 0' }}>Loại file nhập:</p>
                        <div style={{ display: 'flex', gap: '32px' }}>
                            {['Sản phẩm thường', 'Sản phẩm combo', 'Sản phẩm quy đổi'].map((type, idx) => {
                                const val = type === 'Sản phẩm thường' ? 'normal' : type === 'Sản phẩm combo' ? 'combo' : 'convert';
                                return (
                                    <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="importType"
                                            checked={importType === val}
                                            onChange={() => setImportType(val)}
                                            style={{ width: '18px', height: '18px', accentColor: '#0088FF' }}
                                        />
                                        <span className="text-sm">{type}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* File Upload */}
                    <FileUploader
                        file={file}
                        onFileSelect={handleFileSelect}
                        onClearFile={handleClear}
                    />

                    {/* SECTION 1: REQUIRED MISSING COLUMNS (BLOCKING) */}
                    {analysis && analysis.missingRequired.length > 0 && (
                        <div className="flex-col gap-4">
                            <div className="error-box" style={{ flexDirection: 'row', alignItems: 'center', color: '#991B1B', background: '#FEF2F2', borderColor: '#FECACA' }}>
                                <AlertOctagon size={18} />
                                <span className="font-bold text-sm">File thiếu các cột bắt buộc sau (Không thể nhập file):</span>
                            </div>

                            <div style={{ border: '1px solid #FECACA', borderRadius: '8px', overflow: 'hidden', marginTop: '16px', background: '#FFF' }}>
                                {analysis.missingRequired.map((reqField, idx) => (
                                    <div key={idx} className="mapping-row" style={{ padding: '12px 16px', borderBottom: '1px solid #FEE2E2' }}>
                                        <div style={{ flex: 1 }}>
                                            <span className="font-bold text-sm block" style={{ color: '#B91C1C' }}>{reqField}</span>
                                            <span className="text-xs text-red">Bắt buộc</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '12px', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <AlertOctagon size={14} />
                                                Thiếu cột
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECTION 2: OPTIONAL MISSING SYSTEM COLUMNS (SUBTLE/GREY) */}
                    {analysis && analysis.missingOptionalSystem && analysis.missingOptionalSystem.length > 0 && (
                        <div className="flex-col gap-4">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '4px', color: '#374151' }}>
                                <Info size={18} color="#6B7280" />
                                <span className="font-medium text-sm">File thiếu {analysis.missingOptionalSystem.length} cột thông tin (Không bắt buộc) - Hệ thống sẽ để trống các trường này</span>
                            </div>

                            <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', marginTop: '8px', maxHeight: '200px', overflowY: 'auto' }} className="custom-scrollbar">
                                {analysis.missingOptionalSystem.map((optField, idx) => (
                                    <div key={idx} className="mapping-row" style={{ padding: '10px 16px' }}>
                                        <div style={{ flex: 1 }}>
                                            <span className="font-medium text-sm block" style={{ color: '#4B5563' }}>{optField}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic' }}>Sẽ bỏ trống</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Warehouse Mapping Resolution */}
                    {analysis && (
                        <MappingResolution
                            analysis={analysis}
                            mappingState={warehouseMapping}
                            onMappingChange={handleWarehouseMappingChange}
                            systemWarehouses={currentSystemWarehouses}
                        />
                    )}

                    {/* Price Policy Mapping Resolution */}
                    {analysis && (
                        <PricePolicyMapping
                            analysis={analysis}
                            mappingState={pricePolicyMapping}
                            onMappingChange={handlePricePolicyMappingChange}
                            systemPolicies={currentSystemPricePolicies}
                        />
                    )}

                    {/* Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '8px' }}>
                        <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
                            <input type="checkbox" style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: '#0088FF' }} />
                            <div className="text-sm">
                                <span className="font-medium">Ghi đè thông tin các sản phẩm trùng đường dẫn/alias</span>
                                <p style={{ margin: '4px 0 0', color: '#6B7280' }}>Các trường thông tin trống sẽ được hệ thống cập nhật với giá trị rỗng.</p>
                            </div>
                        </label>
                        <div style={{ height: '1px', background: '#E5E7EB' }}></div>
                        <label style={{ display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }}>
                            <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#0088FF' }} />
                            <span className="font-medium text-sm">Đăng bán các sản phẩm tạo mới trên tất cả các kênh</span>
                        </label>
                    </div>

                    <div style={{ paddingTop: '8px' }}>
                        <a href="#" className="sapo-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
                            Tìm hiểu thêm về nhập file sản phẩm
                        </a>
                    </div>

                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button
                        onClick={onClose}
                        className="sapo-btn sapo-btn-secondary"
                    >
                        Hủy
                    </button>
                    <button
                        className="sapo-btn sapo-btn-primary"
                        disabled={!file || (analysis && (analysis.missingRequired.length > 0 || hasWarehouseBlockingError))}
                    >
                        Nhập file
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ImportModal;
