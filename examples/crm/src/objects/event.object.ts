import { ObjectSchema, Field } from '@objectstack/spec/data';

export const EventObject = ObjectSchema.create({
  name: 'event',
  label: 'Event',
  icon: 'calendar',
  description: 'Meetings, calls, and calendar events with participant tracking',
  fields: {
    subject: Field.text({ label: 'Subject', required: true, searchable: true, placeholder: 'Enter event subject' }),
    start: Field.datetime({ label: 'Start', required: true }),
    end: Field.datetime({ label: 'End', required: true }),
    is_all_day: Field.boolean({ label: 'All Day Event', defaultValue: false }),
    location: Field.text({ label: 'Location', placeholder: 'e.g. Conference Room A, Zoom link' }),
    description: Field.richtext({ label: 'Description' }),
    participants: Field.lookup('contact', { label: 'Participants', multiple: true }),
    organizer: Field.lookup('user', { label: 'Organizer' }),
    type: Field.select([
      { value: 'Meeting', label: 'Meeting', color: 'blue' },
      { value: 'Call', label: 'Call', color: 'green' },
      { value: 'Email', label: 'Email', color: 'purple' },
      { value: 'Other', label: 'Other', color: 'gray' },
    ], { label: 'Type' }),
    status: Field.select([
      { value: 'scheduled', label: 'Scheduled', color: 'blue' },
      { value: 'completed', label: 'Completed', color: 'green' },
      { value: 'cancelled', label: 'Cancelled', color: 'red' },
    ], { label: 'Status', defaultValue: 'scheduled' }),
    is_private: Field.boolean({ label: 'Private', defaultValue: false, helpText: 'Private events are only visible to the organizer' }),
    reminder: Field.select(['None', '5 minutes', '15 minutes', '30 minutes', '1 hour', '1 day'], { label: 'Reminder', defaultValue: '15 minutes' })
  }
});
