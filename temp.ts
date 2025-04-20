// "use client"
// import React, { useState, useEffect } from 'react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { ModeToggle } from '@/components/mode-toggle';
// import { SidebarTrigger } from '@/components/ui/sidebar';
// import { Separator } from '@/components/ui/separator';
// import { PayrollDatePicker } from '@/components/payroll-date';
// import { ChevronLeft, ChevronRight, PencilLine, PlusIcon, Search, Trash2 } from 'lucide-react';
// import {
//   TableBody,
//   TableCell,
//   TableRow,
// } from "@/components/ui/table"
// import { Benefits } from '@/types/types';
// import employeeApi from '@/api/employeeApi';
// import { typeStyles } from '@/constants/styleConstants';
// import type { DateRange } from "react-day-picker"
// import { format } from "date-fns"

// const statusColor = (status: string) => {
//   return status === "Unpaid"
//     ? "bg-[#FFE3E3] text-[#B91C1C]"
//     : "bg-[#E9F9EA] text-[#097A37]"
// }

// function getTypeStyle(type: string) {
//   return typeStyles[type] || typeStyles.default
// }

// const formatRupiah = (num: number) => {
//   return 'Rp ' + num.toLocaleString('id-ID');
// };

// export default function BenefitsPage() {
//   const perPage = 13
//   const [searchQuery, setSearchQuery] = useState("")
//   const [currentPage, setCurrentPage] = useState(1)

//   const [benefits, setBeneftis] = useState<Benefits[]>([])
//   const [filteredBenefits, setFilteredBenefits] = useState<Benefits[]>([])

//   const [benefitsSummary, setBenefitsSummary] = useState({
//     total_salaries: 0,
//     total_paid: 0,
//     total_unpaid: 0
//   })

//   const [dateRange, setDateRange] = useState<DateRange | undefined>({
//     from: new Date(),
//     to: new Date(),
//   })

//   const currentData = filteredBenefits.slice(currentPage * perPage, (currentPage + 1) * perPage)
//   const totalPages = Math.ceil(filteredBenefits.length / perPage)

//   useEffect(() => {
//     handleViewBenefitsList();
//   }, [])

//   useEffect(() => {
//     if (dateRange?.from && dateRange?.to) {
//       filterBenefitsByDate();
//     }
//     handleViewBenefitsSummary();
//   }, [dateRange]);

//   useEffect(() => {
//     if (searchQuery.trim() === "") {
//       filterBenefitsByDate();
//     } else {
//       const filtered = filteredBenefits.filter((benefit) =>
//         benefit.employee_name.toString().toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredBenefits(filtered);
//     }
//     setCurrentPage(0); // reset ke halaman pertama setelah filter
//   }, [searchQuery]);

//   const handleViewBenefitsList = async () => {
//     try {
//       const res = await employeeApi().viewBenefitsList();
//       if (res.status == 200) {
//         const allBenefits = res.data;
//         setBeneftis(allBenefits);

//         const fromDate = dateRange?.from ?? new Date();
//         const toDate = dateRange?.to ?? new Date();
//         fromDate.setHours(0, 0, 0, 0);
//         toDate.setHours(23, 59, 59, 999);

//         const filtered = allBenefits.filter((benefit: Benefits) => {
//           const benefitDate = new Date(benefit.date);
//           return benefitDate >= fromDate && benefitDate <= toDate;
//         });

//         setFilteredBenefits(filtered);
//       } else {
//         console.log("Error fetching data:", res.error)
//       }
//     } catch (error) {
//       console.log("Error fetching data:", error)
//     }
//   }

//   const handleViewBenefitsSummary = async () => {
//     try {
//       const startDate = format(dateRange?.from ?? new Date(), "yyyy-MM-dd");
//       const endDate = format(dateRange?.to ?? new Date(), "yyyy-MM-dd");

//       const formDate = {
//         start_date: startDate,
//         end_date: endDate
//       }

//       const res = await employeeApi().viewBenefitsSummary(formDate);
//       if (res.status == 200) {
//         setBenefitsSummary(res.data);
//       } else {
//         console.log("Error fetching data:", res.error)
//       }
//     } catch (error) {
//       console.log("Error fetching data:", error)
//     }
//   }

//   const filterBenefitsByDate = () => {
//     const fromDate = dateRange?.from ?? new Date();
//     const toDate = dateRange?.to ?? new Date();

//     // Normalize dates to start and end of the day
//     fromDate.setHours(0, 0, 0, 0);
//     toDate.setHours(23, 59, 59, 999);

//     const filtered = benefits.filter(benefit => {
//       const benefitDate = new Date(benefit.date);
//       return benefitDate >= fromDate && benefitDate <= toDate;
//     });

//     setFilteredBenefits(filtered);
//   }

//   return (
//     <div className="min-h-screen p-8 bg-white dark:bg-[#000] text-theme space-y-4 flex flex-col">
//       {/* Header */}
//       <div className="mb-4 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <SidebarTrigger className="-ml-1" />
//           <Separator orientation="vertical" className="mr-2 h-4" />
//           <h1 className="text-2xl font-bold">Benefits</h1>
//         </div>
//         <ModeToggle />
//       </div>

