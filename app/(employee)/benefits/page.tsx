"use client"

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { PayrollDatePicker } from '@/components/payroll-date';
import { ChevronLeft, ChevronRight, Divide, PencilLine, Search, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';


const benefitsData = [
  {
    paymentDate: '11/04/2025',
    employee_id: 'MCPHY2524',
    name: 'Hera Hermes',
    role: 'Sales',
    type: 'Incentive',
    amount: 5000000,
    status: 'Unpaid',
    notes: 'Omset penjualan bulan ini melebihi 10%'
  },
  {
    paymentDate: '10/04/2025',
    employee_id: 'MCPKL2526',
    name: 'Clara Dior',
    role: 'Mechanic',
    type: 'Reimbursement',
    amount: 200000,
    status: 'Paid',
    notes: 'Mengganti uang transportasi'
  },
  {
    paymentDate: '10/04/2025',
    employee_id: 'EMP001',
    name: 'Aldi Nugraha',
    role: 'Sales',
    type: 'Commission',
    amount: 3000000,
    status: 'Paid',
    notes: 'Komisi penjualan bulan Maret'
  },
  {
    paymentDate: '09/04/2025',
    employee_id: 'EMP002',
    name: 'Sabrina Putri',
    role: 'Mechanic',
    type: 'Bonus',
    amount: 1500000,
    status: 'Paid',
    notes: 'Bonus kerja lembur akhir pekan'
  },
  {
    paymentDate: '09/04/2025',
    employee_id: 'EMP003',
    name: 'Jonathan Arya',
    role: 'Sales',
    type: 'Incentive',
    amount: 2750000,
    status: 'Unpaid',
    notes: 'Target mingguan tercapai'
  },
  {
    paymentDate: '08/04/2025',
    employee_id: 'EMP004',
    name: 'Livia Angelica',
    role: 'Mechanic',
    type: 'Reimbursement',
    amount: 500000,
    status: 'Paid',
    notes: 'Penggantian alat kerja rusak'
  },
  {
    paymentDate: '08/04/2025',
    employee_id: 'EMP005',
    name: 'Taufik Hidayat',
    role: 'Sales',
    type: 'Reward',
    amount: 1000000,
    status: 'Unpaid',
    notes: 'Reward karena mendapat testimoni pelanggan'
  },
  {
    paymentDate: '08/04/2025',
    employee_id: 'EMP006',
    name: 'Marcellino David',
    role: 'Mechanic',
    type: 'Transport Allowance',
    amount: 300000,
    status: 'Paid',
    notes: 'Uang transportasi shift malam'
  },
  {
    paymentDate: '07/04/2025',
    employee_id: 'EMP007',
    name: 'Tiara Fadilla',
    role: 'Sales',
    type: 'Meal Subsidy',
    amount: 250000,
    status: 'Paid',
    notes: 'Tunjangan makan harian'
  },
  {
    paymentDate: '07/04/2025',
    employee_id: 'EMP008',
    name: 'Gilang Saputra',
    role: 'Mechanic',
    type: 'Bonus',
    amount: 1200000,
    status: 'Unpaid',
    notes: 'Bonus karena menyelesaikan pekerjaan lebih cepat'
  },
  {
    paymentDate: '07/04/2025',
    employee_id: 'EMP009',
    name: 'Dhana Lalapan',
    role: 'Sales',
    type: 'Incentive',
    amount: 4000000,
    status: 'Paid',
    notes: 'Omset pribadi tertinggi tim'
  },
  {
    paymentDate: '06/04/2025',
    employee_id: 'EMP010',
    name: 'Ryan Prakoso',
    role: 'Mechanic',
    type: 'Reimbursement',
    amount: 150000,
    status: 'Paid',
    notes: 'Penggantian bensin operasional'
  },
  {
    paymentDate: '06/04/2025',
    employee_id: 'EMP011',
    name: 'Cindy Mareta',
    role: 'Sales',
    type: 'Bonus',
    amount: 200000,
    status: 'Unpaid',
    notes: 'Bonus karena menang campaign internal'
  },
  {
    paymentDate: '06/04/2025',
    employee_id: 'EMP012',
    name: 'Alice Pelealu',
    role: 'Mechanic',
    type: 'Training Stipend',
    amount: 500000,
    status: 'Paid',
    notes: 'Uang saku saat ikut pelatihan teknikal'
  },
  {
    paymentDate: '05/04/2025',
    employee_id: 'EMP013',
    name: 'Melati Kusuma',
    role: 'Sales',
    type: 'Commission',
    amount: 2750000,
    status: 'Paid',
    notes: 'Komisi dari penjualan 3 unit mobil'
  },
  {
    paymentDate: '05/04/2025',
    employee_id: 'EMP014',
    name: 'Niko Aryaduta',
    role: 'Mechanic',
    type: 'Overtime Bonus',
    amount: 800000,
    status: 'Unpaid',
    notes: 'Lembur perbaikan kendaraan customer VIP'
  },
  {
    paymentDate: '05/04/2025',
    employee_id: 'EMP015',
    name: 'Sofia Rachma',
    role: 'Sales',
    type: 'Referral Bonus',
    amount: 1000000,
    status: 'Paid',
    notes: 'Berhasil referensi kandidat baru'
  },
  {
    paymentDate: '04/04/2025',
    employee_id: 'EMP016',
    name: 'Daniel Lim',
    role: 'Mechanic',
    type: 'Transport Allowance',
    amount: 200000,
    status: 'Paid',
    notes: 'Transport untuk tugas luar kota'
  },
  {
    paymentDate: '04/04/2025',
    employee_id: 'EMP017',
    name: 'Reina Salma',
    role: 'Sales',
    type: 'Performance Bonus',
    amount: 3500000,
    status: 'Unpaid',
    notes: 'Bonus performa Q1'
  },
  {
    paymentDate: '04/04/2025',
    employee_id: 'EMP018',
    name: 'Zaky Farhan',
    role: 'Mechanic',
    type: 'Reimbursement',
    amount: 180000,
    status: 'Paid',
    notes: 'Ganti biaya pembelian spare part minor'
  }
];

const BenefitsPage: React.FC = () => {
  const perPage = 13
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)

  const filtered = benefitsData.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const currentData = filtered.slice(currentPage * perPage, (currentPage + 1) * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline" className="bg-orange-100 text-orange-600">Pending</Badge>;
      case 'Completed':
        return <Badge variant="outline" className="bg-green-100 text-green-600">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen p-8 bg-theme text-theme space-y-4 flex flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-2xl font-bold">Benefits</h1>
        </div>
        <ModeToggle />
      </div>

      <div className="mt-2 flex items-center justify-between w-full">
        <PayrollDatePicker></PayrollDatePicker>
        {/* Search Bar */}
        <div className="relative flex gap-6 justify-end text-right">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <Input
            placeholder="Search.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-5 w-100 h-[40px] rounded-[80px]" />
        </div>
      </div>

      {/* Benefits CARDS: Total Benefits, Paid Benefits, Unpaid Benefits */}
      <div className="mb-4 grid grid-cols-3 gap-8">
        <div className="rounded-[20px] h-[96px] py-5 px-8 shadow-sm dark:shadow-gray-900 bg-gradient-to-r from-[#023291] to-[#0456F7]">
          <p className="text-[13px] text-white">Total Benefits</p>
          <p className="mt-1 text-2xl font-bold text-white">Rp 35.000.000</p>
        </div>
        <div className="rounded-[20px] h-[96px] py-5 px-8 shadow-sm dark:shadow-gray-900 bg-theme text-theme border border-gray-200 dark:border-[oklch(1_0_0_/_10%)]">
          <p className="text-[13px] text-gray-500 dark:text-gray-400">Paid Benefits</p>
          <p className="mt-1 text-2xl font-bold text-theme">Rp 30.000.000</p>
        </div>
        <div className="rounded-[20px] h-[96px] py-5 px-8 shadow-sm dark:shadow-gray-900 bg-gradient-to-r from-[#960019] to-[#DF0025]">
          <p className="text-[13px] text-white">Unpaid Benefits</p>
          <p className="mt-1 text-2xl font-bold text-white">Rp 5.000.000</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto rounded-lg border border-theme bg-theme">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#F1F1F1] text-left text-gray-600 dark:bg-[#181818] dark:text-gray-400">
            <tr>
              <th className="px-4 py-4 font-semibold">Payment Date</th>
              <th className="px-4 py-4 font-semibold">Employee ID</th>
              <th className="px-4 py-4 font-semibold">Name</th>
              <th className="px-2 py-4 font-semibold">Type</th>
              <th className="px-4 py-4 font-semibold">Amount</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-4 py-4 font-semibold">Notes</th>
              <th className="px-4 py-4 font-semibold"></th>
            </tr>
          </thead>
          <TableBody className="bg-theme divide-y dark:divide-[oklch(1_0_0_/_10%)]">
            {currentData.map((emp, i) => (
              <TableRow key={i} className="dark:hover:bg-[#161616] text-[13px]">
                <TableCell className="px-4 py-3.5">{emp.paymentDate}</TableCell>
                <TableCell className="px-4 py-2">{emp.employee_id}</TableCell>
                <TableCell className="px-4 py-2">{emp.name}</TableCell>
                <TableCell className="px-2 py-2">{emp.type}</TableCell>
                <TableCell className="px-4 py-2">{formatRupiah(emp.amount)}</TableCell>
                <TableCell>
                  <div
                    className={`px-4 py-1 w-19 font-medium text-theme h-[25px] text-xs text-center rounded-xl items-center ${emp.status === "Unpaid" ? "bg-[#FFD2D9] text-[#DD0005]" : "bg-[#DAF6D2] text-[#34A718]"}`}>
                    {emp.status}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-2 max-w-[220px] whitespace-normal break-words text-ellipsis" title={emp.notes}>
                  {emp.notes}
                </TableCell>
                <TableCell className="px-4 py-2">
                  <button className="mr-2 text-[#0456F7] cursor-pointer">
                    <PencilLine size={16} />
                  </button>
                  <button className="text-[#DD0005] cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </table>
      </div>

      {/* Pagination */}
      <footer className="mt-auto w-full text-sm text-gray-600 dark:text-white">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          {/* e.g. "Showing 16 of 48 Products" */}
          <p>
            Showing {Math.min((currentPage + 1) * perPage, filtered.length)} of {filtered.length} Employees
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))} disabled={currentPage === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              {currentPage + 1} / {totalPages}
            </span>
            <Button variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BenefitsPage;

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