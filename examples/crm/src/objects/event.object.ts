import { ObjectSchema, Field } from '@objectstack/spec/data';

export const EventObject = ObjectSchema.create({
  name: 'event',
  label: 'Event',
  icon: 'calendar',
  fields: {
    subject: Field.text({ label: 'Subject', required: true }),
    start: Field.datetime({ label: 'Start', required: true }),
    end: Field.datetime({ label: 'End', required: true }),
    location: Field.text({ label: 'Location' }),
    description: Field.textarea({ label: 'Description' }),
    participants: Field.lookup('contact', { label: 'Participants', multiple: true }),
    type: Field.select(['Meeting', 'Call', 'Email', 'Other'], { label: 'Type' })
  },
  list_views: {
    all: {
      label: 'All Events',
      columns: ['subject', 'start', 'end', 'location', 'type']
    },
    calendar: {
      label: 'Calendar',
      type: 'calendar',
      startDateField: 'start',
      endDateField: 'end',
      titleField: 'subject',
      defaultView: 'month'
    } as any
  }
});
