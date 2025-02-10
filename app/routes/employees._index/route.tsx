import { useLoaderData } from "react-router"
import { getDB } from "~/db/getDB"
import Navbar from "../navbar/navbar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

export async function loader() {
  const db = await getDB()
  const employees = await db.all("SELECT * FROM employees;")

  return { employees }
}

export default function EmployeesPage() {
  const { employees } = useLoaderData()
 
    return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> 
      <div className="container mx-auto p-6">
          {/* Create New Employee Section */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-gray-800">Employee List</h3>
        <a
          href="/employees/new"
          className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Create New Employee
        </a>
      </div>
        <table className="table-auto w-full bg-white shadow-md rounded-lg border-grey">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Employee ID</th>
              <th className="px-4 py-2 text-left">Full Name</th>
              <th className="px-4 py-2 text-left">Job Position</th>
              <th className="px-4 py-2 text-left">Date of birth</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th></th>



            </tr>
          </thead>
          <tbody>
            {employees.map((employee: any) => (
              <tr key={employee.id}>
                <td className="px-4 py-2 text-gray-800">{employee.id}</td>
                <td className="px-4 py-2 text-gray-800">{employee.full_name}</td>
                <td className="px-4 py-2 text-gray-800">{employee.position}</td>
                <td className="px-4 py-2 text-gray-800">{employee.date_of_birth}</td>
                <td className="px-4 py-2 text-gray-800">{employee.department}</td>
                <td className="px-4 py-2">
                    <a href={`/employees/${employee.id}`}>
                      <button className="text-blue-500">Edit</button>
                    </a>
                  </td>



              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

