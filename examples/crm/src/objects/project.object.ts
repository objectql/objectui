import { ObjectSchema, Field } from '@objectstack/spec/data';

export const ProjectObject = ObjectSchema.create({
  name: 'project_task',
  label: 'Project Task',
  icon: 'kanban-square',
  description: 'Project tasks with scheduling, dependencies, and progress tracking',
  fields: {
    name: Field.text({ label: 'Task Name', required: true, searchable: true, placeholder: 'Enter task name' }),
    start_date: Field.date({ label: 'Start Date', required: true }),
    end_date: Field.date({ label: 'End Date', required: true }),
    progress: Field.percent({ label: 'Progress', helpText: '0–100% completion' }),
    estimated_hours: Field.number({ label: 'Estimated Hours', scale: 1, helpText: 'Planned effort in hours' }),
    actual_hours: Field.number({ label: 'Actual Hours', scale: 1, helpText: 'Hours logged so far' }),
    status: Field.select([
      { value: 'Planned', label: 'Planned', color: 'gray' },
      { value: 'In Progress', label: 'In Progress', color: 'blue' },
      { value: 'Completed', label: 'Completed', color: 'green' },
      { value: 'On Hold', label: 'On Hold', color: 'yellow' },
    ], { label: 'Status' }),
    priority: Field.select([
      { value: 'Critical', label: 'Critical', color: 'red' },
      { value: 'High', label: 'High', color: 'orange' },
      { value: 'Medium', label: 'Medium', color: 'yellow' },
      { value: 'Low', label: 'Low', color: 'green' },
    ], { label: 'Priority' }),
    manager: Field.lookup('user', { label: 'Manager' }),
    assignee: Field.lookup('user', { label: 'Assignee', helpText: 'Person doing the work' }),
    description: Field.richtext({ label: 'Description' }),
    color: Field.color({ label: 'Color' }),
    dependencies: Field.text({ label: 'Dependencies', helpText: 'Comma-separated task IDs' }),
  }
});
