"use client"

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

interface Benefit {
  id: number;
  name: string;
  description: string;
}

const allBenefits: Benefit[] = [
  { id: 1, name: 'Asuransi Kesehatan', description: 'Menanggung biaya medis dan perawatan kesehatan.' },
  { id: 2, name: 'Cuti Tahunan', description: 'Cuti berbayar selama 12 hari dalam setahun.' },
  { id: 3, name: 'Program Pensiun', description: 'Kontribusi perusahaan untuk dana pensiun karyawan.' },
  { id: 4, name: 'Pelatihan dan Pengembangan', description: 'Kesempatan untuk mengikuti pelatihan profesional.' },
  { id: 5, name: 'Asuransi Jiwa', description: 'Perlindungan finansial bagi keluarga karyawan.' },
  { id: 6, name: 'Tunjangan Transportasi', description: 'Subsidi biaya transportasi harian.' },
  { id: 7, name: 'Tunjangan Makan', description: 'Subsidi biaya makan siang.' },
  { id: 8, name: 'Fleksibilitas Waktu Kerja', description: 'Kemungkinan untuk bekerja dengan jam kerja fleksibel.' },
  { id: 9, name: 'Program Kesejahteraan', description: 'Akses ke fasilitas kebugaran dan konseling.' },
  { id: 10, name: 'Bonus Kinerja', description: 'Bonus berdasarkan pencapaian kinerja individu.' },
  { id: 11, name: 'Liburan Tambahan', description: 'Hari libur tambahan di luar cuti tahunan.' },
  { id: 12, name: 'Beasiswa Pendidikan', description: 'Dukungan biaya untuk pendidikan lanjutan.' },
  { id: 13, name: 'Program Mentoring', description: 'Bimbingan dari senior untuk pengembangan karier.' },
  { id: 14, name: 'Tunjangan Perumahan', description: 'Subsidi untuk biaya perumahan atau sewa.' },
  { id: 15, name: 'Cuti Melahirkan', description: 'Cuti berbayar untuk karyawan yang melahirkan.' },
  { id: 16, name: 'Cuti Ayah', description: 'Cuti berbayar untuk karyawan pria yang istrinya melahirkan.' },
  { id: 17, name: 'Program Kesehatan Mental', description: 'Dukungan untuk kesehatan mental karyawan.' },
  { id: 18, name: 'Asuransi Gigi', description: 'Menanggung biaya perawatan gigi.' },
  { id: 19, name: 'Tunjangan Komunikasi', description: 'Subsidi untuk biaya telepon dan internet.' },
  { id: 20, name: 'Program Relokasi', description: 'Dukungan untuk karyawan yang pindah lokasi kerja.' },
];

const BenefitsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const benefitsPerPage = 6;

  const filteredBenefits = allBenefits.filter(benefit =>
    benefit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBenefit = currentPage * benefitsPerPage;
  const indexOfFirstBenefit = indexOfLastBenefit - benefitsPerPage;
  const currentBenefits = filteredBenefits.slice(indexOfFirstBenefit, indexOfLastBenefit);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 md:p-8 bg-theme text-theme space-y-4">
      {/* Header */}
      <div className="text-sm text-muted-foreground">
        Employee &gt; <span className="font-medium text-black">Benefits</span>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-2xl font-bold">Employee Benefits</h1>
        </div>
        <ModeToggle />
      </div>

      {/* Benefits CARDS: Total Benefits, Paid Benefits, Unpaid Benefits */}
      <div className="mb-4 grid grid-cols-3 gap-8">
        <div className="rounded-[20px] h-[110px] py-6 px-8 shadow-sm dark:shadow-gray-900 bg-gradient-to-r from-[#023291] to-[#0456F7]">
          <p className="text-[15px] text-white">Total Benefits</p>
          <p className="mt-1 text-2xl font-bold text-white">Rp 35.000.000</p>
        </div>
        <div className="rounded-[20px] h-[110px] py-6 px-8 shadow-sm dark:shadow-gray-900 bg-theme text-theme border border-gray-200 dark:border-[oklch(1_0_0_/_10%)]">
          <p className="text-[15px] text-gray-500 dark:text-gray-400">Paid Benefits</p>
          <p className="mt-1 text-2xl font-bold text-theme">Rp 30.000.000</p>
        </div>
        <div className="rounded-[20px] h-[110px] py-6 px-8 shadow-sm dark:shadow-gray-900 bg-gradient-to-r from-[#960019] to-[#DF0025]">
          <p className="text-[15px] text-white">Unpaid Benefits</p>
          <p className="mt-1 text-2xl font-bold text-white">Rp 5.000.000</p>
        </div>
      </div>

      {/* Search Bar */}
      <Input
        placeholder="Search benefits..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-1/3"
      />

      {/* Benefit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentBenefits.map((benefit) => (
          <Card key={benefit.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg">{benefit.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-6 space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </Button>

        {[...Array(Math.ceil(filteredBenefits.length / benefitsPerPage)).keys()].map((page) => (
          <Button
            key={page + 1}
            size="sm"
            variant={currentPage === page + 1 ? 'default' : 'outline'}
            onClick={() => paginate(page + 1)}
          >
            {page + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredBenefits.length / benefitsPerPage)}
        >
          Next
        </Button>
      </div>
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