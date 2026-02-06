import { useLocation, useParams, Link } from 'react-router-dom';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator,
  SidebarTrigger,
  Input,
  Button,
  Separator,
} from '@object-ui/components';
import { Search, Bell, HelpCircle } from 'lucide-react';

import { ModeToggle } from './mode-toggle';

export function AppHeader({ appName, objects }: { appName: string, objects: any[] }) {
    const location = useLocation();
    const params = useParams();
    
    // Parse the current route to build breadcrumbs
    const pathParts = location.pathname.split('/').filter(Boolean);
    // pathParts: ['apps', 'crm_app', 'contact', 'view', 'all'] or ['apps', 'crm_app', 'dashboard', 'crm_dashboard']
    
    const appNameFromRoute = params.appName || pathParts[1];
    const routeType = pathParts[2]; // 'contact', 'dashboard', 'page', 'report'
    
    // Determine breadcrumb items
    const breadcrumbItems: { label: string; href?: string }[] = [
      { label: appName, href: `/apps/${appNameFromRoute}` }
    ];
    
    if (routeType === 'dashboard') {
      breadcrumbItems.push({ label: '仪表盘' });
      if (pathParts[3]) {
        breadcrumbItems.push({ label: pathParts[3] });
      }
    } else if (routeType === 'page') {
      breadcrumbItems.push({ label: '页面' });
      if (pathParts[3]) {
        breadcrumbItems.push({ label: pathParts[3] });
      }
    } else if (routeType === 'report') {
      breadcrumbItems.push({ label: '报表' });
      if (pathParts[3]) {
        breadcrumbItems.push({ label: pathParts[3] });
      }
    } else if (routeType) {
      // Object route
      const currentObject = objects.find((o: any) => o.name === routeType);
      if (currentObject) {
        breadcrumbItems.push({ 
          label: currentObject.label || routeType,
          href: `/apps/${appNameFromRoute}/${routeType}`
        });
        
        // Check if viewing a specific record
        if (pathParts[3] === 'record' && pathParts[4]) {
          breadcrumbItems.push({ label: `记录 ${pathParts[4].slice(0, 8)}...` });
        } else if (pathParts[3] === 'view' && pathParts[4]) {
          breadcrumbItems.push({ label: pathParts[4] });
        }
      }
    }

    return (
        <div className="flex items-center justify-between w-full h-full px-2 md:px-4 gap-2">
             <div className="flex items-center gap-2">
                {/* Mobile sidebar trigger */}
                <SidebarTrigger className="md:hidden" />
                <Separator orientation="vertical" className="h-4 md:hidden" />
                
                <Breadcrumb className="hidden sm:flex">
                  <BreadcrumbList>
                    {breadcrumbItems.map((item, index) => (
                      <BreadcrumbItem key={index}>
                        {index > 0 && <BreadcrumbSeparator />}
                        {index === breadcrumbItems.length - 1 || !item.href ? (
                          <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={item.href}>{item.label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
                
                {/* Mobile: Just show current page */}
                <span className="text-sm font-medium sm:hidden truncate max-w-[150px]">
                  {breadcrumbItems[breadcrumbItems.length - 1]?.label || appName}
                </span>
             </div>
             
             <div className="flex items-center gap-1 md:gap-2">
                {/* Search - Desktop */}
                <div className="hidden lg:flex relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="搜索..." 
                    className="w-[200px] xl:w-[280px] pl-8 h-8 bg-muted/50"
                  />
                </div>
                
                {/* Search button - Mobile/Tablet */}
                <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8">
                  <Search className="h-4 w-4" />
                </Button>
                
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="h-8 w-8 hidden sm:flex">
                  <Bell className="h-4 w-4" />
                </Button>
                
                {/* Help */}
                <Button variant="ghost" size="icon" className="h-8 w-8 hidden md:flex">
                  <HelpCircle className="h-4 w-4" />
                </Button>
                
                {/* Theme toggle */}
                <ModeToggle />
             </div>
        </div>
    );
}
