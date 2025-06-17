"use client"
import { Suspense, useState } from "react"
import type { Metadata } from "next"
import MultiSelect from "@/components/common/MultiSelect"
import DonorList from "@/components/DonorList";
// const options = [
//     { value: 'january', label: 'January' },
//     { value: 'february', label: 'February' },
//     { value: 'march', label: 'March' },
//     { value: 'april', label: 'April' },
//     { value: 'may', label: 'May' },
//     { value: 'june', label: 'June' },
//     { value: 'july', label: 'July' },
//     { value: 'august', label: 'August' },
//     { value: 'september', label: 'September' },
//     { value: 'october', label: 'October' },
//     { value: 'november', label: 'November' },
//     { value: 'december', label: 'December' }
// ]

// export const metadata: Metadata = {
//   title: "Donation Management System",
//   description: "A comprehensive donation management system with dashboard",
// }

export default function DashboardPage() {
  const [formData, setFormData] = useState({ selectedMonths: [] as string[] });

  const handleForm = (selected: string[]) => {
    setFormData({ ...formData, selectedMonths: selected });
    console.log("Form Data: ", { ...formData, selectedMonths: selected });
  }
  return (
    <>
    <div className="flex flex-col items-center mt-10">
    {/* <MultiSelect options={options}  heading={"Select Month"} onChange={handleForm} /> */}
    <DonorList />
    </div>
    </>
  )
}
