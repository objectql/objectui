import React from 'react';
import type { SchemaNode } from '@object-ui/protocol';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Label,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  Separator,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@object-ui/ui';

// Helper to render children safely
const renderChildren = (children: SchemaNode | SchemaNode[] | undefined) => {
  if (!children) return null;
  if (Array.isArray(children)) {
    return children.map((child, idx) => <SchemaRenderer key={idx} schema={child} />);
  }
  return <SchemaRenderer schema={children} />;
};

const ComponentRegistry: Record<string, React.FC<any>> = {
  // Layout & Text
  'div': ({ schema, className, ...props }: any) => (
    <div className={className} {...props}>{renderChildren(schema.body)}</div>
  ),
  'text': ({ schema }: any) => <>{schema.content}</>,
  'span': ({ schema, className, ...props }: any) => (
    <span className={className} {...props}>{renderChildren(schema.body)}</span> 
  ),
  'separator': ({ className, ...props }: any) => <Separator className={className} {...props} />,

  // Button
  'button': ({ schema, ...props }: any) => (
    <Button variant={schema.variant} size={schema.size} className={schema.className} {...props}>
      {schema.label || renderChildren(schema.body)}
    </Button>
  ),

  // Card
  'card': ({ schema, className, ...props }: any) => (
    <Card className={className} {...props}>
      {(schema.title || schema.description) && (
        <CardHeader>
          {schema.title && <CardTitle>{schema.title}</CardTitle>}
          {schema.description && <CardDescription>{schema.description}</CardDescription>}
        </CardHeader>
      )}
      {schema.body && <CardContent>{renderChildren(schema.body)}</CardContent>}
      {schema.footer && <CardFooter>{renderChildren(schema.footer)}</CardFooter>}
    </Card>
  ),

  // Input & Form
  'input': ({ schema, className, ...props }: any) => (
    <div className={`grid w-full max-w-sm items-center gap-1.5 ${schema.wrapperClass || ''}`}>
      {schema.label && <Label htmlFor={schema.id}>{schema.label}</Label>}
      <Input type={schema.inputType || 'text'} id={schema.id} placeholder={schema.placeholder} className={className} {...props} />
    </div>
  ),

  // Tabs
  'tabs': ({ schema, className, ...props }: any) => (
    <Tabs defaultValue={schema.defaultValue} className={className} {...props}>
      <TabsList>
        {schema.items?.map((item: any) => (
          <TabsTrigger key={item.value} value={item.value}>{item.label}</TabsTrigger>
        ))}
      </TabsList>
      {schema.items?.map((item: any) => (
        <TabsContent key={item.value} value={item.value}>
          {renderChildren(item.body)}
        </TabsContent>
      ))}
    </Tabs>
  ),

  // Sidebar System
  'sidebar-provider': ({ schema, ...props }: any) => (
    <SidebarProvider {...props}>{renderChildren(schema.body)}</SidebarProvider>
  ),
  'sidebar': ({ schema, ...props }: any) => (
    <Sidebar {...props}>{renderChildren(schema.body)}</Sidebar>
  ),
  'sidebar-header': ({ schema, ...props }: any) => (
    <SidebarHeader {...props}>{renderChildren(schema.body)}</SidebarHeader>
  ),
  'sidebar-content': ({ schema, ...props }: any) => (
    <SidebarContent {...props}>{renderChildren(schema.body)}</SidebarContent>
  ),
  'sidebar-group': ({ schema, ...props }: any) => (
    <SidebarGroup {...props}>
      {schema.label && <SidebarGroupLabel>{schema.label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        {renderChildren(schema.body)}
      </SidebarGroupContent>
    </SidebarGroup>
  ),
  'sidebar-menu': ({ schema, ...props }: any) => (
    <SidebarMenu {...props}>{renderChildren(schema.body)}</SidebarMenu>
  ),
  'sidebar-menu-item': ({ schema, ...props }: any) => (
    <SidebarMenuItem {...props}>{renderChildren(schema.body)}</SidebarMenuItem>
  ),
  'sidebar-menu-button': ({ schema, ...props }: any) => (
    <SidebarMenuButton isActive={schema.active} {...props}>
        {renderChildren(schema.body)}
    </SidebarMenuButton>
  ),
  'sidebar-footer': ({ schema, ...props }: any) => (
    <SidebarFooter {...props}>{renderChildren(schema.body)}</SidebarFooter>
  ),
  'sidebar-inset': ({ schema, ...props }: any) => (
    <SidebarInset {...props}>{renderChildren(schema.body)}</SidebarInset>
  ),
  'sidebar-trigger': ({ className, ...props }: any) => (
    <SidebarTrigger className={className} {...props} />
  ),

  // Custom composed components for demo convenience
  'header-bar': ({ schema }: any) => (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {schema.crumbs?.map((crumb: any, idx: number) => (
            <React.Fragment key={idx}>
              <BreadcrumbItem>
                {idx === schema.crumbs.length - 1 ? (
                   <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                   <BreadcrumbLink href={crumb.href || '#'}>{crumb.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {idx < schema.crumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
};

export const SchemaRenderer: React.FC<{ schema: SchemaNode }> = ({ schema }) => {
  if (!schema) return null;
  // If schema is just a string, render it as text
  if (typeof schema === 'string') return <>{schema}</>;
  
  const Component = ComponentRegistry[schema.type];

  if (!Component) {
    return (
      <div className="p-4 border border-red-500 rounded text-red-500 bg-red-50 my-2">
        Unknown component type: <strong>{schema.type}</strong>
        <pre className="text-xs mt-2 overflow-auto">{JSON.stringify(schema, null, 2)}</pre>
      </div>
    );
  }

  return <Component schema={schema} {...(schema.props || {})} className={schema.className} />;
};
