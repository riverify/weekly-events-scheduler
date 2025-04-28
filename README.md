# weekly-meetings-scheduler

**Automate your weekly meeting scheduling with Google Apps Script**

This repository provides a flexible Google Apps Script that:

1. **Cleans up** historical meeting events older than a configurable retention period.
2. **Schedules** weekly meetings (e.g., MorningMeetingMon, MorningMeetingTueFri, EveningMeetingMonWed, EveningMeetingFri, WeeklyProgress) from Monday to Friday.
3. **Skips** days from a subscribed holiday calendar.
4. **Reminds** users with a popup notification a configurable number of minutes before each event.
5. **Extends** easily by modifying a single configuration object.

---

## Repository Name

`weekly-meetings-scheduler`

## Short Description

A Google Apps Script to automatically clean up old meetings, schedule upcoming week’s meetings with holiday awareness and configurable reminders, and support modular configuration for customization.

---

## Getting Started

1. **Clone** this repository:
   ```bash
   git clone https://github.com/<your-username>/weekly-meetings-scheduler.git
   ```
2. **Open** [Google Apps Script](https://script.google.com/) and create a new project.
3. **Copy** the contents of `src/scheduler.js` into your Apps Script editor.
4. **Configure** the `CONFIG` object in the script:
   - `holidayCalId`: ID of your subscribed holiday calendar (e.g., `your.holiday.calendar@group.v.calendar.google.com`).
   - `meetingCalId`: ID of your dedicated meetings calendar (fallback to default calendar if empty).
   - `retentionDays`: Number of past days to keep before cleanup.
   - `reminderMinutesBefore`: Minutes before event to trigger a popup reminder.
   - `meetings`: Array of meeting definitions with names, weekdays, times, durations, and descriptions.
5. **Authorize** the script when prompted to access your Google Calendars.
6. **Run** the function `scheduleWeeklyMeetings()` manually to verify correct behavior.
7. **Set up** a time-driven trigger:
   - Go to **Triggers** (🔔) → **Add Trigger**.
   - Choose **`scheduleWeeklyMeetings`**, select time-driven, weekly on Monday, and a preferred hour (e.g., 8:00–9:00 AM).

---

## File Structure

```text
weekly-meetings-scheduler/
├── src/
│   └── scheduler.js    # Main script with CONFIG and scheduler logic
└── README.md           # Project documentation
```

---

## Example `src/scheduler.js`

```javascript
/**
 * Google Apps Script: Automated Weekly Meetings Scheduler
 */

// ===== Configuration =====
const CONFIG = {
  holidayCalId: '<YOUR_HOLIDAY_CALENDAR_ID>',
  meetingCalId: '<YOUR_MEETING_CALENDAR_ID>',
  retentionDays: 30,
  reminderMinutesBefore: 3,
  meetings: [
    {
      name: 'MorningMeetingMon',
      days: [1],           // Monday
      time: { hour: 11, minute: 0 },
      durationMinutes: 60,
      description: () => `Webex ID: <YOUR_WEBEX_ID>`
    },
    {
      name: 'MorningMeetingTueFri',
      days: [2,3,4,5],     // Tue–Fri
      time: { hour: 10, minute: 15 },
      durationMinutes: 60,
      description: () => `Webex ID: <YOUR_WEBEX_ID>`
    },
    {
      name: 'EveningMeetingMonWed',
      days: [1,2,3],       // Mon–Wed
      time: { hour: 16, minute: 0 },
      durationMinutes: 60,
      description: () => `Webex ID: <YOUR_WEBEX_ID>`
    },
    {
      name: 'EveningMeetingFri',
      days: [5],           // Friday
      time: { hour: 17, minute: 0 },
      durationMinutes: 60,
      description: () => `Webex ID: <YOUR_WEBEX_ID>`
    },
    {
      name: 'WeeklyProgress',
      days: [4],           // Thursday
      time: { hour: 16, minute: 0 },
      durationMinutes: 60,
      description: () => `Webex ID: <YOUR_WEBEX_ID>`
    }
  ]
};

// Utility and scheduler functions follow...
```

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m "Add new meeting type"`.
4. Push: `git push origin feature/your-feature`.
5. Open a Pull Request.

---

## License

MIT © riverify

