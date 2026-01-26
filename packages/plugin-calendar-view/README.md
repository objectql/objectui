# @object-ui/plugin-calendar-view

Full-featured calendar view plugin for Object UI with month, week, and day views.

## Installation

```bash
npm install @object-ui/plugin-calendar-view
```

## Usage

```tsx
import { CalendarView } from '@object-ui/plugin-calendar-view';

const events = [
  {
    id: 1,
    title: 'Team Meeting',
    start: new Date(2024, 0, 15, 10, 0),
    end: new Date(2024, 0, 15, 11, 0),
  },
  // ... more events
];

function App() {
  return (
    <CalendarView
      events={events}
      view="month"
      onEventClick={(event) => console.log('Event clicked:', event)}
      onDateClick={(date) => console.log('Date clicked:', date)}
    />
  );
}
```

## Features

- Month, week, and day views
- Event handling and display
- Customizable event colors
- All-day and timed events
- Responsive design
- Built with Tailwind CSS and Shadcn UI

## License

MIT
