import type { Metadata } from 'next'
import './globals.css'
import React from 'react'
import { AppProviders } from './context/appProviders'
import { ThemeSelect } from '@/components/themeSelect'
import Navbar from '@/components/navbar'

export const metadata: Metadata = {
  title: 'Spliter',
  description: 'Automated spliting for Solana',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-15rem] right-[-5rem] h-[40rem] w-[40rem] rounded-full bg-slate-600/50 dark:bg-slate-400/30 blur-[8rem] sm:h-[50rem] sm:w-[50rem] sm:right-[5rem]"></div>
          <div className="absolute top-[-10rem] left-[-15rem] h-[45rem] w-[45rem] rounded-full bg-zinc-600/50 dark:bg-zinc-400/30 blur-[8rem] sm:h-[55rem] sm:w-[55rem] sm:left-[-5rem] lg:left-[0rem]"></div>
          <div className="absolute bottom-[-20rem] left-1/2 transform -translate-x-1/2 h-[50rem] w-[50rem] rounded-full bg-gray-200/50 dark:bg-gray-700/55 blur-[8rem] sm:h-[60rem] sm:w-[60rem]"></div>
        </div>

        <AppProviders>
          <Navbar />
          <ThemeSelect />
          {children}
        </AppProviders>
        
      </body>
    </html>
  )
}

declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}