//       {/* Date Range & Search Bar */}
//       <div className="mt-2 flex items-center justify-between w-full">
//         <PayrollDatePicker value={dateRange} onValueChange={setDateRange} />
//         <div className="relative flex items-center gap-4">
//           <div className="relative flex gap-6 justify-end text-right">
//             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
//             <Input
//               placeholder="Search.."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-12 pr-5 w-100 h-[40px] rounded-[80px]" />
//           </div>
//           <Button className="bg-[#0456F7] text-white hover:bg-blue-700 w-38 h-[40px] rounded-[80px] items-center font-semibold text-sm">
//             <span>
//               <PlusIcon style={{ color: "white", width: "18px", height: "18px" }} />
//             </span>
//             Add Benefit
//           </Button>
//         </div>
//       </div>

//       {/* Benefit Cards */}
//       <div className="mb-4 grid grid-cols-3 gap-8">
//         <div className="rounded-[20px] h-[96px] p-5 shadow-sm dark:shadow-gray-900 bg-gradient-to-r from-[#023291] to-[#0456F7]">
//           <p className="text-[13px] text-white">Total Benefits</p>
//           <p className="mt-1 text-2xl font-bold text-white">Rp {benefitsSummary.total_salaries.toLocaleString("id-ID")}</p>
//         </div>
//         <div className="rounded-[20px] h-[96px] p-5 shadow-sm dark:shadow-gray-900 bg-theme text-theme border border-gray-200 dark:border-[oklch(1_0_0_/_10%)]">
//           <p className="text-[13px] text-gray-500 dark:text-gray-400">Paid Benefits</p>
//           <p className="mt-1 text-2xl font-bold text-theme">Rp {benefitsSummary.total_paid.toLocaleString("id-ID")}</p>
//         </div>
//         <div className="rounded-[20px] h-[96px] p-5 shadow-sm dark:shadow-gray-900 bg-gradient-to-r from-[#960019] to-[#DF0025]">
//           <p className="text-[13px] text-white">Unpaid Benefits</p>
//           <p className="mt-1 text-2xl font-bold text-white">Rp {benefitsSummary.total_unpaid.toLocaleString("id-ID")}</p>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="w-full overflow-x-auto rounded-lg border border-theme bg-theme">
//         <table className="w-full border-collapse text-sm">
//           <thead className="bg-[#F1F1F1] text-left text-gray-600 dark:bg-[#181818] dark:text-gray-400">
//             <tr>
//               <th className="px-4 py-4 font-semibold">Payment Date</th>
//               <th className="px-4 py-4 font-semibold">Employee ID</th>
//               <th className="px-4 py-4 font-semibold">Name</th>
//               <th className="px-4 py-4 font-semibold">Type</th>
//               <th className="px-4 py-4 font-semibold">Amount</th>
//               <th className="px-4 py-4 font-semibold">Status</th>
//               <th className="px-4 py-4 font-semibold">Notes</th>
//               <th className="px-4 py-4 font-semibold"></th>
//             </tr>
//           </thead>
//           <TableBody className="bg-theme divide-y dark:divide-[oklch(1_0_0_/_10%)]">
//             {currentData.map((emp, i) => (
//               <TableRow
//                 key={i}
//                 className="dark:hover:bg-[#161616] text-[13px]"
//               >
//                 <TableCell className="px-4 py-3.5 whitespace-nowrap">
//                   {emp.date}
//                 </TableCell>
//                 <TableCell className="px-4 py-2 whitespace-nowrap">
//                   {emp.employee_id}
//                 </TableCell>
//                 <TableCell className="px-4 py-2 whitespace-nowrap">
//                   {emp.employee_name}
//                 </TableCell>
//                 {/* TYPE with pastel "button" style */}
//                 <TableCell className="px-4 py-2">
//                   <span
//                     className={`inline-block px-3 py-1 rounded-full text-[13px] font-medium ${getTypeStyle(emp.type)}`}
//                   >
//                     {emp.type}
//                   </span>
//                 </TableCell>
//                 <TableCell className="px-4 py-2 whitespace-nowrap">
//                   {formatRupiah(emp.amount)}
//                 </TableCell>
//                 <TableCell className="px-4 py-2">
//                   <div
//                     className={`px-3 py-1 w-19 font-medium text-theme text-xs text-center rounded-xl items-center ${statusColor(
//                       emp.status
//                     )}`}
//                   >
//                     {emp.status}
//                   </div>
//                 </TableCell>
//                 {/* Wrap the notes if too long */}
//                 <TableCell className="px-4 py-2 max-w-[260px] whitespace-normal break-words">
//                   {emp.notes}
//                 </TableCell>
//                 <TableCell className="px-4 py-2 whitespace-nowrap">
//                   <button className="mr-2 text-[#0456F7] cursor-pointer">
//                     <PencilLine size={16} />
//                   </button>
//                   <button className="text-[#DD0005] cursor-pointer">
//                     <Trash2 size={16} />
//                   </button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <footer className="mt-auto w-full text-sm text-gray-600 dark:text-white">
//         <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
//           <p>
//             Showing {Math.min((currentPage + 1) * perPage, filteredBenefits.length)} of{" "}
//             {filteredBenefits.length} Employees
//           </p>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
//               disabled={currentPage === 0 || totalPages === 0}
//             >
//               <ChevronLeft className="h-4 w-4" />
//             </Button>
//             <span>
//               {totalPages === 0 ? "0 / 0" : `${currentPage + 1} / ${totalPages}`}
//             </span>
//             <Button
//               variant="outline"
//               onClick={() =>
//                 setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
//               }
//               disabled={currentPage >= totalPages - 1 || totalPages === 0}
//             >
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// };