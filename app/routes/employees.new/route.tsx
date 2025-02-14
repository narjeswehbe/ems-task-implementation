import { Form, redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";
import Navbar from "../navbar/navbar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation Schema
const employeeSchema = yup.object().shape({
  full_name: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  phone: yup.string().required("phone is required"),
  date_of_birth: yup
    .date()
    .required("Date of Birth is required")
    .test("is-adult", "Employee must be at least 18 years old", (value) => {
      if (!value) return false;
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      return age >= 18;
    }),
  position: yup.string().required("Position is required"),
  department: yup.string().required("Department is required"),
  salary: yup.number().min(1500, "Salary must be at least $1500").required("Salary is required"),
});

// Server-side action to handle form submission
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const date_of_birth = formData.get("date_of_birth");
  const position = formData.get("position");
  const department = formData.get("department");
  const salary = formData.get("salary");

  const db = await getDB();
  await db.run(
    `INSERT INTO employees (full_name, email, phone_number, date_of_birth, position, salary, department) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [full_name, email, phone, date_of_birth, position, salary, department]
  );

  return redirect("/employees");
};

export default function NewEmployeePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(employeeSchema),
  });

  return (
    <div className="bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-6 px-8 bg-white rounded-lg shadow-md mt-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Create New Employee</h1>

        <Form method="post" className="space-y-6" >
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900">Full Name</label>
            <input
              type="text"
              {...register("full_name")}
              className="w-full border p-2 rounded-md"
            />
            {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-900">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full border p-2 rounded-md"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-900">Phone Number</label>
            <input
              type="tel"
              {...register("phone")}
              className="w-full border p-2 rounded-md"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-900">Date of Birth</label>
            <input
              type="date"
              {...register("date_of_birth")}
              className="w-full border p-2 rounded-md"
            />
            {errors.date_of_birth && <p className="text-red-500 text-sm">{errors.date_of_birth.message}</p>}
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-900">Position</label>
            <input
              type="text"
              {...register("position")}
              className="w-full border p-2 rounded-md"
            />
            {errors.position && <p className="text-red-500 text-sm">{errors.position.message}</p>}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-900">Department</label>
            <input
              type="text"
              {...register("department")}
              className="w-full border p-2 rounded-md"
            />
            {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-900">Salary ($)</label>
            <input
              type="number"
              {...register("salary")}
              className="w-full border p-2 rounded-md"
            />
            {errors.salary && <p className="text-red-500 text-sm">{errors.salary.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" className="text-sm font-semibold text-gray-900">
              <a href="/employees">Cancel</a>
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-500"
            >
              Save
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
