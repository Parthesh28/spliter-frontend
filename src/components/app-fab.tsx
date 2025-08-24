"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, X, Users, Wallet } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { PublicKey } from "@solana/web3.js"
import * as anchor from '@coral-xyz/anchor'
import { Spliter, useSpliterProgram } from "./hooks/useAnchorQueries"

// Conversion constants
const LAMPORTS_PER_SOL = 1_000_000_000

export default function FabCreateSplit() {
    const [isOpen, setIsOpen] = useState(false)
    const [splitName, setSplitName] = useState("")
    const [amount, setAmount] = useState("")
    const [amountError, setAmountError] = useState("")
    const [receiver, setReceiver] = useState("")
    const [contributors, setContributors] = useState([{ wallet: "", percent: "" }])
    const [percentageErrors, setPercentageErrors] = useState<string[]>([""])
    const [totalPercentage, setTotalPercentage] = useState(0)
    const [equalSplit, setEqualSplit] = useState(false)

    const { createSplit } = useSpliterProgram()

    // Calculate total percentage whenever contributors change
    useEffect(() => {
        const total = contributors.reduce((sum, contributor) => {
            const percent = parseFloat(contributor.percent) || 0
            return sum + percent
        }, 0)
        setTotalPercentage(total)
    }, [contributors])

    const handleContributorChange = (index: number, field: "wallet" | "percent", value: string) => {
        const updated = [...contributors]
        updated[index][field] = value
        setContributors(updated)

        // Validate % field
        if (field === "percent") {
            const errors = [...percentageErrors]
            if (value && !/^\d*\.?\d*$/.test(value)) {
                errors[index] = "Invalid number"
            } else if (value && (parseFloat(value) < 0 || parseFloat(value) > 100)) {
                errors[index] = "0-100 only"
            } else {
                errors[index] = ""
            }
            setPercentageErrors(errors)
        }

        if (equalSplit && field === "wallet") {
            distributeEqualSplitForArray(updated, updated.length)
        }
    }

    const addContributor = () => {
        const updated = [...contributors, { wallet: "", percent: "" }]
        setContributors(updated)
        setPercentageErrors([...percentageErrors, ""])
        if (equalSplit) {
            // Need to distribute for the new array length
            distributeEqualSplitForArray(updated, updated.length)
        }
    }

    const removeContributor = (index: number) => {
        if (contributors.length === 1) return
        const updated = contributors.filter((_, i) => i !== index)
        setContributors(updated)
        setPercentageErrors(percentageErrors.filter((_, i) => i !== index))
        if (equalSplit) {
            distributeEqualSplitForArray(updated, updated.length)
        }
    }

    const distributeEqualSplitForArray = (targetArray: { wallet: string; percent: string }[], count: number) => {
        if (count === 0) return

        // Calculate base percentage and remainder
        const basePercent = Math.floor(10000 / count) / 100 // Use 10000 for better precision, then divide by 100
        const remainder = 100 - (basePercent * count)

        // Distribute percentages
        const updatedContributors = targetArray.map((c, index) => {
            if (index >= count) return c // Don't modify contributors beyond the count

            // Add the remainder to the first contributor(s) to make it exactly 100%
            const adjustedPercent = index < Math.round(remainder * 100)
                ? (basePercent + 0.01).toFixed(2)
                : basePercent.toFixed(2)
            return { ...c, percent: adjustedPercent }
        })

        setContributors(updatedContributors)
        setPercentageErrors(new Array(targetArray.length).fill(""))
    }

    const handleAmountChange = (value: string) => {
        setAmount(value)
        if (!value) {
            setAmountError("Required")
        } else if (!/^\d*\.?\d*$/.test(value)) {
            setAmountError("Invalid number")
        } else if (parseFloat(value) <= 0) {
            setAmountError("Must be > 0")
        } else {
            setAmountError("")
        }
    }

    const handleEqualSplitToggle = (checked: boolean) => {
        setEqualSplit(checked)
        if (checked) {
            distributeEqualSplitForArray(contributors, contributors.length)
        }
    }

    const isFormValid = () => {
        const hasAmountError = amountError !== "" || !amount || parseFloat(amount) <= 0
        const hasPercentageErrors = percentageErrors.some((err) => err !== "")
        const hasSumError = totalPercentage !== 100
        const hasEmptyWallets = contributors.some(c => !c.wallet.trim())
        const hasEmptyPercentages = contributors.some(c => !c.percent.trim())

        return !(hasAmountError || hasPercentageErrors || hasSumError || hasEmptyWallets || hasEmptyPercentages || !receiver.trim() || !splitName.trim())
    }

    const handleSubmit = async () => {
        if (!isFormValid()) return

        // Convert SOL to lamports
        const solAmount = parseFloat(amount)
        const lamportAmount = Math.floor(solAmount * LAMPORTS_PER_SOL)

        const data = {
            splitName,
            amount: lamportAmount, // Now in lamports
            receiver,
            contributors: contributors.map(c => ({
                contributor: new PublicKey(c.wallet),
                percent: parseInt(c.percent),
                has_cleared: false,
                cleared_at: new anchor.BN(0)
            })),
            equalSplit,
        }

        await createSplit.mutateAsync({
            receiver: new PublicKey(data.receiver),
            name: data.splitName,
            // @ts-expect-error thing is working fine
            // @ts-nocheck
            contributor: data.contributors as Spliter[],
            total_amount: new anchor.BN(data.amount)
        })

        // Reset form after successful creation
        setIsOpen(false)
        setSplitName("")
        setAmount("")
        setReceiver("")
        setContributors([{ wallet: "", percent: "" }])
        setPercentageErrors([""])
        setEqualSplit(false)
    }

    const getTotalColor = () => {
        if (totalPercentage === 100) return "text-emerald-600 dark:text-emerald-400"
        if (totalPercentage > 100) return "text-red-600 dark:text-red-400"
        return "text-zinc-500 dark:text-zinc-400"
    }

    return (
        <>
            {/* Floating Action Button with improved positioning */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 shadow-lg hover:shadow-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 transition-all duration-200 flex items-center justify-center z-50"
                style={{
                    // This will make the FAB respect footer positioning
                    // You can adjust this based on your footer height
                    marginBottom: 'max(1.5rem, env(keyboard-inset-height, 0px))',
                }}
                aria-label="Create new split"
            >
                <Plus className="h-6 w-6" />
            </button>

            {/* Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[520px] bg-white dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-700/60 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="pb-4">
                        <DialogTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <Users className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                            </div>
                            Create New Split
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Split Name */}
                        <div className="space-y-2">
                            <Label htmlFor="splitName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Split Name
                            </Label>
                            <Input
                                id="splitName"
                                type="text"
                                value={splitName}
                                onChange={(e) => setSplitName(e.target.value)}
                                placeholder="Enter a descriptive name"
                                className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:border-zinc-400 dark:focus:border-zinc-500"
                            />
                        </div>

                        {/* Amount + Equal Split */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="amount" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    Total Amount (SOL)
                                </Label>
                                <Input
                                    id="amount"
                                    type="text"
                                    value={amount}
                                    onChange={(e) => handleAmountChange(e.target.value)}
                                    placeholder="0.00"
                                    className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:border-zinc-400 dark:focus:border-zinc-500"
                                />
                                {amountError && <p className="text-xs text-red-600 dark:text-red-400">{amountError}</p>}
                                {/* Show lamport conversion for reference */}
                                {amount && !amountError && parseFloat(amount) > 0 && (
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        ≈ {(parseFloat(amount) * LAMPORTS_PER_SOL).toLocaleString()} lamports
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    Equal Split
                                </Label>
                                <div className="flex items-center justify-center h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                                    <Switch
                                        checked={equalSplit}
                                        onCheckedChange={handleEqualSplitToggle}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Receiver */}
                        <div className="space-y-2">
                            <Label htmlFor="receiver" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                <Wallet className="w-4 h-4" />
                                Receiver Address
                            </Label>
                            <Input
                                id="receiver"
                                type="text"
                                value={receiver}
                                onChange={(e) => setReceiver(e.target.value)}
                                placeholder="Solana wallet address"
                                className="font-mono text-sm bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:border-zinc-400 dark:focus:border-zinc-500"
                            />
                        </div>

                        {/* Contributors */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Contributors ({contributors.length})
                                </Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Total:</span>
                                    <span className={`text-sm font-semibold ${getTotalColor()}`}>
                                        {totalPercentage.toFixed(1)}%
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {contributors.map((contributor, index) => (
                                    <div key={index} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700/50">
                                        <div className="flex gap-2 items-start">
                                            <div className="flex-1 space-y-1">
                                                <Input
                                                    type="text"
                                                    placeholder="Contributor wallet address"
                                                    value={contributor.wallet}
                                                    onChange={(e) =>
                                                        handleContributorChange(index, "wallet", e.target.value)
                                                    }
                                                    className="font-mono text-sm bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400"
                                                />
                                            </div>
                                            <div className="w-20 space-y-1">
                                                <Input
                                                    type="text"
                                                    placeholder="%"
                                                    value={contributor.percent}
                                                    onChange={(e) =>
                                                        handleContributorChange(index, "percent", e.target.value)
                                                    }
                                                    disabled={equalSplit}
                                                    className="text-center bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                disabled={contributors.length === 1}
                                                onClick={() => removeContributor(index)}
                                                className="text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        {percentageErrors[index] && (
                                            <p className="text-xs text-red-600 dark:text-red-400 mt-1 ml-1">
                                                {percentageErrors[index]}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Percentage validation message */}
                            {totalPercentage !== 100 && totalPercentage > 0 && (
                                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                                    <p className="text-xs text-amber-700 dark:text-amber-400">
                                        {totalPercentage > 100
                                            ? "⚠️ Total percentage exceeds 100%. Please adjust the values."
                                            : "⚠️ Total percentage must equal 100% to create the split."}
                                    </p>
                                </div>
                            )}

                            <Button
                                onClick={addContributor}
                                variant="outline"
                                className="w-full border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Contributor
                            </Button>
                        </div>

                        {/* Submit */}
                        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                            <Button
                                onClick={handleSubmit}
                                disabled={!isFormValid()}
                                className="w-full bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-100 dark:text-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-11"
                            >
                                {isFormValid() ? "Create Split" : "Complete all fields"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}