import { Form, redirect, useLoaderData, useParams, type ActionFunction, type LoaderFunctionArgs } from "react-router"
import { getDB } from "~/db/getDB";
import Navbar from "../navbar/navbar";
let p : any ; 
export async function loader({ params }: LoaderFunctionArgs) {
  debugger
  const  employeeId  = params;
  if (!employeeId) {
    throw new Response("Employee ID not found", { status: 404 });
  }
  const db = await getDB();
  const employee = await db.get("SELECT * FROM employees WHERE id = ?", employeeId['employeeId']);
  if (!employee) {
    throw new Response("Employee not found", { status: 404 });
  }

  return { employee };
}
export const action: ActionFunction = async ({ request , params }) => {
  const formData = await request.formData();
  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const phone =  formData.get("phone");
  const dob =  formData.get("date_of_birth");
  const position =  formData.get("position");
  const department =  formData.get("department");
  const salary =  formData.get("salary");
  const db = await getDB();
  await db.run(
    `UPDATE employees 
     SET full_name = ?, 
         email = ?, 
         phone_number = ?, 
         date_of_birth = ?, 
         position = ?, 
         salary = ?, 
         department = ? 
     WHERE id = ?`,
    [full_name, email, phone, dob, position, salary, department, params.employeeId]
  );
  

  return redirect("/employees");
}
export default function EmployeePage() {
  const { employee } = useLoaderData<typeof loader>();

  return (
 <div className="bg-gray-100">
      {/* Navbar */}
      <Navbar />
      <div className="max-w-4xl mx-auto py-6 px-8 bg-white rounded-lg shadow-md mt-6">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Edit Employee Details</h1>
    <Form method="post" className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Username */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-900">Username</label>
          <input
            required
            type="text"
            name="full_name"
            id="full_name"
            defaultValue={employee?.full_name || ""}
            placeholder="janesmith"
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Email */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-900">Email</label>
          <input
            required
            type="email"
            name="email"
            id="email"
            defaultValue={employee?.email || ""}
            placeholder="janesmith@example.com"
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Phone Number */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-900">Phone Number</label>
          <input
            required
            type="tel"
            name="phone"
            id="phone"
            defaultValue={employee?.phone_number || ""}
            placeholder="(961) 70444555"
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Date of Birth */}
        <div className="sm:col-span-2 sm:w-1/2">
          <label className="block text-sm font-medium text-gray-900">Date of Birth</label>
          <input
            required
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            defaultValue={employee?.date_of_birth?.slice(0, 10) || ""}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Job Title */}
        <div className="sm:col-span-2 sm:w-1/2">
          <label className="block text-sm font-medium text-gray-900">Job Title</label>
          <input
           required
            type="text"
            name="position"
            id="position"
            defaultValue={employee?.position || ""}
            placeholder="Software Engineer"
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Department */}
        <div className="sm:col-span-2 sm:w-1/2">
          <label className="block text-sm font-medium text-gray-900">Department</label>
          <input
            required
            type="text"
            name="department"
            id="department"
            defaultValue={employee?.department || ""}
            placeholder="Engineering"
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Salary */}
        <div className="sm:col-span-2 sm:w-1/2">
          <label className="block text-sm font-medium text-gray-900">Salary</label>
          <input
            required
            type="number"
            name="salary"
            id="salary"
            defaultValue={employee?.salary || ""}
            placeholder="50000"
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base text-gray-900 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Submit and Cancel Buttons */}
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold text-gray-900">
          <a href="/employees">Cancel</a>
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </Form>
    </div>
    </div>
  );
}

