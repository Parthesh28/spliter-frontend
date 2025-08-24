'use client'

import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/sonner'
import  Navbar  from '@/components/app-header'
import React from 'react'
import { AppFooter } from '@/components/app-footer'

export function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex flex-col min-h-screen">
        <Navbar/>
        <main className="flex-grow container mx-auto p-4 pt-20">
          {children}
        </main>
        <AppFooter />
      </div>
      <Toaster />
    </ThemeProvider>
  )
} 