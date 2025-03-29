"use client"

import React from "react"
import { Edit, Trash } from "lucide-react"

export default function PendingOrderPage() {
  return (
    <div className="min-h-screen bg-theme text-theme border-theme p-6 md:p-8">
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold mb-2">Pending</h1>
      <h2 className="mb-6 text-xl font-semibold">
        Invoice <span className="text-gray-500">#928203</span>
      </h2>

      {/* MAIN CONTENT: 2-column grid (left: invoice details, right: pending orders) */}
      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        {/* LEFT COLUMN: Table + Subtotal/Discount/Total + Action Buttons */}
        <div>
          {/* TABLE */}
          <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product ID</th>
                  <th className="px-4 py-3 font-semibold">Product Name</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Quantity</th>
                  <th className="px-4 py-3 font-semibold">Discount</th>
                  <th className="px-4 py-3 font-semibold">Final Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {/* Example rows; replace with your real data */}
                <tr>
                  <td className="px-4 py-3">AS8901KL8H</td>
                  <td className="px-4 py-3">Kanvas Rem ABCDEF</td>
                  <td className="px-4 py-3">SP Mobil</td>
                  <td className="px-4 py-3">-Rp 12,000</td>
                  <td className="px-4 py-3">1</td>
                  <td className="px-4 py-3">-Rp 12,000</td>
                  <td className="px-4 py-3">Rp 1,408,000</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">AS8901KL8H</td>
                  <td className="px-4 py-3">Kanvas Rem ABCDEF</td>
                  <td className="px-4 py-3">SP Mobil</td>
                  <td className="px-4 py-3">-Rp 12,000</td>
                  <td className="px-4 py-3">1</td>
                  <td className="px-4 py-3">-Rp 12,000</td>
                  <td className="px-4 py-3">Rp 1,408,000</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">AS8901KL8H</td>
                  <td className="px-4 py-3">Kanvas Rem ABCDEF</td>
                  <td className="px-4 py-3">SP Mobil</td>
                  <td className="px-4 py-3">-Rp 12,000</td>
                  <td className="px-4 py-3">1</td>
                  <td className="px-4 py-3">-Rp 12,000</td>
                  <td className="px-4 py-3">Rp 1,408,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SUBTOTAL / DISCOUNT / TOTAL */}
          <div className="mt-4 flex flex-col items-end gap-1 text-sm">
            <div className="flex w-full max-w-sm justify-between">
              <span>Subtotal</span>
              <span>Rp 12,800,000</span>
            </div>
            <div className="flex w-full max-w-sm justify-between text-red-600">
              <span>Discount</span>
              <span>-Rp 50,000</span>
            </div>
            <div className="flex w-full max-w-sm justify-between text-lg font-semibold">
              <span>Total</span>
              <span>Rp 12,750,000</span>
            </div>
          </div>

          {/* ACTION BUTTONS: DELETE, EDIT, PAYMENT */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button className="rounded-md bg-[#DD0004] px-4 py-2 text-white hover:opacity-90">
              Delete
            </button>
            <button className="flex items-center gap-1 rounded-md bg-[#0456F7] px-4 py-2 text-white hover:opacity-90">
              <Edit size={16} />
              Edit
            </button>
            <button className="rounded-md bg-[#0456F7] px-4 py-2 text-white hover:opacity-90">
              Payment
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: PENDING ORDER LIST */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">
            Pending Order <span className="text-gray-500">(5)</span>
          </h3>

          {/* Cards for each pending invoice */}
          <div className="space-y-4">
            {/* Example card #1 */}
            <div className="rounded-md border border-gray-200 bg-white p-4 text-sm shadow-sm">
              <p className="font-semibold">
                Invoice <span className="text-gray-500">#928203</span>
              </p>
              <p className="text-gray-600">Car / Sales / Mechanic</p>
              <p className="mt-1 text-xs text-gray-500">DB 10 / David Kenau</p>
              <p className="mt-1 text-xs text-blue-600">3 Items</p>
            </div>

            {/* Example card #2 */}
            <div className="rounded-md border border-gray-200 bg-white p-4 text-sm shadow-sm">
              <p className="font-semibold">
                Invoice <span className="text-gray-500">#928204</span>
              </p>
              <p className="text-gray-600">Car / Sales / Mechanic</p>
              <p className="mt-1 text-xs text-gray-500">DB 10 / David Kenau</p>
              <p className="mt-1 text-xs text-blue-600">2 Items</p>
            </div>

            {/* Example card #3 */}
            <div className="rounded-md border border-gray-200 bg-white p-4 text-sm shadow-sm">
              <p className="font-semibold">
                Invoice <span className="text-gray-500">#928205</span>
              </p>
              <p className="text-gray-600">Car / Sales / Mechanic</p>
              <p className="mt-1 text-xs text-gray-500">DB 10 / David Kenau</p>
              <p className="mt-1 text-xs text-blue-600">5 Items</p>
            </div>

            {/* Add more cards as needed */}
          </div>
        </div>
      </div>
    </div>
  )
}