export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 mb-8">
      <ul className="flex space-x-6">
        <li><a href="/" className="hover:text-gray-300">Home</a></li>
        <li><a href="/employees" className="hover:text-gray-300">Employees</a></li>
        <li><a href="/timesheets" className="hover:text-gray-300">Timesheets</a></li>
      </ul>
    </nav>
  );
}
