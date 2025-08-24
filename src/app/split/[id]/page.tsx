"use client"
import React, { use } from 'react'
import { useSpliterProgram } from '@/components/hooks/useAnchorQueries'
import SplitDetailsPage from '@/components/split-details'
import { useRouter } from 'next/navigation'
import { PublicKey } from '@solana/web3.js'

// Props interface for better type safety

// This is the actual Next.js page component
export default function SplitPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const { getAllSplits, provider, contributeSplit, releaseSplit} = useSpliterProgram()
    const { data: programAccounts } = getAllSplits


    // Use React.useMemo to memoize the id

    // Alternative approach using useEffect for promise resolution
    const [splitId, setSplitId] = React.useState<string | null>(null)

    React.useEffect(() => {
        const resolveParams = async () => {
            try {
                const resolved = await params
                setSplitId(resolved.id)
            } catch (error) {
                console.error('Error resolving params:', error)
            }
        }

        resolveParams()
    }, [params])

    // Transform the data to find the specific split
    const split = React.useMemo(() => {
        if (!programAccounts || !Array.isArray(programAccounts) || !id) return null

        // Find the split by matching the public key
        const splitAccount = programAccounts.find(
            account => account.publicKey.toString() === id
        )

        if (!splitAccount) return null

        // Transform the data to match the component's expected format
        const { account, publicKey } = splitAccount

        return {
            id: publicKey.toString(),
            name: account.splitName || "Unnamed Split",
            split_authority: account.splitAuthority.toString(),
            receiver: account.receiver.toString(),
            split_amount: account.splitAmount.toNumber(),
            received_amount: account.receivedAmount.toNumber(),
            is_released: account.isReleased,
            released_at: account.releasedAt.toNumber(),
            contributors: account.contributors.map(c => ({
                contributor: c.contributor.toString(),
                percent: c.percent,
                has_cleared: c.hasCleared,
                cleared_at: c.clearedAt.toNumber()
            }))
        }
    }, [programAccounts, id])

    const handleBack = () => {
        router.push('/')
    }

    const handleRelease = async (receiver: string, name: string) => {
        await releaseSplit.mutateAsync({
            receiver: new PublicKey(receiver),
            name: name
        })
    }
    const handleContribute = async (receiver: string, name: string) => {
        await contributeSplit.mutateAsync({
            receiver: new PublicKey(receiver),
            name: name
        })
    }

    // Loading state while resolving params
    if (!id) {
        return (
            <div className="w-full max-w-4xl mx-auto px-4 py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-100 mx-auto mb-4"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">Loading split details...</p>
                </div>
            </div>
        )
    }

    if (!provider?.publicKey) {
        return (
            <div className="w-full max-w-4xl mx-auto px-4 py-20">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                        Please Connect Your Wallet
                    </h1>
                </div>
            </div>
        )
    }

    return (
        <SplitDetailsPage
            split={split}
            userPubkey={provider.publicKey.toString()}
            onBack={handleBack}
            onContribute={handleContribute}
            onRelease={handleRelease}
        />
    )
}