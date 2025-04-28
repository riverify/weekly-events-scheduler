# weekly-events-scheduler

**Automate your weekly event scheduling with Google Apps Script**

This repository provides a flexible Google Apps Script that:

1. **Cleans up** historical events older than a configurable retention period.
2. **Schedules** weekly events (e.g., MorningEventMon, MorningEventTueFri, EveningEventMonWed, EveningEventFri, WeeklyProgress) from Monday to Friday.
3. **Skips** days from a subscribed holiday calendar.
4. **Reminds** users with customizable popup notifications before each event.
5. **Extends** easily by modifying a single configuration object.

---

## Getting Started

1. **Clone** this repository:
   ```bash
   git clone https://github.com/riverify/weekly-events-scheduler.git
   ```
2. **Open** [Google Apps Script](https://script.google.com/) and create a new project.
3. **Copy** the contents of `src/scheduler.js` into your Apps Script editor.
4. **Configure** the `CONFIG` object in the script:
   - `holidayCalId`: ID of your subscribed holiday calendar (e.g., `your.holiday.calendar@group.v.calendar.google.com`).
   - `eventCalId`: ID of your dedicated events calendar (fallback to default calendar if empty).
   - `retentionDays`: Number of past days to keep before cleanup.
   - `defaultReminderMinutes`: Default minutes before event to trigger a popup reminder.
   - `autoScheduleMarker`: Identifier to mark auto-scheduled events (prevents accidental deletion of manual events).
   - `events`: Array of event definitions with names, weekdays, times, durations, custom reminder times, and descriptions.
5. **Authorize** the script when prompted to access your Google Calendars.
6. **Run** the function `scheduleWeeklyEvents()` manually to verify correct behavior.
7. **Set up** a time-driven trigger:
   - Go to **Triggers** (🔔) → **Add Trigger**.
   - Choose **`scheduleWeeklyEvents`**, select time-driven, weekly on Monday, and a preferred hour (e.g., 8:00–9:00 AM).

---

## File Structure

```text
weekly-events-scheduler/
├── src/
│   └── scheduler.js    # Main script with CONFIG and scheduler logic
└── README.md           # Project documentation
```

---

## Example `src/scheduler.js`

```javascript
/**
 * Google Apps Script: Automated Weekly Events Scheduler
 */

// ===== Configuration =====
const CONFIG = {
  holidayCalId: '<YOUR_HOLIDAY_CALENDAR_ID>',
  eventCalId: '<YOUR_EVENT_CALENDAR_ID>',
  retentionDays: 30,
  defaultReminderMinutes: 3,
  autoScheduleMarker: "[Auto-Scheduled]",
  events: [
    {
      name: 'MorningEventMon',
      days: [1],           // Monday
      time: { hour: 11, minute: 0 },
      durationMinutes: 60,
      reminderMinutes: 5,  // Custom reminder (5 minutes)
      description: () => `${CONFIG.autoScheduleMarker} Webex ID: <YOUR_WEBEX_ID>`
    },
    {
      name: 'MorningEventTueFri',
      days: [2,3,4,5],     // Tue–Fri
      time: { hour: 10, minute: 15 },
      durationMinutes: 60,
      // Uses default reminder (3 minutes)
      description: () => `${CONFIG.autoScheduleMarker} Webex ID: <YOUR_WEBEX_ID>`
    },
    {
      name: 'EveningEventMonWed',
      days: [1,2,3],       // Mon–Wed
      time: { hour: 16, minute: 0 },
      durationMinutes: 60,
      reminderMinutes: 10, // Custom reminder (10 minutes)
      description: () => `${CONFIG.autoScheduleMarker} Webex ID: <YOUR_WEBEX_ID>`
    },
    {
      name: 'EveningEventFri',
      days: [5],           // Friday
      time: { hour: 17, minute: 0 },
      durationMinutes: 60,
      reminderMinutes: 15, // Custom reminder (15 minutes)
      description: () => `${CONFIG.autoScheduleMarker} Webex ID: <YOUR_WEBEX_ID>`
    },
    {
      name: 'WeeklyProgress',
      days: [4],           // Thursday
      time: { hour: 16, minute: 0 },
      durationMinutes: 60,
      reminderMinutes: 5,  // Custom reminder (5 minutes)
      description: () => `${CONFIG.autoScheduleMarker} Webex ID: <YOUR_WEBEX_ID>`
    }
  ]
};

// Utility and scheduler functions follow...
```

---

## Key Features

### 🔒 Safe Event Cleanup
Uses an `autoScheduleMarker` identifier to only delete events created by the script, keeping your manually created events safe.

### ⏰ Custom Reminders
Set different reminder times for each event type:
- Define a `defaultReminderMinutes` as fallback
- Override with `reminderMinutes` in specific event configurations

### 📅 Holiday Awareness
Automatically skips scheduling on holidays by checking against your holiday calendar.

### 🔄 Weekly Automation
Set up once and let the script handle your recurring events every week.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m "Add new event type"`.
4. Push: `git push origin feature/your-feature`.
5. Open a Pull Request.

---

## License

MIT © riverify
