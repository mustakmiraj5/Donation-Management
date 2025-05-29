import { Suspense } from "react"
import type { Metadata } from "next"
import MultiSelect from "@/components/common/MultiSelect"
const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' }
]

export const metadata: Metadata = {
  title: "Donation Management System",
  description: "A comprehensive donation management system with dashboard",
}

export default function DashboardPage() {
  return (
    <>
    <p>Welcome</p>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <MultiSelect options={options} />
    </div>
    </>
  )
}
