import { useLoaderData } from "react-router"
import { getDB } from "~/db/getDB"
import Navbar from "../navbar/navbar"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
        
export async function loader() {
  const db = await getDB()
  const employees = await db.all("SELECT * FROM employees;")

  return { employees }
}

export default function EmployeesPage() {
  const { employees } = useLoaderData()
  const columns = [
    {field: 'id', header: 'ID'},
    {field: 'full_name', header: 'Name'},
    {field: 'date_of_birth', header: 'Date of Birth'},
    {field: 'position', header: 'Position'} ,

];
const [filters, setFilters] = useState({
  full_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  id: { value: null, matchMode: FilterMatchMode.CONTAINS },
  position: { value: null, matchMode: FilterMatchMode.CONTAINS },
  date_of_birth: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const [globalFilter, setGlobalFilter] = useState("");

 
    return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> 
      <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-gray-800">Employees</h3>
        <a
          href="/employees/new"
          className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Create New Employee
        </a>
      </div>
      <div className="mb-3" style={{ maxWidth: "300px" }}>
        <span>
          <i className="pi pi-search" />
          <InputText
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search employees..."
            className="p-inputtext-sm"
          />
        </span>
      </div>
      <div className="card">
      <DataTable size="small" 
                 showGridlines
                 globalFilter={globalFilter}
                 filters={filters}
                 filterDisplay="row" 
                 className="p-datatable-sm card custom-table"  stripedRows paginator rows={2} rowsPerPageOptions={[5, 10, 25, 50]}   
                 value={employees}
                 tableStyle={{ minWidth: '50rem'  }}>
                {columns.map((col, i) => (
                    <Column filter filterPlaceholder={col.header} showFilterMenu={true} sortable  key={col.field} field={col.field} header={col.header} />
                ))}
  <Column
    body={(rowData) => (
      <a href={`/employees/${rowData.id}`}>
        <Button icon="pi pi-pencil" className="p-button-sm p-button-text" />
        </a>
    )}
  />

            </DataTable>
            </div>
        {/* <table className="table-auto w-full bg-white shadow-md rounded-lg border-grey">
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
        </table> */}
      </div>
    </div>
  )
}

