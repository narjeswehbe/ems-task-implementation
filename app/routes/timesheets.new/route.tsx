import { useLoaderData, Form, redirect } from "react-router";
import { getDB } from "~/db/getDB";
import React, { useState } from "react";
import { Calendar } from 'primereact/calendar';
        
// Fetch employees for the dropdown
export async function loader() {
  const db = await getDB();
  const employees = await db.all("SELECT id, full_name FROM employees");
  return { employees };
}

import type { ActionFunction } from "react-router";
import Navbar from "../navbar/navbar";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");
  const start_time = formData.get("start_time") || "";
  const end_time = formData.get("end_time") || "";
  const description = formData.get("description");

  if (start_time >= end_time) {
    return { error: "Start time must be before end time." };
  }

  const db = await getDB();
  await db.run(
    "INSERT INTO timesheets (employee_id, start_time, end_time, description) VALUES (?, ?, ?, ?)",
    [employee_id, start_time, end_time, description]
  );

  return redirect("/timesheets");
};

export default function NewTimesheetPage() {
  const { employees } = useLoaderData();
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  return (
    <div>
    <Navbar/>
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-semibold mb-4">Create New Timesheet</h1>

      <Form method="post" className="space-y-4">
        {/* Employee Dropdown */}
        <div>
          <label htmlFor="employee_id" className="block text-sm font-medium">Employee</label>
          <select name="employee_id" id="employee_id" required className="w-full p-2 border rounded">
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
          <Calendar className="calendar bg-white"  showIcon showTime appendTo={'self'} value={startTime} onChange={(e) => setStartTime(new Date(e.value?.toISOString() || ''))} />

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
          <textarea name="description" id="description"  className="w-full p-2 border rounded" placeholder="Describe the work done..."></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Create Timesheet
        </button>
      </Form>
    </div>
    </div>
  );
}
