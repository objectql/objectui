/* eslint-disable @typescript-eslint/no-unused-vars */
// React import is not needed for JSX in new transform, but we might keep it if needed for compatibility or hooks.
// But the error says it's unused.
export const Button = ({ className, children, ...props }: any) => {
  return (
    <button 
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Header = ({ className, title, ...props }: any) => {
  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between ${className || ''}`} {...props}>
       <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
       <div>{props.children}</div>
    </header>
  );
}

export const Card = ({ className, title, children, ...props }: any) => {
  return (
    <div className={`bg-white rounded-lg shadow border border-gray-100 overflow-hidden ${className || ''}`} {...props}>
      {title && <div className="px-6 py-4 border-b border-gray-100 font-medium text-gray-700">{title}</div>}
      <div className="p-6">{children}</div>
    </div>
  );
}

// ...existing code...
export const Box = ({ className, children, ...props }: any) => {
  return (
    <div className={`p-4 border border-gray-200 rounded ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export const Container = ({ className, children, ...props }: any) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

export const Sidebar = ({ className, children, logo, ...props }: any) => {
  return (
    <div className={`w-64 bg-slate-900 text-white flex flex-col h-full ${className || ''}`} {...props}>
       {logo && (
         <div className="h-16 flex items-center px-6 font-bold text-xl border-b border-slate-800 tracking-wider">
           {logo}
         </div>
       )}
       <div className="flex-1 py-4 overflow-y-auto custom-scrollbar">
         {children}
       </div>
    </div>
  );
};

export const MenuItem = ({ className, label, icon, active, ...props }: any) => {
  return (
    <button 
      className={`w-full text-left px-6 py-3 flex items-center transition-colors ${
        active 
          ? 'bg-blue-600 text-white border-r-4 border-blue-300' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      } ${className || ''}`}
      {...props}
    >
      {icon && <span className="mr-3">{icon}</span>}
      <span className="font-medium">{label}</span>
    </button>
  );
};

export const StatCard = ({ title, value, trend, icon, className, ...props }: any) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${className || ''}`} {...props}>
      <div className="flex items-center justify-between mb-4">
         <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</div>
         {icon && <div className="text-blue-500 bg-blue-50 p-2 rounded-full">{icon}</div>}
      </div>
      <div className="flex items-baseline">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {trend && <div className={`ml-2 text-sm font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{trend}</div>}
      </div>
    </div>
  );
};
