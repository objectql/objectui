import React from 'react';
import type { SchemaNode } from '@object-ui/protocol';
import { Button, Box, Header, Card, Container, Sidebar, MenuItem, StatCard } from '@object-ui/ui';

const ComponentRegistry: Record<string, React.FC<any>> = {
  'button': (props: any) => <Button {...props}>{props.schema.label}</Button>,
  'div': (props: any) => <Container {...props}>{props.children}</Container>,
  'box': (props: any) => <Box {...props}>{props.children}</Box>,
  'header': (props: any) => <Header title={props.schema.title} {...props}>{props.children}</Header>,
  'card': (props: any) => <Card title={props.schema.title} {...props}>{props.children}</Card>,
  'sidebar': (props: any) => <Sidebar logo={props.schema.logo} {...props}>{props.children}</Sidebar>,
  'menu-item': (props: any) => <MenuItem label={props.schema.label} icon={props.schema.icon} active={props.schema.active} {...props} />,
  'stat-card': (props: any) => <StatCard title={props.schema.title} value={props.schema.value} trend={props.schema.trend} icon={props.schema.iconStr} {...props} />,
  'page': (props: any) => <div className="min-h-screen bg-gray-50 flex">{props.children}</div>,
  'tpl': (props: any) => <span>{props.schema.tpl}</span>
};

export const SchemaRenderer: React.FC<{ schema: SchemaNode }> = ({ schema }) => {
  const Component = ComponentRegistry[schema.type];

  if (!Component) {
    return <div className="text-red-500">Unknown component type: {schema.type}</div>;
  }

  const { body, ...rest } = schema;

  return (
    <Component schema={schema} {...rest}>
      {body ? (
        Array.isArray(body) ? (
          body.map((child, idx) => <SchemaRenderer key={idx} schema={child} />)
        ) : (
          <SchemaRenderer schema={body} />
        )
      ) : null}
    </Component>
  );
};
