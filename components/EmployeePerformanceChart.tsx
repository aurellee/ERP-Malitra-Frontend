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
import { useTheme } from 'next-themes'
import { EmployeePerformanceType } from '@/types/types'
import employeeApi from '@/api/employeeApi'
import { set } from 'date-fns'
import { useEffect } from 'react'

function formatRupiah(value: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
}

function formatYAxisTick(value: number): string {
    if (value >= 1e9) return `${value / 1e9} b`;
    if (value >= 1e6) return `${value / 1e6} m`;
    if (value >= 1e3) return `${value / 1e3} k`;
    return value.toString();
}

export default function EmployeePerformanceChart() {
    const [data, setData] = useState<{ name: string; sales: number}[]>([])

    const [page, setPage] = useState(0)
    const itemsPerPage = 15
    const totalPages = Math.ceil(data.length / itemsPerPage)
    const paginatedData = data.slice(page * itemsPerPage, (page + 1) * itemsPerPage)

    const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages - 1))
    const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0))

    const { resolvedTheme } = useTheme()

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const res = await employeeApi().viewMonthlyEmployeePerformance();
            if (res.status == 200) {
                const fetchedData: EmployeePerformanceType[] = res.data;

                const mapped = fetchedData.map((emp) => ({
                    name: emp.employee_name,
                    sales: emp.total_omzet 
                }))
                setData(mapped)
            } else {
                console.error("Error fetching data:", res.error)
            }
        } catch (error) {
            console.error("Error fetching data:", error)
        }
    }

    return (
        <div className="rounded-xl bg-white dark:bg-[#000] text-theme py-1 px-6 shadow-sm w-full border border-theme">
            <div className="flex w-full justify-between items-center mt-4 mb-2">
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
                    <ResponsiveContainer width="100%" height={140}>
                        <BarChart
                            data={paginatedData}
                            margin={{ top: 16, right: 0, left: -12, bottom: 0 }}
                            className='w-[40px]'>
                            <CartesianGrid 
                            vertical={false} 
                            stroke = {resolvedTheme === 'dark' ? '#374151' : '#D3D3D3'}
                            strokeDasharray="3 3" 
                            />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12, fontWeight: 500, color:'#ffffff' }} // font-medium text-sm
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                domain={[0, 150000000]} // batas maksimal
                                ticks={[0, 50000000, 100000000, 150000000]} // custom ticks
                                tickFormatter={formatYAxisTick}
                                tick={{ fontSize: 12, fontWeight: 500 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                formatter={(value: number) => {
                                    const a = formatRupiah(value)
                                    return [`${a}`];}
                                }
                                // formatter={(value, nama) => {
                                //     return [`${value} million`];
                                // }}
                                labelStyle={{ color: "#fff", fontWeight: 400, fontSize: 15  }}
                                itemStyle={{ color: "#fff", fontWeight: 600, fontSize: 15  }}
                                contentStyle={{
                                    backgroundColor: '#023291',
                                    color: '#ffffff', 
                                    borderRadius: '10px',
                                    fontWeight: 500,
                                    fontSize: '14px',
                                    border: 'none',
                                    padding: 14,
                                }}
                                cursor={{ fill: resolvedTheme === 'dark' ? '#374151' : '#bfdbfe', opacity: 0.3, radius:8}}
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
                                    style={{ fill: resolvedTheme === 'dark' ? '#ffffff' : '#000', fontWeight: 500, fontSize: 12 }}
                                    formatter={(value: number) => formatRupiah(value)}
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