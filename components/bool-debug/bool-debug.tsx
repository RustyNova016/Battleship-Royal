import React from 'react';

export interface BoolDebugProps {
    className?: string;
    text: string;
    value: boolean;
}

export const BoolDebug: React.FC<BoolDebugProps> = ({ className = '', text, value }) => (
    <div className={className} style={{
        color: value ? "#00aa00" : "#aa0000"
    }}>{text}: {value ? "✔" : "❌"}</div>
);