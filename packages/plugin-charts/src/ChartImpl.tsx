import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface ChartImplProps {
  data?: Array<Record<string, any>>;
  dataKey?: string;
  xAxisKey?: string;
  height?: number;
  className?: string;
  color?: string;
}

/**
 * ChartImpl - The heavy implementation that imports Recharts
 * This component is lazy-loaded to avoid including Recharts in the initial bundle
 */
export default function ChartImpl({
  data = [],
  dataKey = 'value',
  xAxisKey = 'name',
  height = 400,
  className = '',
  // Default to Cyan-500 for the tech feel
  color = '#06b6d4',
}: ChartImplProps) {
  return (
    <div className={`p-4 rounded-xl border border-slate-800 bg-slate-950/40 backdrop-blur-sm shadow-xl ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={1} />
              <stop offset="90%" stopColor={color} stopOpacity={0.6} />
              <stop offset="100%" stopColor={color} stopOpacity={0.3} />
            </linearGradient>
            <filter id="glow" height="130%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
              <feOffset in="blur" dx="0" dy="0" result="offsetBlur" />
              <feFlood floodColor={color} floodOpacity="0.5" result="offsetColor" />
              <feComposite in="offsetColor" in2="offsetBlur" operator="in" result="offsetBlur" />
              <feMerge>
                <feMergeNode in="offsetBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey={xAxisKey} 
            tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }} 
            tickLine={false}
            axisLine={{ stroke: '#334155' }}
            dy={10}
          />
          <YAxis 
            tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }} 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            cursor={{ fill: '#1e293b', opacity: 0.4 }}
            contentStyle={{ 
              backgroundColor: '#020617', 
              borderColor: '#1e293b', 
              color: '#f8fafc',
              borderRadius: '8px',
              fontFamily: 'monospace',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.15)'
            }}
            itemStyle={{ color: '#22d3ee' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px', fontFamily: 'monospace' }} />
          <Bar 
            dataKey={dataKey} 
            fill="url(#barGradient)" 
            radius={[4, 4, 0, 0]}
            filter="url(#glow)"
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
