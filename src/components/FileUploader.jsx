
import React, { useRef, useState } from 'react';
import { FileSpreadsheet, X, CloudUpload } from 'lucide-react';

const FileUploader = ({ onFileSelect, file, onClearFile }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const inputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    if (file) {
        return (
            <div className="file-preview">
                <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileSpreadsheet width={32} height={32} color="#6C798F" strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#182537', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '0 0 2px 0' }} title={file.name}>
                        {file.name}
                    </p>
                    <p style={{ fontSize: '12px', color: '#556987', margin: 0 }}>
                        {(file.size / 1024).toFixed(2)} KB
                    </p>
                </div>
                <button
                    onClick={onClearFile}
                    style={{ background: 'none', border: 'none', color: '#9FA8B7', cursor: 'pointer', padding: '4px' }}
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    return (
        <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`file-dropzone ${isDragOver ? 'active' : ''}`}
        >
            <input
                type="file"
                ref={inputRef}
                onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
                style={{ display: 'none' }}
            />
            <div style={{ marginBottom: '12px' }}>
                <CloudUpload width={40} height={40} color="#9FA8B7" strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: '14px', color: '#333333', textAlign: 'center', margin: '0 0 4px 0' }}>
                Kéo thả file vào đây hoặc <span style={{ color: '#0088FF', fontWeight: 500 }}>tải lên từ thiết bị</span>
            </p>
            <p style={{ fontSize: '12px', color: '#74839D', textAlign: 'center', margin: 0 }}>
                (Tối đa 3MB, định dạng .xlsx, .xls hoặc .csv)
            </p>
        </div>
    );
};

export default FileUploader;
