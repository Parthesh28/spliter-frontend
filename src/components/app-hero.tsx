"use client"

import React, { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Filter, X } from "lucide-react"
import SplitCard from "@/components/app-card"
import FabCreateSplit from "./app-fab"
import { useSpliterProgram } from "./hooks/useAnchorQueries"

// ---------- Types ----------
import { PublicKey } from '@solana/web3.js'
import { BN, ProgramAccount } from '@coral-xyz/anchor'

type ActualContributor = {
  contributor: PublicKey
  percent: number
  hasCleared: boolean
  clearedAt: BN
}

type ActualSplitAccount = {
  splitAuthority: PublicKey
  splitName: string
  receiver: PublicKey
  splitAmount: BN
  contributors: ActualContributor[]
  receivedAmount: BN
  isReleased: boolean
  releasedAt: BN
  bump: number
}

type SplitProgramAccount = ProgramAccount<ActualSplitAccount>

type RoleFilter = "All" | "Creator" | "Contributor" | "Both"
type PaymentFilter = "Paid" | "Unpaid"
type ReleaseFilter = "Released" | "Unreleased"

// ---------- Helper Functions ----------
const bnToNumber = (bn: BN): number => {
  try {
    return bn.toNumber()
  } catch (error) {
    // Handle overflow for very large numbers
    console.warn('BN too large for toNumber(), using toString and parsing', error)
    const str = bn.toString()
    return parseInt(str, 10)
  }
}

const publicKeyToString = (pk: PublicKey): string => {
  return pk.toString()
}

// Convert actual data to component-friendly format
const transformSplit = (programAccount: SplitProgramAccount) => {
  const { account, publicKey } = programAccount

  return {
    id: publicKeyToString(publicKey),
    name: account.splitName || "Unnamed Split",
    split_authority: publicKeyToString(account.splitAuthority),
    receiver: publicKeyToString(account.receiver),
    split_amount: bnToNumber(account.splitAmount),
    received_amount: bnToNumber(account.receivedAmount),
    is_released: account.isReleased,
    released_at: bnToNumber(account.releasedAt),
    contributors: account.contributors.map(c => ({
      contributor: publicKeyToString(c.contributor),
      percent: c.percent,
      has_cleared: c.hasCleared,
      cleared_at: bnToNumber(c.clearedAt)
    }))
  }
}

