'use client'
import React from 'react'
import { useSpliterProgram } from '../hooks/useAnchorQueries';
import HomePage from '../app-hero';
import { useRouter } from 'next/navigation';

function DashboardFeature() {
  const { getAllSplits, provider } = useSpliterProgram()
  const { data } = getAllSplits;
  const router = useRouter()

  const handleViewDetails = (splitId: string) => {
    router.push(`/split/${splitId}`)
  }

  // Add loading state
  if (!provider?.publicKey) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
            Please Connect Your Wallet
          </h1>
        </div>
      </div>
    )
  }

  return (
    <HomePage
      programAccounts={data || []}
      userPubkey={provider.publicKey}
      onViewDetails={handleViewDetails}
    />
  )
}

export default DashboardFeature