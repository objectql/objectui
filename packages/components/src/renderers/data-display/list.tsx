import { ComponentRegistry } from '@object-ui/core';
import type { ListSchema } from '@object-ui/types';
import { renderChildren } from '../../lib/utils';
import { cn } from '../../lib/utils';
import { ChevronRight, Hexagon, Terminal } from 'lucide-react';

ComponentRegistry.register('list', 
  ({ schema, className, ...props }: { schema: ListSchema; className?: string; [key: string]: any }) => {
    // We use 'ul' for both to control semantics manually with visuals
    const ListTag = 'ul';
    
    return (
      <div className={cn("relative p-4 rounded-lg bg-slate-950/30 border border-slate-800/50 backdrop-blur-sm", schema.wrapperClass)}>
        {/* Decorative corner accents for container */}
        <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-cyan-500/50 rounded-tl-sm" />
        <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-cyan-500/50 rounded-tr-sm" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-cyan-500/50 rounded-bl-sm" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-cyan-500/50 rounded-br-sm" />

        {schema.title && (
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-cyan-900/30">
             <Terminal className="w-4 h-4 text-cyan-500" />
             <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
                {schema.title}
             </h3>
          </div>
        )}
        
        <ListTag 
          className={cn(
            "space-y-1",
            className
          )}
          {...props}
        >
          {schema.items?.map((item: any, index: number) => (
            <li 
                key={index} 
                className={cn(
                    "group flex items-start gap-3 p-2 rounded-sm transition-all duration-300",
                    "hover:bg-cyan-950/20 hover:pl-3",
                    typeof item === 'object' && item.className
                )}
            >
              {/* Marker Area */}
              <div className="flex-shrink-0 mt-0.5">
                {schema.ordered ? (
                    <span className="flex items-center justify-center w-5 h-5 text-[10px] font-mono font-bold text-slate-950 bg-cyan-600 rounded-sm shadow-[0_0_8px_cyan] group-hover:bg-cyan-400 group-hover:scale-110 transition-all">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                ) : (
                    <div className="relative flex items-center justify-center w-5 h-5">
                        <Hexagon className="w-3 h-3 text-cyan-600 group-hover:text-cyan-400 group-hover:rotate-90 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-cyan-500/20 blur-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                )}
              </div>

              {/* Content Area */}
              <div className="flex-1 text-sm text-slate-400 group-hover:text-cyan-100 font-medium font-sans leading-tight transition-colors">
                {typeof item === 'string' ? item : item.content || renderChildren(item.body)}
              </div>

              {/* Hover Indicator */}
              <ChevronRight className="w-4 h-4 text-cyan-500/0 -translate-x-2 group-hover:text-cyan-500 group-hover:translate-x-0 transition-all duration-300 opacity-0 group-hover:opacity-100" />
            </li>
          ))}
        </ListTag>
      </div>
    );
  },
  {
    label: 'List',
    inputs: [
      { name: 'title', type: 'string', label: 'Title' },
      { name: 'ordered', type: 'boolean', label: 'Ordered List (numbered)', defaultValue: false },
      { 
        name: 'items', 
        type: 'array', 
        label: 'List Items',
        description: 'Array of strings or objects with content/body'
      },
      { name: 'className', type: 'string', label: 'CSS Class' }
    ],
    defaultProps: {
      ordered: false,
      items: [
        'First item',
        'Second item',
        'Third item'
      ],
      className: 'text-sm'
    }
  }
);
