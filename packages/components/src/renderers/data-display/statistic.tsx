import { ComponentRegistry } from '@object-ui/core';
import type { StatisticSchema } from '@object-ui/types';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatisticRenderer = ({ schema }: { schema: StatisticSchema }) => {
  return (
    <div className={cn(
        "group relative flex flex-col p-5 rounded-xl transition-all duration-300 overflow-hidden",
        "bg-slate-950/40 border border-slate-800/60 backdrop-blur-sm",
        "hover:bg-slate-900/60 hover:border-cyan-500/50 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]", 
        schema.className
    )}>
      {/* Decorative scanner line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-cyan-500/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none" />

      {/* Label */}
      {schema.label && (
        <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-3 bg-cyan-500 rounded-full shadow-[0_0_8px_cyan]" />
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-cyan-600/80 group-hover:text-cyan-400 transition-colors">
            {schema.label}
            </p>
        </div>
      )}

      {/* Value Area */}
      <div className="flex items-baseline gap-3 my-1 relative z-10">
        <h3 className={cn(
            "text-4xl font-black tracking-tight text-white transition-all duration-300",
            "drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]",
            "group-hover:scale-110 group-hover:text-cyan-100 group-hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.6)] group-hover:-translate-y-1"
        )}>
          {schema.value}
        </h3>
        
        {/* Trend Indicator */}
        {schema.trend && (
            <div className={cn(
                "flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md transition-all",
                schema.trend === 'up' && "text-emerald-400 border-emerald-500/30 bg-emerald-950/30 shadow-[0_0_10px_-4px_rgba(52,211,153,0.5)]",
                schema.trend === 'down' && "text-rose-400 border-rose-500/30 bg-rose-950/30 shadow-[0_0_10px_-4px_rgba(251,113,133,0.5)]",
                schema.trend === 'neutral' && "text-amber-400 border-amber-500/30 bg-amber-950/30 shadow-[0_0_10px_-4px_rgba(251,191,36,0.5)]",
                "group-hover:scale-105"
            )}>
                 {schema.trend === 'up' && <TrendingUp className="mr-1 h-3 w-3" />}
                 {schema.trend === 'down' && <TrendingDown className="mr-1 h-3 w-3" />}
                 {schema.trend === 'neutral' && <Minus className="mr-1 h-3 w-3" />}
                 {schema.description && <span className="max-w-[100px] truncate">{schema.description}</span>}
            </div>
        )}
      </div>

      {/* Footer / Description Text if needed below (optional, mostly handled by trend pill now, but keeping separate if text is long) */}
      {schema.description && !schema.trend && (
        <p className="text-xs text-slate-500 font-mono mt-1 group-hover:text-slate-400 transition-colors">
          {schema.description}
        </p>
      )}
      
      {/* Decorative accent corners */}
      <div className="absolute right-0 bottom-0 w-8 h-8 opacity-20 group-hover:opacity-100 transition-opacity">
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-cyan-500" stroke="currentColor" strokeWidth="1">
            <path d="M22 22L12 22L22 12Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M22 17L22 22L17 22" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

ComponentRegistry.register('statistic', StatisticRenderer, {
  label: 'Statistic',
  category: 'data-display',
  icon: 'Activity',
  inputs: [
    { name: 'label', type: 'string', label: 'Label' },
    { name: 'value', type: 'string', label: 'Value' },
    { name: 'description', type: 'string', label: 'Description' },
    { 
      name: 'trend', 
      type: 'enum', 
      enum: [
        { label: 'Up', value: 'up' },
        { label: 'Down', value: 'down' },
        { label: 'Neutral', value: 'neutral' }
      ], 
      label: 'Trend' 
    }
  ],
  defaultProps: {
    label: 'Total Revenue',
    value: '$45,231.89',
    trend: 'up',
    description: '+20.1% from last month'
  }
});