// ---------- Page ----------
export default function HomePage({
  programAccounts,
  userPubkey,
  onViewDetails,
}: {
  programAccounts: SplitProgramAccount[]
  userPubkey: string | PublicKey
  onViewDetails: (splitId: string) => void
}) {
  const [query, setQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All")
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter | null>(null)
  const [releaseFilter, setReleaseFilter] = useState<ReleaseFilter | null>(null)
  const { getAllSplits } = useSpliterProgram()

  const to58 = (v: string | PublicKey): string => {
    if (typeof v === "string") return v
    return v?.toString()
  }
  const me = to58(userPubkey)

  const { data } = getAllSplits
  console.log("Raw data from hook:", data)

  // Transform actual data to component format and filter for user involvement
  const splits = useMemo(() => {
    if (!programAccounts || !Array.isArray(programAccounts)) {
      return []
    }

    return programAccounts
      .map(transformSplit)
      .filter((split) => {
        // Only show splits where user is creator OR contributor
        const isCreator = split.split_authority === me
        const isContributor = split.contributors?.some(c => c.contributor === me)
        return isCreator || isContributor
      })
  }, [programAccounts, me])

  console.log("Transformed and filtered splits:", splits)

  const filtered = useMemo(() => {
    if (!splits || !Array.isArray(splits)) {
      return []
    }

    const q = query.trim().toLowerCase()

    return splits.filter((s) => {
      // Search by name
      const name = (s.name ?? "").toLowerCase()
      if (q && !name.includes(q)) return false

      const isCreator = s.split_authority === me
      const userContrib = s.contributors?.find((c) => c.contributor === me)
      const isContributor = Boolean(userContrib)

      // Role filter
      switch (roleFilter) {
        case "Creator":
          if (!isCreator) return false
          break
        case "Contributor":
          if (!isContributor) return false
          break
        case "Both":
          if (!(isCreator && isContributor)) return false
          break
        case "All":
        default:
          break
      }

      // Payment filter
      if (paymentFilter) {
        if (!isContributor) return false
        if (paymentFilter === "Paid" && !userContrib?.has_cleared) return false
        if (paymentFilter === "Unpaid" && userContrib?.has_cleared) return false
      }

      // Release filter
      if (releaseFilter === "Released" && !s.is_released) return false
      if (releaseFilter === "Unreleased" && s.is_released) return false

      return true
    })
  }, [splits, query, roleFilter, paymentFilter, releaseFilter, me])

  // Count active filters for indicator
  const activeFiltersCount = [
    roleFilter !== "All" ? 1 : 0,
    paymentFilter ? 1 : 0,
    releaseFilter ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0)

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-10">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
          Your Splits
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          {splits?.length ? `${splits.length} splits where you're involved` : "No splits found where you're involved"}
        </p>
      </div>

      {/* Search + Role dropdown */}
      <div className="mx-auto w-full max-w-3xl flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute z-10 left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by split name..."
            className="pl-11 h-12 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 backdrop-blur-md focus-visible:ring-0 focus-visible:border-zinc-400 dark:focus-visible:border-zinc-500 transition-colors shadow-sm"
          />
          {query && (
            <button
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors rounded-full p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="relative h-12 w-12 rounded-2xl p-0 grid place-items-center bg-white dark:bg-zinc-900/60 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
              aria-label="Role filter"
            >
              <Filter className="h-5 w-5" />
              {activeFiltersCount > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-full text-xs font-medium flex items-center justify-center">
                  {activeFiltersCount}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-xl bg-white dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-200 min-w-[170px] shadow-lg"
          >
            <DropdownMenuRadioGroup value={roleFilter} onValueChange={(v) => setRoleFilter(v as RoleFilter)}>
              <DropdownMenuRadioItem value="All">All Roles</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Creator">Creator Only</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Contributor">Contributor Only</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Both">Creator & Contributor</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Segmented filters */}
      <div className="mx-auto w-full max-w-3xl flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        {/* Payment Filter */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-900/50 shadow-sm">
            {(["Paid", "Unpaid"] as PaymentFilter[]).map((opt) => (
              <Button
                key={opt}
                size="sm"
                onClick={() => setPaymentFilter(paymentFilter === opt ? null : opt)}
                variant="ghost"
                className={`px-4 h-9 text-sm rounded-none transition-all duration-200 border-r border-zinc-300 dark:border-zinc-700 last:border-r-0 ${paymentFilter === opt
                  ? "bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
              >
                {opt}
              </Button>
            ))}
          </div>
        </div>

        {/* Release Filter */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-900/50 shadow-sm">
            {(["Released", "Unreleased"] as ReleaseFilter[]).map((opt) => (
              <Button
                key={opt}
                size="sm"
                onClick={() => setReleaseFilter(releaseFilter === opt ? null : opt)}
                variant="ghost"
                className={`px-4 h-9 text-sm rounded-none transition-all duration-200 border-r border-zinc-300 dark:border-zinc-700 last:border-r-0 ${releaseFilter === opt
                  ? "bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
              >
                {opt}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(query || activeFiltersCount > 0) && (
        <div className="mx-auto w-full max-w-3xl mb-6">
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-700/50">
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <span>Showing {filtered.length} split{filtered.length !== 1 ? 's' : ''}</span>
              {query && (
                <span className="text-zinc-500 dark:text-zinc-500">
                  matching &quot{query}&quot
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("")
                setRoleFilter("All")
                setPaymentFilter(null)
                setReleaseFilter(null)
              }}
              className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 h-6 px-2"
            >
              Clear all
            </Button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((s) => (
            <div
              key={s.id}
              className="transform transition-all duration-200 hover:scale-[1.02] hover:-translate-y-1"
            >
              <SplitCard
                split={s}
                userPubkey={me}
                onViewDetails={onViewDetails}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400 py-20">
            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/30 mb-4">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              No splits found
            </h3>
            <p className="text-sm text-center max-w-md">
              {query || activeFiltersCount > 0
                ? "Try adjusting your search or filters to find what you're looking for."
                : "You don't have any splits yet where you're involved as creator or contributor. Create one to get started."}
            </p>
            {(query || activeFiltersCount > 0) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery("")
                  setRoleFilter("All")
                  setPaymentFilter(null)
                  setReleaseFilter(null)
                }}
                className="mt-4 text-zinc-600 dark:text-zinc-300"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
        <FabCreateSplit />
      </div>
    </div>
  )
}