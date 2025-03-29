import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function EmployeeAttendancePage() {
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 bg-theme text-theme border-theme">
    {/* TOP BAR: Sidebar trigger + Title (left), Dark mode toggle (right) */}
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Sidebar trigger on the left */}
          {/* <SidebarTrigger /> */}
        <SidebarTrigger className="-ml-1" />
        <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        {/* Page title */}
        <h1 className="text-2xl font-bold">Employee Attendance</h1>
      </div>

      {/* Dark mode toggle on the right */}
      <ModeToggle />
    </div>
    {/* MAIN CONTENT */}
    <main className="flex-1 py-2 md:px-1 md:py-4">
    <div className="pl-1 py-4">
      <h1 className="text-2xl font-bold">Ho ho ho hoya hoya hoyaaa!</h1>
      {/* Your inventory table or content goes here */}
    </div>
    </main>
    </div>
  )
}
