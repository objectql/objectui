import React, { useState } from 'react';
import { ComponentRegistry } from '@object-ui/core';
import { useDesigner } from '../context/DesignerContext';
import { 
  Layout,
  Columns3,
  Grid as GridIcon,
  Box,
  Rows3,
  PanelTop,
  PanelBottom,
  PanelLeft,
  PanelRight,
  Square,
  CreditCard,
  AlignJustify,
  Minus,
  Image,
  Type,
  Search
} from 'lucide-react';
import { cn } from '@object-ui/components';
import { ScrollArea } from '@object-ui/components';
import { enableTouchDrag, isTouchDevice } from '../utils/touchDragPolyfill';

interface PageLayoutComponentPaletteProps {
  className?: string;
}

// Map layout component types to Lucide icons
const getIconForType = (type: string) => {
  switch (type) {
    case 'div': return Box;
    case 'container': return Layout;
    case 'section': return Square;
    case 'header': return PanelTop;
    case 'footer': return PanelBottom;
    case 'aside': return PanelLeft;
    case 'main': return PanelRight;
    case 'grid': return GridIcon;
    case 'stack': return AlignJustify;
    case 'columns': return Columns3;
    case 'rows': return Rows3;
    case 'card': return CreditCard;
    case 'separator': return Minus;
    case 'image': return Image;
    case 'text': return Type;
    default: return Layout;
  }
};

// Page layout specific component categories
const LAYOUT_CATEGORIES = {
  'Structural': [
    { type: 'header', label: 'Header', description: 'Page header section' },
    { type: 'main', label: 'Main', description: 'Main content area' },
    { type: 'footer', label: 'Footer', description: 'Page footer section' },
    { type: 'aside', label: 'Sidebar', description: 'Sidebar section' },
    { type: 'section', label: 'Section', description: 'Content section' },
  ],
  'Containers': [
    { type: 'div', label: 'Div', description: 'Generic container' },
    { type: 'container', label: 'Container', description: 'Max-width container' },
    { type: 'card', label: 'Card', description: 'Card container' },
  ],
  'Layout': [
    { type: 'grid', label: 'Grid', description: 'Grid layout' },
    { type: 'columns', label: 'Columns', description: 'Multi-column layout' },
    { type: 'rows', label: 'Rows', description: 'Row-based layout' },
    { type: 'stack', label: 'Stack', description: 'Vertical stack' },
  ],
  'Content': [
    { type: 'text', label: 'Text', description: 'Text content' },
    { type: 'image', label: 'Image', description: 'Image element' },
    { type: 'separator', label: 'Separator', description: 'Horizontal line' },
  ]
};

// Component item with touch support
interface ComponentItemProps {
  type: string;
  label: string;
  description: string;
  Icon: any;
  onDragStart: (e: React.DragEvent, type: string) => void;
  onDragEnd: () => void;
}

const ComponentItem: React.FC<ComponentItemProps> = React.memo(({ 
  type, 
  label,
  description,
  Icon, 
  onDragStart, 
  onDragEnd 
}) => {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const { setDraggingType } = useDesigner();

  // Setup touch drag support
  React.useEffect(() => {
    if (!itemRef.current || !isTouchDevice()) return;

    const cleanup = enableTouchDrag(itemRef.current, {
      dragData: { componentType: type },
      onDragStart: () => {
        setDraggingType(type);
      },
      onDragEnd: () => {
        setDraggingType(null);
      }
    });

    return cleanup;
  }, [type, setDraggingType]);

  return (
    <div
      ref={itemRef}
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      onDragEnd={onDragEnd}
      className={cn(
        "group flex items-center gap-3 p-3 rounded-lg border-2 border-transparent hover:border-blue-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 hover:shadow-md cursor-grab active:cursor-grabbing transition-all duration-200 bg-white",
        "hover:scale-102 active:scale-95 touch-none"
      )}
      aria-label={`${label} - ${description}`}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">{label}</div>
        <div className="text-xs text-gray-500 truncate">{description}</div>
      </div>
    </div>
  );
});

ComponentItem.displayName = 'ComponentItem';

/**
 * PageLayoutComponentPalette Component
 * A specialized component palette for page layout elements
 */
export const PageLayoutComponentPalette: React.FC<PageLayoutComponentPaletteProps> = ({ className }) => {
  const { setDraggingType } = useDesigner();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(LAYOUT_CATEGORIES))
  );

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify({ componentType: type }));
    setDraggingType(type);
  };

  const handleDragEnd = () => {
    setDraggingType(null);
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Filter components based on search
  const filteredCategories = Object.entries(LAYOUT_CATEGORIES).reduce((acc, [category, items]) => {
    const filtered = items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, typeof LAYOUT_CATEGORIES[keyof typeof LAYOUT_CATEGORIES]>);

  return (
    <div className={cn("flex flex-col h-full bg-white border-r border-gray-200", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Layout Components</h2>
        <p className="text-xs text-gray-600">Drag components to build pages</p>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Component List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {Object.keys(filteredCategories).length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No components found
            </div>
          ) : (
            Object.entries(filteredCategories).map(([category, items]) => (
              <div key={category} className="space-y-2">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900 transition-colors"
                >
                  <span>{category}</span>
                  <span className="text-gray-400">
                    {expandedCategories.has(category) ? '▼' : '▶'}
                  </span>
                </button>
                {expandedCategories.has(category) && (
                  <div className="space-y-2">
                    {items.map((item) => {
                      const Icon = getIconForType(item.type);
                      return (
                        <ComponentItem
                          key={item.type}
                          type={item.type}
                          label={item.label}
                          description={item.description}
                          Icon={Icon}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer Tip */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600 text-center">
          💡 Tip: Use responsive grid layouts for mobile-friendly pages
        </p>
      </div>
    </div>
  );
};
