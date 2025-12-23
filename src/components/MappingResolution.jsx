
import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';
import { SYSTEM_WAREHOUSES } from '../utils/importLogic';


const MappingResolution = ({ analysis, mappingState, onMappingChange, systemWarehouses = SYSTEM_WAREHOUSES }) => {
    const [showValid, setShowValid] = useState(false);

    // Safety check
    const warehouseColumns = analysis?.warehouseColumns || [];

    // Group columns
    const validColumns = warehouseColumns.filter(col =>
        col.status === 'MATCHED' && mappingState[col.fileHeader]
    );

    const issueColumns = warehouseColumns.filter(col =>
        col.status !== 'MATCHED' || !mappingState[col.fileHeader]
    );

    const totalFound = warehouseColumns.length;
    if (totalFound === 0) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#182537', margin: 0 }}>
                    Phát hiện {totalFound} cột tồn kho
                </h3>
                <span style={{ fontSize: '12px', background: '#EFF6FF', color: '#1D4ED8', padding: '4px 8px', borderRadius: '99px', fontWeight: 500 }}>
                    {validColumns.length}/{totalFound} Đã ghép nối
                </span>
            </div>

            {/* Issues Section */}
            {issueColumns.length > 0 && (
                <div style={{ border: '1px solid #FECACA', background: '#FEF2F2', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #FECACA', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={20} color="#DC2626" />
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#7F1D1D' }}>
                            {systemWarehouses.length === 1
                                ? "Lỗi: File chứa nhiều kho hơn giới hạn của cửa hàng (Chặn nhập)"
                                : `Cần kiểm tra lại (${issueColumns.length})`
                            }
                        </span>
                    </div>

                    {/* Special BLOCKING UI for Single Store with Multiple File Locations */}
                    {systemWarehouses.length === 1 ? (
                        <div style={{ padding: '16px', color: '#B91C1C' }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                                Cửa hàng của bạn chỉ có 1 kho duy nhất (<strong>{systemWarehouses[0].name}</strong>).
                                Tuy nhiên, file nhập đang chứa thông tin tồn kho cho các kho khác (Ví dụ: <strong>{issueColumns[0].fileHeader}</strong>).
                            </p>
                            <div style={{ background: 'white', padding: '12px', borderRadius: '6px', border: '1px solid #FECACA', marginBottom: '12px' }}>
                                <p style={{ fontSize: '13px', margin: 0, fontWeight: 500 }}>Giải pháp:</p>
                                <ul style={{ fontSize: '13px', margin: '4px 0 0', paddingLeft: '20px' }}>
                                    <li>Chỉnh sửa file Excel, xóa các cột kho thừa.</li>
                                    <li>Hoặc liên hệ CSKH để nâng cấp gói dịch vụ đa chi nhánh.</li>
                                </ul>
                            </div>
                            <span style={{ fontSize: '12px', fontStyle: 'italic' }}>* Bạn không thể tiếp tục nhập file này.</span>
                        </div>
                    ) : (
                        // Standard Mapping UI for Multi-Store
                        <div>
                            {issueColumns.map((col, idx) => (
                                <div key={idx} className="mapping-row" style={{ backgroundColor: 'white' }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: '12px', color: '#B91C1C', fontWeight: 500, margin: '0 0 4px 0' }}>Cột trong File</p>
                                        <p style={{ fontSize: '14px', color: '#111827', fontWeight: 500, margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={col.fileHeader}>
                                            {col.fileHeader}
                                        </p>
                                    </div>

                                    <ArrowRight size={16} color="#9CA3AF" />

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 4px 0' }}>Ghép với kho hệ thống</p>
                                        <select
                                            className="mapping-select"
                                            style={{ width: '100%' }}
                                            value={mappingState[col.fileHeader] || ''}
                                            onChange={(e) => onMappingChange(col.fileHeader, parseInt(e.target.value))}
                                        >
                                            <option value="">-- Chọn kho --</option>
                                            {systemWarehouses.map(w => (
                                                <option key={w.id} value={w.id}>{w.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Valid Section (Collapsible) */}
            {validColumns.length > 0 && (
                <div style={{ border: '1px solid #BBF7D0', background: '#F0FDF4', borderRadius: '8px', overflow: 'hidden' }}>
                    <button
                        style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', background: 'none', cursor: 'pointer' }}
                        onClick={() => setShowValid(!showValid)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle2 size={20} color="#16A34A" />
                            <span style={{ fontSize: '14px', fontWeight: 500, color: '#14532D' }}>Ghép nối thành công ({validColumns.length})</span>
                        </div>
                        {showValid ? <ChevronDown size={16} color="#15803D" /> : <ChevronRight size={16} color="#15803D" />}
                    </button>

                    {showValid && (
                        <div style={{ borderTop: '1px solid #BBF7D0', background: 'white' }}>
                            {validColumns.map((col, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #F3F4F6' }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 2px 0' }}>Cột trong File</p>
                                        <span style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>{col.fileHeader}</span>
                                    </div>
                                    <ArrowRight size={16} color="#D1D5DB" style={{ margin: '0 8px' }} />
                                    <div style={{ flex: 1, textAlign: 'right' }}>
                                        <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 2px 0' }}>Kho hệ thống</p>
                                        <span style={{ fontSize: '14px', color: '#1D4ED8', fontWeight: 500, padding: '2px 8px', background: '#EFF6FF', borderRadius: '4px' }}>
                                            {col.matchedWarehouse.name}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MappingResolution;
