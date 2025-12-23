
import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';
import { SYSTEM_PRICE_POLICIES } from '../utils/importLogic';

const PricePolicyMapping = ({ analysis, mappingState, onMappingChange, systemPolicies = SYSTEM_PRICE_POLICIES }) => {
    const [showValid, setShowValid] = useState(false);

    // Safety check
    if (!analysis || !analysis.pricePolicyColumns) return null;

    const validColumns = analysis.pricePolicyColumns.filter(c => c.status === 'MATCHED' && !mappingState[c.fileHeader]);

    // An issue is defined as:
    // 1. UNKNOWN status (code mismatch)
    // 2. Or explicit user decision to re-map (handled via UI state, but initially just unknowns)
    const issueColumns = analysis.pricePolicyColumns.filter(c => c.status !== 'MATCHED' || mappingState[c.fileHeader]);

    // If there ARE NO system policies (empty store), everything is an issue
    const isNoPolicyStore = systemPolicies.length === 0;

    return (
        <div style={{ marginTop: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#4B5563' }}>3</span>
                Ghép nối Chính sách giá
            </h3>

            {(validColumns.length === 0 && issueColumns.length === 0) && (
                <p style={{ fontSize: '14px', color: '#6B7280', fontStyle: 'italic' }}>Không tìm thấy cột chính sách giá nào trong file.</p>
            )}

            {/* WARNING: Store has NO Price Policies */}
            {isNoPolicyStore && analysis.pricePolicyColumns.length > 0 && (
                <div style={{ border: '1px solid #FDBA74', background: '#FFF7ED', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <AlertCircle size={20} color="#EA580C" style={{ marginTop: '2px' }} />
                        <div>
                            <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#9A3412' }}>
                                Cảnh báo: Cửa hàng chưa thiết lập Chính sách giá
                            </p>
                            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#C2410C' }}>
                                File nhập chứa thông tin giá bán (Ví dụ: <strong>{analysis.pricePolicyColumns[0].fileHeader}</strong>), nhưng cửa hàng hiện tại chưa có Chính sách giá nào.
                            </p>
                            <p style={{ margin: 0, fontSize: '14px', color: '#C2410C' }}>
                                Bạn vẫn có thể tiếp tục nhập file, nhưng các cột giá này sẽ bị <strong>bỏ qua</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {!isNoPolicyStore && (
                <>
                    {/* Issues Section */}
                    {issueColumns.length > 0 && (
                        <div style={{ border: '1px solid #FECACA', background: '#FEF2F2', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                            <div style={{ padding: '12px 16px', borderBottom: '1px solid #FECACA', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={20} color="#DC2626" />
                                <span style={{ fontSize: '14px', fontWeight: 500, color: '#7F1D1D' }}>Cần kiểm tra lại ({issueColumns.length})</span>
                            </div>
                            <div>
                                {issueColumns.map((col, idx) => (
                                    <div key={idx} className="mapping-row" style={{ backgroundColor: 'white' }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: '12px', color: '#B91C1C', fontWeight: 500, margin: '0 0 4px 0' }}>Cột trong File</p>
                                            <p style={{ fontSize: '14px', color: '#111827', fontWeight: 500, margin: 0, title: col.fileHeader }}>
                                                {col.fileHeader}
                                            </p>
                                            {col.extractedCode && (
                                                <span style={{ fontSize: '11px', background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', color: '#6B7280' }}>
                                                    Mã: {col.extractedCode}
                                                </span>
                                            )}
                                        </div>

                                        <ArrowRight size={16} color="#9CA3AF" />

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 4px 0' }}>Ghép với Bảng giá hệ thống</p>
                                            <select
                                                className="mapping-select"
                                                style={{ width: '100%' }}
                                                value={mappingState[col.fileHeader] || ''}
                                                onChange={(e) => onMappingChange(col.fileHeader, parseInt(e.target.value))}
                                            >
                                                <option value="">-- Chọn bảng giá --</option>
                                                {systemPolicies.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Valid / Auto-Matched Section */}
                    {validColumns.length > 0 && (
                        <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                            <div
                                style={{ padding: '12px 16px', background: '#F9FAFB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                onClick={() => setShowValid(!showValid)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle2 size={20} color="#10B981" />
                                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#065F46' }}>
                                        Ghép nối thành công ({validColumns.length})
                                    </span>
                                </div>
                                {showValid ? <ChevronDown size={18} color="#6B7280" /> : <ChevronRight size={18} color="#6B7280" />}
                            </div>

                            {showValid && (
                                <div>
                                    {validColumns.map((col, idx) => (
                                        <div key={idx} className="mapping-row" style={{ borderTop: '1px solid #E5E7EB' }}>
                                            <div style={{ flex: 1 }}>
                                                <span style={{ fontSize: '14px', color: '#374151' }}>{col.fileHeader}</span>
                                            </div>
                                            <ArrowRight size={16} color="#9CA3AF" />
                                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '14px', fontWeight: 500 }}>{col.matchedPolicy.name}</span>
                                                <span style={{ fontSize: '12px', color: '#6B7280', background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px' }}>
                                                    {col.matchedPolicy.code}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PricePolicyMapping;
