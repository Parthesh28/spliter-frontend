"use client"
import React from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, CheckCircle, Clock, Crown, User, ExternalLink } from "lucide-react"

// Updated types to match transformed data
type TransformedContributor = {
    contributor: string
    percent: number
    has_cleared: boolean
    cleared_at: number
}

type TransformedSplit = {
    id: string
    name: string
    split_authority: string
    receiver: string
    split_amount: number
    received_amount: number
    is_released: boolean
    released_at: number
    contributors: TransformedContributor[]
}

const SplitCard = ({
    split,
    userPubkey,
    onViewDetails,
}: {
    split: TransformedSplit
    userPubkey: string
    onViewDetails: (splitId: string) => void
}) => {
    const formatAddress = (addr: string) => {
        if (!addr || addr.length < 8) return addr
        return `${addr.slice(0, 4)}...${addr.slice(-4)}`
    }

    // Normalize addresses for comparison (remove any whitespace and ensure consistent case)
    const normalizeAddress = (addr: string) => addr?.trim?.() || ''
    const normalizedUserPubkey = normalizeAddress(userPubkey)
    const normalizedSplitAuthority = normalizeAddress(split.split_authority)

    // Determine user's role
    const isCreator = normalizedSplitAuthority === normalizedUserPubkey
    const userContributor = split.contributors?.find((c: TransformedContributor) =>
        normalizeAddress(c.contributor) === normalizedUserPubkey
    )
    const isContributor = !!userContributor

    // Calculate progress - handle potential division by zero
    const isReadyToRelease = split.split_amount > 0 && split.received_amount >= split.split_amount
    const progressPercentage = split.split_amount > 0 ? (split.received_amount / split.split_amount) * 100 : 0

    // Format amounts for display (you might want to convert lamports to SOL)
    const formatAmount = (amount: number): string => {
        // If this is in lamports, convert to SOL
        const sol = amount / 1000000000 // 1 SOL = 1e9 lamports
        return sol.toFixed(4)
    }

    return (
        <Card className="flex flex-col h-full w-full max-w-sm bg-zinc-50 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-700/50 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
            onClick={() => onViewDetails(split.id)}>
            {/* Header */}
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {split.name || "Unnamed Split"}
                        </CardTitle>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono truncate mt-1">
                            {formatAddress(split.id)}
                        </p>
                    </div>

                    {/* View Details Button */}
                    <Button
                        onClick={(e) => {
                            e.stopPropagation()
                            onViewDetails(split.id)
                        }}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="View details"
                    >
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                </div>

                {/* Status + Role Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    {/* Role badges */}
                    {isCreator && isContributor ? (
                        <Badge className="bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30 text-xs px-2 py-0.5 flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            Both
                        </Badge>
                    ) : (
                        <>
                            {isCreator && (
                                <Badge className="bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30 text-xs px-2 py-0.5 flex items-center gap-1">
                                    <Crown className="w-3 h-3" />
                                    Creator
                                </Badge>
                            )}
                            {isContributor && (
                                <Badge className="bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30 text-xs px-2 py-0.5 flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    Contributor
                                </Badge>
                            )}
                        </>
                    )}

                    {/* Split status */}
                    {split.is_released ? (
                        <Badge className="bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 text-xs px-2 py-0.5 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Released
                        </Badge>
                    ) : (
                        <Badge className="bg-zinc-100 dark:bg-zinc-500/15 text-zinc-700 dark:text-zinc-400 border-zinc-200 dark:border-zinc-500/30 text-xs px-2 py-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Active
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4 pb-4 flex-1">
                {/* Amount & Progress */}
                <div className="p-4 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/30 border border-zinc-200/50 dark:border-zinc-700/30">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Target Amount</span>
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            ◎ {formatAmount(split.split_amount)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-zinc-600 dark:text-zinc-400">Collected</span>
                        <span className="text-xs text-zinc-700 dark:text-zinc-300">
                            ◎ {formatAmount(split.received_amount)}
                        </span>
                    </div>

                    {!split.is_released && (
                        <div className="space-y-2">
                            <Progress
                                value={Math.min(progressPercentage, 100)}
                                className="h-2 bg-zinc-200 dark:bg-zinc-700/40"
                            />
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500 dark:text-zinc-400">
                                    {Math.round(progressPercentage)}% complete
                                </span>
                                {isReadyToRelease && (
                                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                        Ready to release
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Contributors Info */}
                {split.contributors && split.contributors.length > 0 && (
                    <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100/30 dark:bg-zinc-800/20 rounded-lg p-2">
                        <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{split.contributors.length} contributor{split.contributors.length !== 1 ? 's' : ''}</span>
                        </div>
                        <span className="font-medium">
                            {split.contributors.filter(c => c.has_cleared).length} paid
                        </span>
                    </div>
                )}

                {/* Release Date for Released Splits */}
                {split.is_released && split.released_at > 0 && (
                    <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100/30 dark:bg-zinc-800/20 rounded-lg p-2">
                        <span>Released on</span>
                        <span className="font-medium">
                            {new Date(split.released_at * 1000).toLocaleDateString()}
                        </span>
                    </div>
                )}

                {/* User's Status Indicator */}
                {isContributor && userContributor && !split.is_released && (
                    <div className="flex items-center justify-between text-xs bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800/30">
                        <span className="text-blue-700 dark:text-blue-300">Your contribution</span>
                        <span className="font-medium text-blue-800 dark:text-blue-200">
                            {userContributor.has_cleared ? `✓ Paid ${userContributor.percent}%` : `⏳ ${userContributor.percent}% pending`}
                        </span>
                    </div>
                )}
            </CardContent>

            {/* Footer with action hint */}
            <CardFooter className="pt-0 pb-4 mt-auto">
                <div className="w-full text-center">
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                        Click to view details and manage →
                    </span>
                </div>
            </CardFooter>
        </Card>
    )
}

export default SplitCard