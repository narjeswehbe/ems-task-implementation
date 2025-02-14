import { Form, redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";
import { Messages } from 'primereact/messages';
import Navbar from "../navbar/navbar";
export const action: ActionFunction = async ({ request }) => {
  // Get form data from the request
  const formData = await request.formData();
  
  // Extract the values for each field
  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const phone_number = formData.get("phone");
  const position = formData.get("position");
  const salary = formData.get("salary");
  const department = formData.get("department");
  const dob = formData.get("date_of_birth");

  const query = `
  INSERT INTO employees (full_name, email, phone_number, date_of_birth, position, salary, residence)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;
  
  if (!full_name || !email || !phone_number || !dob || !position || !salary || !department) {
   
  }

  // Connect to the database and run the insert query
  const db = await getDB();
  await db.run(
    `INSERT INTO employees (full_name, email, phone_number, date_of_birth, position, salary, department) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [full_name, email, phone_number, dob, position, salary, department]
  );

  // Redirect to the employees page after submission
  return redirect("/employees");
};

export default function NewEmployeePage() {
 return (
    <div className="bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main content area */}
      <div className="max-w-4xl mx-auto py-6 px-8 bg-white rounded-lg shadow-md mt-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Create New Employee</h1>

        {/* Form */}
        <Form method="post" className="space-y-6">
          {/* Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-900">Username</label>
              <input
                type="text"
                name="full_name"
                id="full_name"
                placeholder="janesmith"
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-900">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="janesmith@example.com"
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Phone Number */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-900">Phone Number</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                placeholder="(961) 70444555"
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Date of Birth */}
            <div className="sm:col-span-2 sm:w-1/2">
              <label className="block text-sm font-medium text-gray-900">Date of Birth</label>
              <input id="date_of_birth" name="date_of_birth" type="date"
                     required
                     className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base text-gray-900 placeholder:text-gray-400"
/>


            </div>

            {/* Position */}
            <div className="sm:col-span-2 sm:w-1/2">
              <label className="block text-sm font-medium text-gray-900">Job Title</label>
              <input
                type="text"
                name="position"
                id="position"
                required
                placeholder="Software Engineer"
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>
            
            {/* Department */}
            <div className="sm:col-span-2 sm:w-1/2">
              <label className="block text-sm font-medium text-gray-900">Department</label>
              <input
                type="text"
                name="department"
                id="department"
                required
                placeholder="Engineering"
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Salary */}
            <div className="sm:col-span-2 sm:w-1/2">
              <label className="block text-sm font-medium text-gray-900">Salary</label>
              <input
                type="number"
                name="salary"
                id="salary"
                placeholder="50000"
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>

          
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" className="text-sm font-semibold text-gray-900">
              <a href="/employees">Cancel
              </a>
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
            >
              Save
            </button>
          </div>
        </Form>
      </div>
    </div>
    
  );
}




