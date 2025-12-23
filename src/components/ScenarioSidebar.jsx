
import React, { useState } from 'react';
import { Play, RotateCcw, Monitor } from 'lucide-react';
import { SCENARIOS } from '../utils/mockScenarios';

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
                style={{
                    position: 'fixed',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#1F2937',
                    color: 'white',
                    padding: '12px 8px',
                    borderTopLeftRadius: '8px',
                    borderBottomLeftRadius: '8px',
                    zIndex: 9999,
                    cursor: 'pointer',
                    boxShadow: '-2px 0 8px rgba(0,0,0,0.2)'
                }}
            >
                <Monitor size={20} />
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            right: 0,
            top: 0,
            bottom: 0,
            width: '280px',
            background: '#ffffff',
            borderLeft: '1px solid #E5E7EB',
            boxShadow: '-4px 0 16px rgba(0,0,0,0.1)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Monitor size={18} color="#0088FF" />
                    Dev Scenarios
                </h3>
                <button
                    onClick={() => setIsOpen(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}
                >
                    Min
                </button>
            </div>

            <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '-10px', marginBottom: '16px' }}>
                Click a scenario to instantly inject mock data into the modal.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.entries(SCENARIOS).map(([key, scenario]) => (
                    <button
                        key={key}
                        onClick={() => handleSelect(key)}
                        style={{
                            padding: '12px',
                            textAlign: 'left',
                            background: activeScenario === key ? '#EFF6FF' : '#F9FAFB',
                            border: activeScenario === key ? '1px solid #3B82F6' : '1px solid #E5E7EB',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            position: 'relative'
                        }}
                    >
                        <div style={{ fontWeight: 600, fontSize: '13px', color: '#111827', marginBottom: '2px' }}>
                            {scenario.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: '1.4' }}>
                            {scenario.description}
                        </div>
                        {activeScenario === key && (
                            <div style={{ position: 'absolute', right: '8px', top: '12px' }}>
                                <Play size={12} color="#3B82F6" fill="#3B82F6" />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            <div style={{ marginTop: 'auto', borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
                <button
                    onClick={() => handleSelect('EMPTY_STATE')}
                    style={{
                        width: '100%',
                        padding: '8px',
                        background: 'white',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        color: '#374151',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <RotateCcw size={14} /> Reset Application
                </button>
            </div>
        </div>
    );
};

export default ScenarioSidebar;
