"use client"
import React from "react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, CheckCircle, Clock, Crown, User, ExternalLink, Wallet } from "lucide-react"

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

    const normalizeAddress = (addr: string) => addr?.trim?.() || ''
    const normalizedUserPubkey = normalizeAddress(userPubkey)
    const normalizedSplitAuthority = normalizeAddress(split.split_authority)

    const isCreator = normalizedSplitAuthority === normalizedUserPubkey
    const userContributor = split.contributors?.find((c: TransformedContributor) =>
        normalizeAddress(c.contributor) === normalizedUserPubkey
    )
    const isContributor = !!userContributor

    const isReadyToRelease = split.split_amount > 0 && split.received_amount >= split.split_amount
    const progressPercentage = split.split_amount > 0 ? (split.received_amount / split.split_amount) * 100 : 0

    const formatAmount = (amount: number): string => {
        const sol = amount / 1000000000 
        return sol.toFixed(4)
    }

    return (
        <Card className="group relative overflow-hidden bg-gradient-to-br from-white/90 via-white/80 to-zinc-50/90 dark:from-zinc-900/80 dark:via-zinc-900/70 dark:to-zinc-950/80 backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-700/40 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02]"
            onClick={() => onViewDetails(split.id)}>

            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent dark:from-white/5 pointer-events-none"></div>
            <CardHeader className="pb-2 relative z-10">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                                {split.name || "Unnamed Split"}
                            </h3>
                        </div>
                        <div className="flex items-center gap-1">
                            <Wallet className="w-3 h-3 text-zinc-400" />
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono truncate">
                                {formatAddress(split.id)}
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={(e) => {
                            e.stopPropagation()
                            onViewDetails(split.id)
                        }}
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 transition-all opacity-0 group-hover:opacity-100"
                        aria-label="View details"
                    >
                        <ExternalLink className="h-3 w-3" />
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-1 mt-2">
                    {isCreator && isContributor ? (
                        <Badge className="bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-500/20 dark:to-purple-600/20 text-purple-700 dark:text-purple-300 border border-purple-300/50 dark:border-purple-500/30 text-xs px-2 py-0.5 flex items-center gap-1 font-medium">
                            <Crown className="w-3 h-3" />
                            Creator & Contributor
                        </Badge>
                    ) : (
                        <>
                            {isCreator && (
                                <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 text-amber-700 dark:text-amber-300 border border-amber-300/50 dark:border-amber-500/30 text-xs px-2 py-0.5 flex items-center gap-1 font-medium">
                                    <Crown className="w-3 h-3" />
                                    Creator
                                </Badge>
                            )}
                            {isContributor && (
                                <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-500/20 dark:to-cyan-500/20 text-blue-700 dark:text-blue-300 border border-blue-300/50 dark:border-blue-500/30 text-xs px-2 py-0.5 flex items-center gap-1 font-medium">
                                    <User className="w-3 h-3" />
                                    Contributor
                                </Badge>
                            )}
                        </>
                    )}

                    {split.is_released ? (
                        <Badge className="bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-500/30 text-xs px-2 py-0.5 flex items-center gap-1 font-medium">
                            <CheckCircle className="w-3 h-3" />
                            Released
                        </Badge>
                    ) : (
                        <Badge className="bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-700/40 dark:to-zinc-600/40 text-zinc-700 dark:text-zinc-300 border border-zinc-300/50 dark:border-zinc-600/30 text-xs px-2 py-0.5 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3" />
                            Active
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-3 pb-3 relative z-10">
                <div className="p-3 rounded-xl bg-gradient-to-br from-zinc-50/80 to-zinc-100/60 dark:from-zinc-800/50 dark:to-zinc-900/40 border border-zinc-200/60 dark:border-zinc-700/40">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Target</span>
                            <span className="text-sm font-bold bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                                ◎ {formatAmount(split.split_amount)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">Collected</span>
                            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                ◎ {formatAmount(split.received_amount)}
                            </span>
                        </div>

                        {!split.is_released && (
                            <div className="space-y-2 pt-1">
                                <div className="relative">
                                    <Progress
                                        value={Math.min(progressPercentage, 100)}
                                        className="h-2 bg-zinc-200/80 dark:bg-zinc-700/60 rounded-full overflow-hidden"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-cyan-400/20 rounded-full opacity-50"></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                        {Math.round(progressPercentage)}% complete
                                    </span>
                                    {isReadyToRelease && (
                                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                            Ready ✨
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {split.contributors && split.contributors.length > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-zinc-50/60 to-zinc-100/40 dark:from-zinc-800/40 dark:to-zinc-900/30 border border-zinc-200/40 dark:border-zinc-700/30">
                        <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
                            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                {split.contributors.length} contributor{split.contributors.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                            {split.contributors.filter(c => c.has_cleared).length} paid
                        </span>
                    </div>
                )}

                {split.is_released && split.released_at > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-emerald-50/60 to-green-50/40 dark:from-emerald-900/20 dark:to-green-900/15 border border-emerald-200/40 dark:border-emerald-700/30">
                        <span className="text-xs text-emerald-700 dark:text-emerald-300">Released</span>
                        <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                            {new Date(split.released_at * 1000).toLocaleDateString()}
                        </span>
                    </div>
                )}

                {isContributor && userContributor && !split.is_released && (
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-50/80 to-cyan-50/60 dark:from-blue-900/30 dark:to-cyan-900/20 border border-blue-200/60 dark:border-blue-700/40">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-blue-700 dark:text-blue-300">Your share</span>
                            <span className="text-xs font-semibold text-blue-800 dark:text-blue-200">
                                {userContributor.has_cleared ? ` ${userContributor.percent}%` : `⏳ ${userContributor.percent}%`}
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-0 pb-3 relative z-10">
                <div className="w-full">
                    <div className="h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent mb-2"></div>
                    <div className="text-center">
                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                            Click to view details →
                        </span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default SplitCard