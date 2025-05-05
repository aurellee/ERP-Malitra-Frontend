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
    Cell,
} from 'recharts'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import CustomTooltip from '@/components/customTooltip'

const barColors = [
    "#1357DC", // Sparepart Mobil
    "#4987FF", // Sparepart Motor
    "#89AFFE", // Oli
    "#FFE09A", // Aki
    "#FFC49A", // Ban
    "#FF866B", // Campuran
]

interface SalesIncomeChartProps {
    monthlySalesByCategory: {
        [key: string]: number;
    };
}

function formatRupiah(value: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
}


export default function SalesIncomeChart({ monthlySalesByCategory }: SalesIncomeChartProps) {
    const chartData = useMemo(() => {
        return Object.entries(monthlySalesByCategory).map(([name, sales]) => ({
            name,
            sales,
        }))
    }, [monthlySalesByCategory])

    const [page, setPage] = useState(0)
    const itemsPerPage = 6
    const totalPages = Math.ceil(chartData.length / itemsPerPage)
    const paginatedData = chartData.slice(page * itemsPerPage, (page + 1) * itemsPerPage)

    const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages - 1))
    const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0))

    const { resolvedTheme } = useTheme()

    return (
        <div className="rounded-[40px] bg-white dark:bg-[#000] text-theme px-12 py-6 shadow-sm w-full border border-theme">
            <div className="flex w-full justify-between items-center mt-4 mb-8">
                <h1 className="flex w-full font-semibold text-3xl items-center">
                    This Month’s Sales Income
                    <span className='text-gray-600 font-medium ml-2 font-italic'> (in million)</span>
                </h1>
                {/* <div className="space-x-2 w-full text-right items-center">
                    <Button variant="outline" onClick={handlePrev} disabled={page === 0}>
                        <ChevronLeft className="h-2 w-2" />
                    </Button>
                    <Button variant="outline" onClick={handleNext} disabled={page === totalPages - 1}>
                        <ChevronRight className="h-2 w-2" />
                    </Button>
                </div> */}
            </div>

            <div className="w-full overflow-x-auto no-scrollbar ">
                <div className='w-full h-auto'>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                            data={paginatedData}
                            margin={{ top: 16, right: 0, left: -30, bottom: 0 }}
                            className='w-[40px]'>
                            <CartesianGrid
                                vertical={false}
                                stroke={resolvedTheme === 'dark' ? '#374151' : '#D3D3D3'}
                                strokeDasharray="3 3"
                            />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12, fontWeight: 500, color: '#ffffff' }} // font-medium text-sm
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                domain={[0, 500]} // batas maksimal
                                ticks={[0, 100, 200, 300, 400, 500]} // custom ticks
                                tick={{ fontSize: 12, fontWeight: 500 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            {/* <Tooltip content={<CustomTooltip active={true} payload={[]} />} /> */}
                            <Tooltip
                                formatter={(value: number) => formatRupiah(value)}
                                labelStyle={{ color: "#fff", fontWeight: 400, fontSize: 15  }}
                                itemStyle={{ color: "#fff", fontWeight: 600, fontSize: 15  }}
                                
                                contentStyle={{
                                    backgroundColor: '#0240B9',
                                    color: resolvedTheme === 'dark' ? '#fff' : '#fff',
                                    borderRadius: '16px',
                                    fontWeight: 500,
                                    fontSize: '14px',
                                    border: 'none',
                                    padding: 14,
                                }}
                                cursor={{ fill: resolvedTheme === 'dark' ? '#374151' : '#bfdbfe', opacity: 0.3, radius: 8 }}
                            />
                            <Bar
                                dataKey="sales"
                                // fill="url(#colorGradient)"
                                barSize={160}
                                radius={[32, 32, 0, 0]}
                                isAnimationActive={true}
                                animationDuration={400}
                                className='w-60'
                            >
                                {paginatedData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={barColors[index % barColors.length]}
                                    />
                                ))}
                                <LabelList
                                    dataKey="sales"
                                    position="top"
                                    className='p-4'
                                    style={{ fill: resolvedTheme === 'dark' ? '#fff': '#374151', fontWeight: 400, fontSize: 16 }}
                                    formatter={(value: number) => formatRupiah(value)}
                                    // formatter={(value:string) => `${value} juta`} 
                                />
                            </Bar>
                            {/* <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#023291" stopOpacity={1} />
                                </linearGradient>
                            </defs> */}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}