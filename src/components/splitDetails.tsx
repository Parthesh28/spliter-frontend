"use client"
import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    ArrowLeft,
    Copy,
    Crown,
    User,
    Users,
    CheckCircle,
    Clock,
    Wallet,
    Calendar,
    Target,
    DollarSign,
    TrendingUp,
    Sparkles,
    Shield,
    Eye
} from "lucide-react"

type DetailedContributor = {
    contributor: string
    percent: number
    has_cleared: boolean
    cleared_at: number
}

type DetailedSplit = {
    id: string
    name: string
    split_authority: string
    receiver: string
    split_amount: number
    received_amount: number
    is_released: boolean
    released_at: number
    contributors: DetailedContributor[]
}

interface SplitDetailsPageProps {
    split: DetailedSplit | null
    userPubkey: string
    onBack: () => void
    onContribute: (receiver: string, name: string) => void
    onRelease: (receiver: string, name: string) => void
}

const SplitDetailsPage: React.FC<SplitDetailsPageProps> = ({
    split,
    userPubkey,
    onBack,
    onContribute,
    onRelease,
}) => {
    if (!split) {
        return (
            <div className="w-full max-w-4xl mx-auto px-4 py-20">
                <div className="text-center space-y-6">
                    <div className="relative">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-300/50 dark:border-zinc-700/50 flex items-center justify-center shadow-lg">
                            <Eye className="w-8 h-8 text-zinc-500 dark:text-zinc-400" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent mb-4">
                            Split Not Found
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                            The split you are looking for does not exist or you do not have access to it
                        </p>
                    </div>
                    <Button
                        onClick={onBack}
                        className="bg-gradient-to-r from-zinc-800 to-zinc-900 dark:from-zinc-200 dark:to-zinc-300 text-zinc-100 dark:text-zinc-900 hover:from-zinc-700 hover:to-zinc-800 dark:hover:from-zinc-100 dark:hover:to-zinc-200 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Splits
                    </Button>
                </div>
            </div>
        )
    }

    const formatAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            console.log("Copied to clipboard:", text)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    const isCreator = split.split_authority === userPubkey
    const userContributor = split.contributors?.find(c => c.contributor === userPubkey)
    const isContributor = !!userContributor

    const progressPercentage =
        split.split_amount > 0 ? (split.received_amount / split.split_amount) * 100 : 0
    const isReadyToRelease =
        split.split_amount > 0 && split.received_amount >= split.split_amount

    const formatAmount = (amount: number): string => {
        const sol = amount / 1000000000
        return sol.toFixed(4)
    }

    const formatDate = (timestamp: number): string => {
        if (!timestamp) return "Not set"
        return new Date(timestamp * 1000).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-20">
            <div className="mb-10">
                <Button
                    onClick={onBack}
                    variant="ghost"
                    className="mb-6 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 transition-all duration-200 rounded-xl px-3 py-2"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Splits
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>

                    <div className="relative bg-gradient-to-br from-white/80 via-white/60 to-zinc-50/80 dark:from-zinc-900/80 dark:via-zinc-900/60 dark:to-zinc-950/80 backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-700/40 rounded-3xl p-8 shadow-xl">
                        <div className="flex items-start justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-300 bg-clip-text text-transparent">
                                        {split.name}
                                    </h1>
                                </div>
                                <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                                    <Shield className="w-4 h-4" />
                                    <span className="font-mono text-sm">{formatAddress(split.id)}</span>
                                    <Button
                                        onClick={() => copyToClipboard(split.id)}
                                        size="sm"
                                        variant="ghost"
                                        aria-label="Copy Split ID"
                                        className="h-7 w-7 p-0 rounded-lg hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 transition-all duration-200"
                                    >
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 justify-end">
                                {isCreator && isContributor ? (
                                    <Badge className="bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-500/20 dark:to-purple-600/20 text-purple-700 dark:text-purple-300 border border-purple-300/50 dark:border-purple-500/30 px-4 py-2 text-sm font-semibold shadow-sm">
                                        <Crown className="w-4 h-4 mr-2" />
                                        Creator & Contributor
                                    </Badge>
                                ) : (
                                    <>
                                        {isCreator && (
                                            <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 text-amber-700 dark:text-amber-300 border border-amber-300/50 dark:border-amber-500/30 px-4 py-2 text-sm font-semibold shadow-sm">
                                                <Crown className="w-4 h-4 mr-2" />
                                                Creator
                                            </Badge>
                                        )}
                                        {isContributor && (
                                            <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-500/20 dark:to-cyan-500/20 text-blue-700 dark:text-blue-300 border border-blue-300/50 dark:border-blue-500/30 px-4 py-2 text-sm font-semibold shadow-sm">
                                                <User className="w-4 h-4 mr-2" />
                                                Contributor
                                            </Badge>
                                        )}
                                    </>
                                )}

                                {split.is_released ? (
                                    <Badge className="bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-500/30 px-4 py-2 text-sm font-semibold shadow-sm">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Released
                                    </Badge>
                                ) : (
                                    <Badge className="bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-700/40 dark:to-zinc-600/40 text-zinc-700 dark:text-zinc-300 border border-zinc-300/50 dark:border-zinc-600/30 px-4 py-2 text-sm font-semibold shadow-sm">
                                        <Clock className="w-4 h-4 mr-2" />
                                        Active
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="group relative overflow-hidden bg-gradient-to-br from-white/90 via-white/80 to-zinc-50/90 dark:from-zinc-900/80 dark:via-zinc-900/70 dark:to-zinc-950/80 backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-700/40 shadow-xl hover:shadow-2xl transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent dark:from-white/5 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl"></div>

                        <CardHeader className="relative z-10">
                            <CardTitle className="flex items-center gap-3 text-xl text-zinc-900 dark:text-zinc-100">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-300/50 dark:border-zinc-700/50 shadow-sm">
                                    <Target className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                                </div>
                                Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8 relative z-10">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-zinc-50/80 to-zinc-100/60 dark:from-zinc-800/50 dark:to-zinc-900/40 border border-zinc-200/60 dark:border-zinc-700/40 backdrop-blur-sm shadow-inner">
                                    <div className="flex items-center gap-2 mb-3">
                                        <DollarSign className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                                        <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                                            Target Amount
                                        </span>
                                    </div>
                                    <p className="text-3xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                                        ◎ {formatAmount(split.split_amount)}
                                    </p>
                                </div>

                                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-green-50/60 dark:from-emerald-900/20 dark:to-green-900/15 border border-emerald-200/60 dark:border-emerald-700/40 backdrop-blur-sm shadow-inner">
                                    <div className="flex items-center gap-2 mb-3">
                                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                                            Collected
                                        </span>
                                    </div>
                                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                        ◎ {formatAmount(split.received_amount)}
                                    </p>
                                </div>
                            </div>

                            {!split.is_released && (
                                <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-zinc-50/60 to-zinc-100/40 dark:from-zinc-800/40 dark:to-zinc-900/30 border border-zinc-200/40 dark:border-zinc-700/30 backdrop-blur-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
                                            Progress
                                        </span>
                                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/60 px-3 py-1 rounded-full">
                                            {Math.round(progressPercentage)}% complete
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <Progress
                                            value={Math.min(progressPercentage, 100)}
                                            className="h-4 bg-zinc-200/80 dark:bg-zinc-700/60 rounded-full overflow-hidden shadow-inner"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-cyan-400/20 rounded-full opacity-50"></div>
                                    </div>
                                    {isReadyToRelease && (
                                        <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-emerald-50/80 to-green-50/60 dark:from-emerald-900/30 dark:to-green-900/20 border border-emerald-200/60 dark:border-emerald-700/40">
                                            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                                                Ready to release payment
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="group relative overflow-hidden bg-gradient-to-br from-white/90 via-white/80 to-zinc-50/90 dark:from-zinc-900/80 dark:via-zinc-900/70 dark:to-zinc-950/80 backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-700/40 shadow-xl hover:shadow-2xl transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent dark:from-white/5 pointer-events-none"></div>

                        <CardHeader className="relative z-10">
                            <CardTitle className="flex items-center gap-3 text-xl text-zinc-900 dark:text-zinc-100">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-300/50 dark:border-zinc-700/50 shadow-sm">
                                    <Users className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                                </div>
                                Contributors ({split.contributors.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="space-y-4">
                                {split.contributors.map((contributor, index) => (
                                    <div
                                        key={`${contributor.contributor}-${index}`}
                                        className="group/item relative p-5 rounded-2xl bg-gradient-to-br from-zinc-50/80 to-zinc-100/60 dark:from-zinc-800/50 dark:to-zinc-900/40 border border-zinc-200/60 dark:border-zinc-700/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div
                                                        className={`w-4 h-4 rounded-full shadow-sm ${contributor.has_cleared
                                                            ? "bg-gradient-to-r from-emerald-500 to-green-500"
                                                            : "bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-700"
                                                            }`}
                                                    />
                                                    {contributor.has_cleared && (
                                                        <div className="absolute inset-0 w-4 h-4 rounded-full bg-emerald-400 animate-ping opacity-30"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                            {formatAddress(contributor.contributor)}
                                                        </p>
                                                        {contributor.contributor === userPubkey && (
                                                            <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-500/20 dark:to-blue-600/20 text-blue-700 dark:text-blue-300 border border-blue-300/50 dark:border-blue-500/30 text-xs px-2 py-0.5">
                                                                You
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {contributor.has_cleared && contributor.cleared_at > 0 && (
                                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                                            Paid on {formatDate(contributor.cleared_at)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                                    {contributor.percent}%
                                                </p>
                                                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                                    ◎{" "}
                                                    {formatAmount(
                                                        (split.split_amount * contributor.percent) / 100
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">

                    <Card className="group relative overflow-hidden bg-gradient-to-br from-white/90 via-white/80 to-zinc-50/90 dark:from-zinc-900/80 dark:via-zinc-900/70 dark:to-zinc-950/80 backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-700/40 shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent dark:from-white/5 pointer-events-none"></div>
                        <CardHeader className="relative z-10">
                            <CardTitle className="text-xl text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Key Details
                            </CardTitle>
                        </CardHeader>
                    
                        <CardContent className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                                    Split Authority
                                </label>
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/40">
                                    <p className="font-mono text-sm text-zinc-900 dark:text-zinc-100 flex-1">
                                        {formatAddress(split.split_authority)}
                                    </p>
                                    <Button
                                        onClick={() => copyToClipboard(split.split_authority)}
                                        size="sm"
                                        variant="ghost"
                                        aria-label="Copy Split Authority"
                                        className="h-7 w-7 p-0 rounded-lg hover:bg-zinc-200/80 dark:hover:bg-zinc-700/60"
                                    >
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                                    Receiver
                                </label>
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/40">
                                    <p className="font-mono text-sm text-zinc-900 dark:text-zinc-100 flex-1">
                                        {formatAddress(split.receiver)}
                                    </p>
                                    <Button
                                        onClick={() => copyToClipboard(split.receiver)}
                                        size="sm"
                                        variant="ghost"
                                        aria-label="Copy Receiver"
                                        className="h-7 w-7 p-0 rounded-lg hover:bg-zinc-200/80 dark:hover:bg-zinc-700/60"
                                    >
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>

                            {split.is_released && (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                                        Released At
                                    </label>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-700/40">
                                        <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                                            {formatDate(split.released_at)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {!split.is_released && (
                        <Card className="group relative overflow-hidden bg-gradient-to-br from-white/90 via-white/80 to-zinc-50/90 dark:from-zinc-900/80 dark:via-zinc-900/70 dark:to-zinc-950/80 backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-700/40 shadow-xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent dark:from-white/5 pointer-events-none"></div>

                            <CardHeader className="relative z-10">
                                <CardTitle className="text-xl text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Available Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 relative z-10">
                                {isCreator && (
                                    <Button
                                        onClick={() => onRelease(split.receiver, split.name)}
                                        disabled={!isReadyToRelease}
                                        className="w-full h-12 bg-gradient-to-r from-zinc-800 to-zinc-900 dark:from-zinc-200 dark:to-zinc-300 text-zinc-100 dark:text-zinc-900 hover:from-zinc-700 hover:to-zinc-800 dark:hover:from-zinc-100 dark:hover:to-zinc-200 disabled:from-zinc-300 disabled:to-zinc-400 dark:disabled:from-zinc-700 dark:disabled:to-zinc-800 disabled:text-zinc-500 dark:disabled:text-zinc-400 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl"
                                    >
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Release Payment
                                    </Button>
                                )}

                                {isContributor && userContributor && (
                                    <Button
                                        onClick={() => onContribute(split.receiver, split.name)}
                                        disabled={userContributor.has_cleared}
                                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 disabled:from-blue-200 disabled:to-cyan-200 disabled:text-zinc-300 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl"
                                    >
                                        <Wallet className="w-5 h-5 mr-2" />
                                        {userContributor.has_cleared
                                            ? "Contribution Complete"
                                            : "Contribute Now"}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SplitDetailsPage