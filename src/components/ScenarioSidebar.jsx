
import React, { useState } from 'react';
import { Play, RotateCcw, Monitor, CheckCircle2, AlertOctagon, AlertTriangle, Info, X } from 'lucide-react';
import { SCENARIOS } from '../utils/mockScenarios';

const TYPE_CONFIG = {
    success: { color: '#10B981', bg: '#ECFDF5', icon: CheckCircle2 },
    error: { color: '#EF4444', bg: '#FEF2F2', icon: AlertOctagon },
    warning: { color: '#F59E0B', bg: '#FFFBEB', icon: AlertTriangle },
    info: { color: '#3B82F6', bg: '#EFF6FF', icon: Info },
    neutral: { color: '#6B7280', bg: '#F3F4F6', icon: RotateCcw }
};

const ScenarioSidebar = ({ onSelectScenario }) => {
    const [activeScenario, setActiveScenario] = useState(null);
    const [isOpen, setIsOpen] = useState(true);

    const handleSelect = (key) => {
        setActiveScenario(key);
        onSelectScenario(SCENARIOS[key]);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                title="Mở Dev Tools"
                style={{
                    position: 'fixed',
                    right: 0,
                    top: '20%',
                    background: '#1F2937',
                    color: 'white',
                    padding: '12px 10px',
                    borderTopLeftRadius: '8px',
                    borderBottomLeftRadius: '8px',
                    zIndex: 9999,
                    cursor: 'pointer',
                    boxShadow: '-2px 2px 8px rgba(0,0,0,0.2)',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                }}
            >
                <Monitor size={20} />
                <span style={{ fontSize: '10px', fontWeight: 600, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>DEV</span>
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            right: 0,
            top: 0,
            bottom: 0,
            width: '320px',
            background: '#ffffff',
            borderLeft: '1px solid #E5E7EB',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Header */}
            <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #E5E7EB',
                background: '#F9FAFB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ background: '#E0F2FE', padding: '6px', borderRadius: '6px' }}>
                        <Monitor size={18} color="#0284C7" />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#111827' }}>Dev Scenarios</h3>
                        <p style={{ margin: 0, fontSize: '11px', color: '#6B7280' }}>Mô phỏng các trường hợp nhập file</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '4px' }}
                >
                    <X size={18} />
                </button>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }} className="custom-scrollbar">
                {Object.entries(SCENARIOS).map(([key, scenario]) => {
                    const type = TYPE_CONFIG[scenario.type] || TYPE_CONFIG.neutral;
                    const Icon = type.icon;
                    const isActive = activeScenario === key;

                    if (key === 'EMPTY_STATE') return null; // Render Reset separately

                    return (
                        <button
                            key={key}
                            onClick={() => handleSelect(key)}
                            style={{
                                textAlign: 'left',
                                background: isActive ? '#F0F9FF' : 'white',
                                border: isActive ? '1px solid #0EA5E9' : '1px solid #E5E7EB',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                position: 'relative',
                                padding: '0',
                                overflow: 'hidden',
                                boxShadow: isActive ? '0 2px 4px rgba(14, 165, 233, 0.1)' : '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'stretch' }}>
                                <div style={{ width: '4px', backgroundColor: type.color }}></div>
                                <div style={{ padding: '12px', flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <Icon size={16} color={type.color} />
                                        <span style={{ fontWeight: 600, fontSize: '13px', color: '#1F2937' }}>{scenario.name}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: '1.4' }}>
                                        {scenario.description}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Footer / Reset */}
            <div style={{ padding: '16px', borderTop: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                <button
                    onClick={() => handleSelect('EMPTY_STATE')}
                    style={{
                        width: '100%',
                        padding: '10px',
                        background: 'white',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        color: '#374151',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#F3F4F6'}
                    onMouseOut={(e) => e.target.style.background = 'white'}
                >
                    <RotateCcw size={16} /> Đặt lại trạng thái (Reset)
                </button>
            </div>
        </div>
    );
};

export default ScenarioSidebar;
