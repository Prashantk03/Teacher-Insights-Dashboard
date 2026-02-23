"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function LayoutWrapper({ children }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const nav = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Teachers", href: "/dashboard/teacher" },
    { name: "Reports", href: "/dashboard/report" },
  ];

  // Fetch teachers once
  useEffect(() => {
    async function fetchTeachers() {
      try {
        const res = await fetch("/api/insights/overview");
        const data = await res.json();
        setTeachers(data.teachers || data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchTeachers();
  }, []);

  const filteredTeachers =
    search.length > 0
      ? teachers.filter((teacher) =>
          teacher.name.toLowerCase().includes(search.toLowerCase()),
        )
      : [];

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-gray-100">

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64
        bg-white
          border-r border-gray-200
          p-6
          transition-transform duration-300
          z-50

          fixed top-0 left-0 h-screen
          ${open ? "translate-x-0" : "-translate-x-full"}

          md:relative md:h-auto md:translate-x-0
        `}
      >

        {/* Logo */}
        <div className="mb-10">
          <h1 className="text-xl font-semibold tracking-tight text-purple-600">
            SAVRA
          </h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {nav.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`
            flex items-center px-4 py-2.5 rounded-lg text-sm font-medium
            transition-all duration-200
            ${
              isActive
                ? "bg-purple-100 text-purple-700 shadow-sm"
                : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            }
          `}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col w-full">
        {/* Topbar */}
        <div className="bg-white border-b px-4 sm:px-6 py-4">
          {/* Row 1 */}
          <div className="flex items-center justify-between">
            {/* Left section */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpen(true)}
                className="md:hidden text-2xl text-zinc-900"
              >
                ☰
              </button>

              <div>
                <h2 className="text-base sm:text-lg font-semibold text-zinc-900">
                  Admin Companion
                </h2>

                {/* Hide subtitle on mobile */}
                <p className="hidden sm:block text-sm text-gray-500">
                  See what's happening across your school
                </p>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="hidden sm:block relative">
              <input
                type="text"
                placeholder="Search teachers..."
                className="border rounded-md px-3 py-2 text-sm w-64 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
              />

              {showDropdown && filteredTeachers.length > 0 && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-md shadow-lg z-50">
                  {filteredTeachers.map((teacher) => (
                    <div
                      key={teacher.teacherId}
                      onClick={() => {
                        setSearch("");
                        setShowDropdown(false);
                        router.push(`/dashboard/teacher/${teacher.teacherId}`);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {teacher.name}
                    </div>
                  ))}
                </div>
              )}

              {showDropdown &&
                search.length > 0 &&
                filteredTeachers.length === 0 && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border rounded-md shadow-lg px-4 py-2 text-sm text-gray-500">
                    No teacher found
                  </div>
                )}
            </div>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden mt-3 relative">
            <input
              type="text"
              placeholder="Search teachers..."
              className="w-full border rounded-md px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
            />

            {showDropdown && filteredTeachers.length > 0 && (
              <div className="absolute left-0 mt-2 w-full bg-white border rounded-md shadow-lg z-50">
                {filteredTeachers.map((teacher) => (
                  <div
                    key={teacher.teacherId}
                    onClick={() => {
                      setSearch("");
                      setShowDropdown(false);
                      router.push(`/dashboard/teacher/${teacher.teacherId}`);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {teacher.name}
                  </div>
                ))}
              </div>
            )}

            {showDropdown &&
              search.length > 0 &&
              filteredTeachers.length === 0 && (
                <div className="absolute left-0 mt-2 w-full bg-white border rounded-md shadow-lg px-4 py-2 text-sm text-gray-500">
                  No teacher found
                </div>
              )}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 w-full px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
