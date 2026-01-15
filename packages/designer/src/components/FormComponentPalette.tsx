import React, { useState } from 'react';
import { ComponentRegistry } from '@object-ui/core';
import { useDesigner } from '../context/DesignerContext';
import { 
  Type, 
  CheckSquare, 
  ToggleLeft,
  List,
  FileText,
  Calendar,
  Mail,
  Phone,
  Lock,
  Hash,
  DollarSign,
  Link2,
  MousePointer2,
  Search,
  Tag
} from 'lucide-react';
import { cn } from '@object-ui/components';
import { ScrollArea } from '@object-ui/components';
import { enableTouchDrag, isTouchDevice } from '../utils/touchDragPolyfill';

interface FormComponentPaletteProps {
  className?: string;
}

// Map form component types to Lucide icons
const getIconForType = (type: string) => {
  switch (type) {
    case 'input': return Type;
    case 'textarea': return FileText;
    case 'checkbox': return CheckSquare;
    case 'switch': return ToggleLeft;
    case 'select': return List;
    case 'button': return MousePointer2;
    case 'label': return Tag;
    case 'date-picker': return Calendar;
    case 'email-input': return Mail;
    case 'phone-input': return Phone;
    case 'password-input': return Lock;
    case 'number-input': return Hash;
    case 'url-input': return Link2;
    case 'search-input': return Search;
    case 'currency-input': return DollarSign;
    default: return Type;
  }
};

// Form-specific component categories
const FORM_CATEGORIES = {
  'Text Fields': [
    { type: 'input', label: 'Text Input', description: 'Single line text input' },
    { type: 'textarea', label: 'Text Area', description: 'Multi-line text input' },
    { type: 'email-input', label: 'Email', description: 'Email address input' },
    { type: 'password-input', label: 'Password', description: 'Password input field' },
    { type: 'url-input', label: 'URL', description: 'URL input field' },
    { type: 'search-input', label: 'Search', description: 'Search input field' },
  ],
  'Number Fields': [
    { type: 'number-input', label: 'Number', description: 'Numeric input' },
    { type: 'currency-input', label: 'Currency', description: 'Money/currency input' },
  ],
  'Selection': [
    { type: 'checkbox', label: 'Checkbox', description: 'Single checkbox' },
    { type: 'switch', label: 'Switch', description: 'Toggle switch' },
    { type: 'select', label: 'Select', description: 'Dropdown selection' },
  ],
  'Other': [
    { type: 'date-picker', label: 'Date Picker', description: 'Date selection' },
    { type: 'phone-input', label: 'Phone', description: 'Phone number input' },
    { type: 'label', label: 'Label', description: 'Form field label' },
    { type: 'button', label: 'Button', description: 'Action button' },
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
        "group flex items-center gap-3 p-3 rounded-lg border-2 border-transparent hover:border-indigo-200 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 hover:shadow-md cursor-grab active:cursor-grabbing transition-all duration-200 bg-white",
        "hover:scale-102 active:scale-95 touch-none"
      )}
      aria-label={`${label} - ${description}`}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-md bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
        <Icon className="w-4 h-4 text-indigo-600" />
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
 * FormComponentPalette Component
 * A specialized component palette for form fields and controls
 */
export const FormComponentPalette: React.FC<FormComponentPaletteProps> = ({ className }) => {
  const { setDraggingType } = useDesigner();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(FORM_CATEGORIES))
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
  const filteredCategories = Object.entries(FORM_CATEGORIES).reduce((acc, [category, items]) => {
    const filtered = items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, typeof FORM_CATEGORIES[keyof typeof FORM_CATEGORIES]>);

  return (
    <div className={cn("flex flex-col h-full bg-white border-r border-gray-200", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Form Components</h2>
        <p className="text-xs text-gray-600">Drag components to canvas</p>
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
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
          💡 Tip: Configure field validation in the property panel
        </p>
      </div>
    </div>
  );
};
