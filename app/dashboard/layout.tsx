import React from 'react'
import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/top-bar'

export const metadata = {
  title: 'Dashboard - SmartLogistics',
  description: 'Supply chain management dashboard',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <TopBar title="Dashboard" />
        <main className="pt-20 pb-12 px-4 md:px-10">
          {children}
        </main>
      </div>
    </div>
  )
}
