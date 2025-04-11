'use client'

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    LabelList,
} from 'recharts'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const data = [
    { name: 'Hera', sales: 96 },
    { name: 'Angel', sales: 85 },
    { name: 'Kris', sales: 91 },
    { name: 'Meita', sales: 108 },
    { name: 'David', sales: 98 },
    { name: 'Wita', sales: 120 },
    { name: 'Ino', sales: 110 },
    { name: 'Yura', sales: 138 },
    { name: 'Yurman', sales: 103 },
    { name: 'Loro', sales: 99 },
    { name: 'Dior', sales: 106 },
    { name: 'Piana', sales: 130 },
    { name: 'Agus', sales: 110 },
    { name: 'Laura', sales: 150 },
    { name: 'Ralph', sales: 125 },
    { name: 'Nina', sales: 119 },
    { name: 'Bayu', sales: 133 },
    { name: 'Juno', sales: 141 },
    { name: 'Zara', sales: 116 },
    { name: 'Rio', sales: 144 },
    { name: 'Hera', sales: 146 },
    { name: 'Angel', sales: 135 },
    { name: 'Kris', sales: 151 },
    { name: 'Meita', sales: 118 },
    { name: 'David', sales: 128 },
    { name: 'Wita', sales: 98 },
    { name: 'Ino', sales: 137 },
    { name: 'Yura', sales: 148 },
    { name: 'Dior', sales: 126 },
    { name: 'Piana', sales: 120 },
]

export function EmployeePerformanceChart() {
    const [page, setPage] = useState(0)
    const itemsPerPage = 15
    const totalPages = Math.ceil(data.length / itemsPerPage)
    const paginatedData = data.slice(page * itemsPerPage, (page + 1) * itemsPerPage)

    const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages - 1))
    const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0))

    return (
        <div className="rounded-xl bg-theme text-theme py-2 px-6 shadow-md w-full border border-theme">
            <div className="flex w-full justify-between items-center mt-4 mb-4">
                <h2 className="flex w-full font-semibold text-lg items-center">This Month’s Employee Performance</h2>
                <div className="space-x-2 w-full text-right items-center">
                    <Button variant="outline" onClick={handlePrev} disabled={page === 0}>
                        <ChevronLeft className="h-2 w-2" />
                    </Button>
                    <Button variant="outline" onClick={handleNext} disabled={page === totalPages - 1}>
                        <ChevronRight className="h-2 w-2" />
                    </Button>
                </div>
            </div>

            <div className="w-full overflow-x-auto no-scrollbar ">
                <div className='w-full h-auto'>
                    <ResponsiveContainer width="100%" height={160}>
                        <BarChart
                            data={paginatedData}
                            margin={{ top: 16, right: 0, left: -30, bottom: 0 }}
                            className='w-[40px]'>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12, fontWeight: 500 }} // font-medium text-sm
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                domain={[0, 150]} // batas maksimal
                                ticks={[0, 50, 100, 150]} // custom ticks
                                tick={{ fontSize: 12, fontWeight: 500 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#023291',
                                    color: '#fff',
                                    borderRadius: '10px',
                                    fontWeight: 500,
                                    fontSize: '14px',
                                    border: 'none',
                                    padding: 14,
                                }}
                                cursor={{ fill: '#bfdbfe', opacity: 0.3, radius:8}}
                            />
                            <Bar
                                dataKey="sales"
                                fill="url(#colorGradient)"
                                radius={[10, 10, 0, 0]}
                                isAnimationActive={true}
                                animationDuration={400}
                                className='w-60'
                            >
                                <LabelList
                                    dataKey="sales"
                                    position="top"
                                    className=''
                                    style={{ fill: '#000', fontWeight: 500, fontSize: 12 }}
                                />
                            </Bar>
                            <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#023291" stopOpacity={1} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Dot pagination ala iPhone */}
            <div className='flex w-full justify-center text-sm items-center'>
                {/* <div className='w-full'> </div> */}
                <div className="flex justify-center py-3 space-x-2 items-center">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${page === index ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                        />
                    ))}
                </div>
                {/* <div className="space-x-2 w-full text-right">
                    <Button variant="outline" onClick={handlePrev} disabled={page === 0}>
                        <ChevronLeft className="h-2 w-2" />
                    </Button>
                    <Button variant="outline" onClick={handleNext} disabled={page === totalPages - 1}>
                        <ChevronRight className="h-2 w-2" />
                    </Button>
                </div> */}
            </div>
        </div>
    )
}