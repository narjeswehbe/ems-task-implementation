import { useState } from "react";
import { useLoaderData, Form, redirect, useNavigate } from "react-router";
import { getDB } from "~/db/getDB";
import Navbar from "../navbar/navbar";
import { Calendar } from "primereact/calendar";

// Loader to fetch the timesheet data by ID
export async function loader({ params }: { params: { id: string } }) {
  const db = await getDB();
  const timesheetId = params
  const timesheet = await db.get(
    "SELECT timesheets.*, employees.full_name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id WHERE timesheets.id = ?",
    [timesheetId['timesheetId']]
  );

  const employees = await db.all('SELECT id, full_name FROM employees');
  console.log(timesheet);

  return { timesheet, employees };
}

// Action to handle form submission (update the timesheet)
export async function action({ request, params }: { request: Request; params: { id: string } }) {
  const formData = new URLSearchParams(await request.text());
  
  const employee_id = formData.get("employee_id");
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");
  const description = formData.get("description");

  const db = await getDB();
  await db.run(
    `UPDATE timesheets SET employee_id = ?, start_time = ?, end_time = ?, description = ? WHERE id = ?`,
    [employee_id, start_time, end_time, description, params.timesheetId]
  );

  return redirect(`/timesheets`);
}

// EditTimesheetPage component
export default function EditTimesheetPage() {
  const { timesheet, employees } = useLoaderData();
  const [startTime, setStartTime] = useState(new Date(timesheet.start_time));
  const [endTime, setEndTime] = useState(new Date(timesheet.end_time));
  return (
     <div>
        <Navbar/>
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
          <h1 className="text-xl font-semibold mb-4">Create New Timesheet</h1>
    
          <Form method="post" className="space-y-4">
            {/* Employee Dropdown */}
            <div>
              <label htmlFor="employee_id" className="block text-sm font-medium">Employee</label>
              <select name="employee_id" id="employee_id" 
              defaultValue={timesheet.employee_id}
              required className="w-full p-2 border rounded">
                <option value="">Select an employee</option>
                {employees.map((emp:any) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.full_name}
                  </option>
                ))}
              </select>
            </div>
    
            {/* Start Time Picker */}
            <div>
              <label className="block text-sm font-medium">Start Time</label>
              <Calendar
               className="calendar bg-white" 
                showIcon showTime appendTo={'self'} 
                value={startTime} onChange={(e) => setStartTime(new Date(e.value?.toISOString() || ''))} />
    
              <input type="hidden" name="start_time" value={startTime.toISOString()} />
            </div>
    
            {/* End Time Picker */}
            <div>
              <label className="block text-sm font-medium">End Time</label>
              <Calendar className="calendar bg-white" showIcon showTime appendTo={'self'} value={endTime} onChange={(e) => setEndTime(new Date(e.value?.toISOString() || ''))} />
    
              <input type="hidden" name="end_time" value={endTime.toISOString()} />
            </div>
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium">Work Summary</label>
              <textarea  
              name="description"
               id="description"  
               className="w-full p-2 border rounded" 
               defaultValue={timesheet.description}
               placeholder="Describe the work done..."></textarea>
            </div>
    
            {/* Submit Button */}
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Update Timesheet
            </button>
          </Form>
        </div>
        </div>
  );
}
