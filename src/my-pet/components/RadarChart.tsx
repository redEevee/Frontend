import React from 'react';

interface RadarChartProps {
    scores: {
        [key: string]: number | undefined;
    };
    labels: string[];
    children?: React.ReactNode;
}

const RadarChart: React.FC<RadarChartProps> = ({ scores, labels, children }) => {
    const size = 320; // Increased size for more padding
    const center = size / 2;
    const numAxes = labels.length;
    const angleSlice = (Math.PI * 2) / numAxes;
    const scoreKeys = Object.keys(scores);

    // Function to calculate the coordinates of a point on an axis
    const getPoint = (axisIndex: number, value: number) => {
        const angle = angleSlice * axisIndex - Math.PI / 2;
        const radiusFactor = 0.8; // Adjust factor to control padding
        const x = center + (center * radiusFactor * value / 100) * Math.cos(angle);
        const y = center + (center * radiusFactor * value / 100) * Math.sin(angle);
        return `${x},${y}`;
    };

    // Generate the points string for the data polygon
    const dataPoints = scoreKeys.map((key, i) => {
        const value = scores[key] || 0;
        return getPoint(i, value);
    }).join(' ');

    // Generate the grid lines and labels
    const grid = Array.from({ length: 3 }, (_, i) => {
        const radius = (center * 0.75 / 3) * (i + 1);
        const points = Array.from({ length: numAxes }, (_, j) => {
            const angle = angleSlice * j - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');
        return <polygon key={i} points={points} fill="none" stroke="#e5e7eb" strokeWidth="1" />;
    });

    const axes = labels.map((label, i) => {
        const endPoint = getPoint(i, 105); // Extend axis line slightly beyond max score
        const labelPoint = getPoint(i, 120); // Position label further out
        const [lx, ly] = labelPoint.split(',').map(Number);
        return (
            <g key={i}>
                <line x1={center} y1={center} x2={endPoint.split(',')[0]} y2={endPoint.split(',')[1]} stroke="#e5e7eb" strokeWidth="1" />
                <text x={lx} y={ly} fontSize="14" fontWeight="bold" fill="#4b5563" textAnchor="middle" dominantBaseline="middle">{label}</text>
            </g>
        );
    });

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Grid and Axes */}
                {grid}
                {axes}

                {/* Data Polygon */}
                <polygon points={dataPoints} fill="rgba(79, 70, 229, 0.4)" stroke="#4F46E5" strokeWidth="2" />

                {/* Data Points */}
                {scoreKeys.map((key, i) => {
                    const value = scores[key] || 0;
                    const [px, py] = getPoint(i, value).split(',').map(Number);
                    return <circle key={i} cx={px} cy={py} r="4" fill="#4F46E5" />;
                })}

                {/* Render children in the center */}
                <foreignObject x={center - 60} y={center - 60} width="120" height="120">
                    <div className="w-full h-full flex items-center justify-center">
                        {children}
                    </div>
                </foreignObject>
            </svg>
        </div>
    );
};

export default RadarChart;