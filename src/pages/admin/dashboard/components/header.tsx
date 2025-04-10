import type React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
          {text && <p className="text-muted-foreground">{text}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

