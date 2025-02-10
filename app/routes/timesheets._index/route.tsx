import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import { getDB } from "~/db/getDB";
import Navbar from "../navbar/navbar";
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { format } from "date-fns";

import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
 
import '@schedule-x/theme-default/dist/index.css'
// Loader to fetch the timesheets and employees data
export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees = await db.all(
    "SELECT timesheets.*, employees.full_name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id"
  );

  return { timesheetsAndEmployees };
}

// Timesheets Page Component
export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData();
  const events = timesheetsAndEmployees.map((timesheet: any) => ({
    id: timesheet.id,
    title: timesheet.full_name,
    start: format(new Date(timesheet.start_time), "yyyy-MM-dd HH:mm"),
    end: format(new Date(timesheet.end_time), "yyyy-MM-dd HH:mm"),
  }));
  // Toggle view handler
  const [calendarView, setCalendarView] = useState(false);
  const eventsService = useState(() => createEventsServicePlugin())[0]
  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events:events
    ,
    plugins: [eventsService]
  })
 
  useEffect(() => {
    // get all events
    eventsService.getAll()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
    <Navbar /> 
    <div className="container mx-auto p-6">
        {/* Create New Employee Section */}
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-medium text-gray-800">Timesheets</h3>
      <button
        className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
         onClick={() => setCalendarView(!calendarView)}>
          {calendarView ? "Switch to Grid View" : "Switch to Calendar View"}
        </button>
      <a
        href="/timesheets/new"
        className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Create New Timesheet
      </a>
    </div>
    {calendarView ? (
        <ScheduleXCalendar
        calendarApp={calendar}
        />
      ) :
      (
      
      <table className="table-auto w-full bg-white shadow-md rounded-lg border-grey">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">Employee</th>
            <th className="px-4 py-2 text-left">Start Time</th>
            <th className="px-4 py-2 text-left">End Time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {timesheetsAndEmployees.map((timesheet: any) => (
                <tr key={timesheet.id}>
                  <td className="px-4 py-2">{timesheet.full_name}</td>
                  <td className="px-4 py-2">{new Date(timesheet.start_time).toLocaleString()}</td>
                  <td className="px-4 py-2">{new Date(timesheet.end_time).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <a href={`/timesheets/${timesheet.id}`}>
                      <button className="text-blue-500">Edit</button>
                    </a>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
      )}
    </div>
  </div>
  );
}
