import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function EmployeeBenefitsPage() {
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
        <h1 className="text-2xl font-bold">Employee Benefits</h1>
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

// import { AppSidebar } from "@/components/app-sidebar"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
// import { Separator } from "@/components/ui/separator"
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar"

// /**
//  * Renders the Employee Benefits page with a sidebar and breadcrumb navigation.
//  * The page consists of a header with a sidebar trigger and breadcrumb links,
//  * and a content area with placeholder elements styled as muted, rounded rectangles.
//  * Uses `SidebarProvider` to control sidebar state and `AppSidebar` for navigation.
//  */

// export default function EmployeeBenefitsPage() {
//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <header className="flex h-16 shrink-0 items-center gap-2">
//           <div className="flex items-center gap-2 px-4">
//             <SidebarTrigger className="-ml-1" />
//             <Separator
//               orientation="vertical"
//               className="mr-2 data-[orientation=vertical]:h-4"
//             />
//             <Breadcrumb>
//               <BreadcrumbList>
//                 <BreadcrumbItem className="hidden md:block">
//                   <BreadcrumbLink href="#">
//                     Building Your Application
//                   </BreadcrumbLink>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator className="hidden md:block" />
//                 <BreadcrumbItem>
//                   <BreadcrumbPage>Data Fetching</BreadcrumbPage>
//                 </BreadcrumbItem>
//               </BreadcrumbList>
//             </Breadcrumb>
//           </div>
//         </header>
//         <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
//           <div className="grid auto-rows-min gap-4 md:grid-cols-3">
//             <div className="bg-muted/50 aspect-video rounded-xl" />
//             <div className="bg-muted/50 aspect-video rounded-xl" />
//             <div className="bg-muted/50 aspect-video rounded-xl" />
//           </div>
//           <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }