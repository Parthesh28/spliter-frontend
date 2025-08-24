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
    DollarSign
} from "lucide-react"

// Types for the split details
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
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                        Split Not Found
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                        The split you are looking for does not  exist or you do not have access to it
                    </p>
                    <Button onClick={onBack} variant="outline">
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
        <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <Button
                    onClick={onBack}
                    variant="ghost"
                    className="mb-4 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Splits
                </Button>

                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                            {split.name}
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                            <span className="font-mono">{formatAddress(split.id)}</span>
                            <Button
                                onClick={() => copyToClipboard(split.id)}
                                size="sm"
                                variant="ghost"
                                aria-label="Copy Split ID"
                                className="h-6 w-6 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                                <Copy className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2">
                        {isCreator && isContributor ? (
                            <Badge className="bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30">
                                <Crown className="w-3 h-3 mr-1" />
                                Creator & Contributor
                            </Badge>
                        ) : (
                            <>
                                {isCreator && (
                                    <Badge className="bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30">
                                        <Crown className="w-3 h-3 mr-1" />
                                        Creator
                                    </Badge>
                                )}
                                {isContributor && (
                                    <Badge className="bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30">
                                        <User className="w-3 h-3 mr-1" />
                                        Contributor
                                    </Badge>
                                )}
                            </>
                        )}

                        {split.is_released ? (
                            <Badge className="bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Released
                            </Badge>
                        ) : (
                            <Badge className="bg-zinc-100 dark:bg-zinc-500/15 text-zinc-700 dark:text-zinc-400 border-zinc-200 dark:border-zinc-500/30">
                                <Clock className="w-3 h-3 mr-1" />
                                Active
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info Cards */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Financial Overview */}
                    <Card className="bg-zinc-50 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-700/50 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg text-zinc-900 dark:text-zinc-100">
                                <Target className="w-5 h-5" />
                                Financial Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/30 border border-zinc-200/50 dark:border-zinc-700/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                            Target Amount
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                        ◎ {formatAmount(split.split_amount)}
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/30 border border-zinc-200/50 dark:border-zinc-700/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Wallet className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                            Collected
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                        ◎ {formatAmount(split.received_amount)}
                                    </p>
                                </div>
                            </div>

                            {!split.is_released && (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                            Progress
                                        </span>
                                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                            {Math.round(progressPercentage)}% complete
                                        </span>
                                    </div>
                                    <Progress
                                        value={Math.min(progressPercentage, 100)}
                                        className="h-3 bg-zinc-200 dark:bg-zinc-700/40"
                                    />
                                    {isReadyToRelease && (
                                        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                            ✨ Ready to release payment
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Contributors */}
                    <Card className="bg-zinc-50 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-700/50 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg text-zinc-900 dark:text-zinc-100">
                                <Users className="w-5 h-5" />
                                Contributors ({split.contributors.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {split.contributors.map((contributor, index) => (
                                    <div
                                        key={`${contributor.contributor}-${index}`}
                                        className="flex items-center justify-between p-4 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/30 border border-zinc-200/50 dark:border-zinc-700/30"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-3 h-3 rounded-full ${contributor.has_cleared
                                                        ? "bg-emerald-500"
                                                        : "bg-zinc-300 dark:bg-zinc-600"
                                                    }`}
                                            />
                                            <div>
                                                <p className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
                                                    {formatAddress(contributor.contributor)}
                                                    {contributor.contributor === userPubkey && (
                                                        <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                                                            (You)
                                                        </span>
                                                    )}
                                                </p>
                                                {contributor.has_cleared && contributor.cleared_at > 0 && (
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                        Paid on {formatDate(contributor.cleared_at)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                                {contributor.percent}%
                                            </p>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                                ◎{" "}
                                                {formatAmount(
                                                    (split.split_amount * contributor.percent) / 100
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Key Details */}
                    <Card className="bg-zinc-50 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-700/50 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg text-zinc-900 dark:text-zinc-100">
                                Key Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                    Split Authority
                                </label>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
                                        {formatAddress(split.split_authority)}
                                    </p>
                                    <Button
                                        onClick={() => copyToClipboard(split.split_authority)}
                                        size="sm"
                                        variant="ghost"
                                        aria-label="Copy Split Authority"
                                        className="h-6 w-6 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    >
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                    Receiver
                                </label>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
                                        {formatAddress(split.receiver)}
                                    </p>
                                    <Button
                                        onClick={() => copyToClipboard(split.receiver)}
                                        size="sm"
                                        variant="ghost"
                                        aria-label="Copy Receiver"
                                        className="h-6 w-6 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    >
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>

                            {split.is_released && (
                                <div>
                                    <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                        Released At
                                    </label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                                        <p className="text-sm text-zinc-900 dark:text-zinc-100">
                                            {formatDate(split.released_at)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    {!split.is_released && (
                        <Card className="bg-zinc-50 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-700/50 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg text-zinc-900 dark:text-zinc-100">
                                    Available Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Case 1: Creator only */}
                                {isCreator && !isContributor && (
                                    <Button
                                        onClick={() => onRelease(split.receiver, split.name)}
                                        disabled={!isReadyToRelease}
                                        className="w-full h-10 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:bg-zinc-300 dark:disabled:bg-zinc-700/50 disabled:text-zinc-500 dark:disabled:text-zinc-400 font-medium transition-colors"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Release Payment
                                    </Button>
                                )}

                                {/* Case 2: Creator + Contributor */}
                                {isCreator && isContributor && userContributor && (
                                    <>
                                        <Button
                                            onClick={() => onRelease(split.receiver, split.name)}
                                            disabled={!isReadyToRelease}
                                            className="w-full h-10 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:bg-zinc-300 dark:disabled:bg-zinc-700/50 disabled:text-zinc-500 dark:disabled:text-zinc-400 font-medium transition-colors"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Release Payment
                                        </Button>
                                        <Button
                                            onClick={() =>onContribute(split.receiver, split.name)}
                                            disabled={userContributor.has_cleared}
                                            variant="outline"
                                            className="w-full h-10 bg-transparent border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:bg-zinc-100/50 dark:disabled:bg-zinc-700/50 disabled:text-zinc-400 dark:disabled:text-zinc-500 font-medium transition-colors"
                                        >
                                            <Wallet className="w-4 h-4 mr-2" />
                                            Pay Your {userContributor.percent}% (◎{" "}
                                            {formatAmount(
                                                (split.split_amount * userContributor.percent) / 100
                                            )}
                                            )
                                        </Button>
                                    </>
                                )}

                                {/* Case 3: Contributor only */}
                                {!isCreator && isContributor && userContributor && (
                                    <Button
                                        onClick={() => onContribute(split.receiver, split.name)}
                                        disabled={userContributor.has_cleared}
                                        variant="outline"
                                        className="w-full h-10 bg-transparent border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:bg-zinc-100/50 dark:disabled:bg-zinc-700/50 disabled:text-zinc-400 dark:disabled:text-zinc-500 font-medium transition-colors"
                                    >
                                        <Wallet className="w-4 h-4 mr-2" />
                                        Pay Your {userContributor.percent}% (◎{" "}
                                        {formatAmount(
                                            (split.split_amount * userContributor.percent) / 100
                                        )}
                                        )
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
