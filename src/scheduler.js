/**
 * Google Apps Script: Automated Weekly Events Scheduler
 *
 * Features:
 * 1. Cleans up historical events older than a retention period
 * 2. Schedules weekly events with customizable configuration
 * 3. Skips holidays via a subscribed holiday calendar
 * 4. Adds customizable popup reminders for each event type
 * 5. Modular configuration for easy future extension
 */

// ==================== Configuration ====================
const CONFIG = {
  // Calendar IDs
  holidayCalId: 'your-holiday-calendar-id@group.v.calendar.google.com', // Holidays calendar ID
  eventCalId: 'your-email@example.com', // Your dedicated events calendar ID; fallback to default calendar

  // Cleanup settings
  retentionDays: 30, // Days of past events to retain

  // Default reminder settings (can be overridden by individual events)
  defaultReminderMinutes: 3,

  // Auto-schedule identifier (to prevent deletion of manually created events)
  autoScheduleMarker: "[Auto-Scheduled]",

  // Event definitions: each entry fully defines its name, days, time, duration, reminder and description
  events: [
    {
      name: 'Monday Morning Event',
      days: [1],                // 1 = Monday
      time: { hour: 11, minute: 0 },
      durationMinutes: 60,
      reminderMinutes: 5,      // Override default reminder (5 minutes instead of 3)
      description: () => `${CONFIG.autoScheduleMarker} Conference ID: 123 456 789`
    },
    {
      name: 'Regular Morning Event',
      days: [2,3,4,5],         // 2=Tue,3=Wed,4=Thu,5=Fri
      time: { hour: 10, minute: 15 },
      durationMinutes: 60,
      // uses default reminder
      description: () => `${CONFIG.autoScheduleMarker} Conference ID: 123 456 789`
    },
    {
      name: 'Mon-Wed Evening Event',
      days: [1,2,3],
      time: { hour: 16, minute: 0 },
      durationMinutes: 60,
      reminderMinutes: 10,     // 10 minute reminder
      description: () => `${CONFIG.autoScheduleMarker} Conference ID: 987 654 321`
    },
    {
      name: 'Friday Evening Event',
      days: [5],
      time: { hour: 17, minute: 0 },
      durationMinutes: 60,
      reminderMinutes: 15,     // 15 minute reminder 
      description: () => `${CONFIG.autoScheduleMarker} Conference ID: 987 654 321`
    },
    {
      name: 'Weekly Progress Review',
      days: [4],               // 4 = Thursday
      time: { hour: 16, minute: 0 },
      durationMinutes: 60,
      reminderMinutes: 5,      // 5 minute reminder
      description: () => `${CONFIG.autoScheduleMarker} Conference ID: 123 456 789`
    }
  ]
};

// ==================== Utility Functions ====================
/** Retrieves the work calendar, falling back to default if not found */
function getWorkCalendar() {
  const cal = CalendarApp.getCalendarById(CONFIG.eventCalId);
  return cal || CalendarApp.getDefaultCalendar();
}

/** Deletes past events older than retentionDays */
function cleanupOldEvents(workCal) {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - CONFIG.retentionDays);

  // Only delete the events that description contains ${CONFIG.autoScheduleMarker}
  const oldEvents = workCal.getEvents(new Date(0), cutoff)
    .filter(ev => {
      return CONFIG.events.some(e => ev.getTitle() === e.name) && 
             ev.getDescription().includes(CONFIG.autoScheduleMarker);
    });

  oldEvents.forEach(ev => ev.deleteEvent());
  Logger.log(`Cleanup: Deleted ${oldEvents.length} events before ${cutoff.toISOString().slice(0,10)}`);
}

/** Fetches holiday dates between start (inclusive) and end (exclusive) */
function getHolidayDates(start, end) {
  const holidayCal = CalendarApp.getCalendarById(CONFIG.holidayCalId);
  if (!holidayCal) {
    throw new Error(`Holiday calendar not found: ${CONFIG.holidayCalId}`);
  }
  const events = holidayCal.getEvents(start, end);
  return new Set(events.map(ev => ev.getAllDayStartDate().toISOString().slice(0,10)));
}

/** Calculates the next (or current) Monday based on today's date */
function getNextMonday() {
  const today = new Date();
  const day = today.getDay(); // 0=Sun,1=Mon...6=Sat
  const delta = (8 - day) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() + delta);
  monday.setHours(0,0,0,0);
  return monday;
}

// ==================== Main Scheduler ====================
/**
 * Main entry: Cleans old events and schedules this week's events
 */
function scheduleWeeklyEvents() {
  const workCal = getWorkCalendar();

  // 1. Cleanup historical events
  cleanupOldEvents(workCal);

  // 2. Determine scheduling window (Monday to Friday)
  const startDate = getNextMonday();
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 5); // through Friday

  // 3. Get holiday set
  const holidays = getHolidayDates(startDate, endDate);

  // 4. Schedule each defined event
  CONFIG.events.forEach(evt => {
    evt.days.forEach(weekday => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (weekday - 1));
      const isoDate = date.toISOString().slice(0,10);
      if (holidays.has(isoDate)) {
        Logger.log(`Skip holiday for ${evt.name}: ${isoDate}`);
        return;
      }

      // Create event start/end
      const start = new Date(date);
      start.setHours(evt.time.hour, evt.time.minute, 0, 0);
      const end = new Date(start);
      end.setMinutes(start.getMinutes() + evt.durationMinutes);

      // Create and add reminder
      const calEvent = workCal.createEvent(evt.name, start, end, {
        description: evt.description(date)
      });
      
      // Use event-specific reminder time or fall back to default
      const reminderTime = evt.reminderMinutes !== undefined ? 
                          evt.reminderMinutes : 
                          CONFIG.defaultReminderMinutes;
      
      calEvent.addPopupReminder(reminderTime);
      Logger.log(`Scheduled ${evt.name} on ${isoDate} at ${evt.time.hour}:${evt.time.minute} with ${reminderTime} minute reminder`);
    });
  });

  Logger.log('All events scheduled with custom reminders');
}
