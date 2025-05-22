'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/ui/header'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showHeader = pathname !== '/'

  return (
    <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
      {showHeader && <Header />}
      {children}
    </div>
  )
}
