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
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
// Loader to fetch the timesheets and employees data
export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees = await db.all(
    "SELECT timesheets.*, employees.full_name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id order by id desc"
  );

  return { timesheetsAndEmployees };
}

// Timesheets Page Component
export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData(); 
  const columns = [
    {header:'Employee' , field:'full_name'},
    {header:'Start Time' , field:'start_time'},
    {header:'End Time' , field:'end_time'},

  ]
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const employeesList = Array.from(
    new Set(timesheetsAndEmployees.map((ts:any) => ts.full_name))
  ).map((name) => ({ label: name, value: name }));

  // Filter timesheets based on the selected employee
  const filteredTimesheets = selectedEmployee
    ? timesheetsAndEmployees.filter((ts:any) => ts.full_name === selectedEmployee)
    : timesheetsAndEmployees;
    const events = filteredTimesheets.map((timesheet: any) => ({
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
      events:events,
      plugins: [eventsService]
    })
   
    useEffect(() => {
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

        <div className="card">
                  <Dropdown
  value={selectedEmployee}
  options={employeesList}
  onChange={(e) => setSelectedEmployee(e.value)}
  placeholder="🔍 Filter by Employee"
  className="w-64 mb-3 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
  panelClassName="max-h-60 overflow-auto"
  showClear
/>
            <DataTable size="small" 
                       showGridlines
                       filterDisplay="row" 
                       className="p-datatable-sm card custom-table"  stripedRows paginator rows={2} rowsPerPageOptions={[5, 10, 25, 50]}   
                       value={filteredTimesheets}
                       tableStyle={{ minWidth: '50rem'  }}>
                      {columns.map((col, i) => (
                          <Column filter filterPlaceholder={col.header} showFilterMenu={true} sortable  key={col.field} field={col.field} header={col.header} />
                      ))}
        <Column
          body={(rowData) => (
            <a href={`/timesheets/${rowData.id}`}>
              <Button icon="pi pi-pencil" className="p-button-sm p-button-text" />
              </a>
          )}
        />
      
                  </DataTable>
                  </div>
      // <table className="table-auto w-full bg-white shadow-md rounded-lg border-grey">
      //   <thead className="bg-gray-200">
      //     <tr>
      //       <th className="px-4 py-2 text-left">Employee</th>
      //       <th className="px-4 py-2 text-left">Start Time</th>
      //       <th className="px-4 py-2 text-left">End Time</th>
      //       <th></th>
      //     </tr>
      //   </thead>
      //   <tbody>
      //   {timesheetsAndEmployees.map((timesheet: any) => (
      //           <tr key={timesheet.id}>
      //             <td className="px-4 py-2">{timesheet.full_name}</td>
      //             <td className="px-4 py-2">{new Date(timesheet.start_time).toLocaleString()}</td>
      //             <td className="px-4 py-2">{new Date(timesheet.end_time).toLocaleString()}</td>
      //             <td className="px-4 py-2">
      //               <a href={`/timesheets/${timesheet.id}`}>
      //                 <button className="text-blue-500">Edit</button>
      //               </a>
      //             </td>
      //           </tr>
      //         ))}
      //   </tbody>
      // </table>
      )}
    </div>
  </div>
  );
}
