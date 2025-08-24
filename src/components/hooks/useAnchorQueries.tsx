'use client'

import { getSpliterProgram, getSpliterProgramId } from '../solana/anchor-provider'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, PublicKey, SystemProgram } from '@solana/web3.js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../use-transaction-toast'
import { toast } from 'sonner'
import * as anchor from '@coral-xyz/anchor'
import crypto from 'crypto'

export type Spliter = {
    contributor: PublicKey,
    percent: anchor.BN,
    has_cleared: boolean,
    cleared_at: anchor.BN,
}

export function useSpliterProgram() {
    const { connection } = useConnection()
    const { cluster } = useCluster()
    const transactionToast = useTransactionToast()
    const provider = useAnchorProvider()
    const queryClient = useQueryClient()
    const programId = useMemo(() => getSpliterProgramId("devnet" as Cluster), [])
    const program = useMemo(() => getSpliterProgram(provider, programId), [provider, programId])

    // Helper function to invalidate and refetch all splits data
    const refreshSplitsData = () => {
        queryClient.invalidateQueries({ queryKey: ['get-all-splits'] })
        queryClient.invalidateQueries({ queryKey: ['get-program-account'] })
    }

    const getProgramAccount = useQuery({
        queryKey: ['get-program-account', { cluster }],
        queryFn: () => connection.getParsedAccountInfo(programId),
    })

    const getAllSplits = useQuery({
        queryKey: ['get-all-splits', { cluster }],
        queryFn: async () => {
            return await program.account.split.all()
        }
    })

    const createSplit = useMutation({
        mutationKey: ['split', 'createSplit', { cluster }],
        mutationFn: (data: { receiver: PublicKey, name: string, total_amount: anchor.BN, contributor: Spliter[], }) => {
            const hexString = crypto.createHash('sha256').update(data.name, 'utf-8').digest('hex');
            const name_seed = Uint8Array.from(Buffer.from(hexString, 'hex'));

            const [splitPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("SPLIT_SEED"), data.receiver.toBuffer(), name_seed],
                program.programId
            );
            // @ts-expect-error thing is working fine
            // @ts-nocheck
            return program.methods.createSplit(data.receiver, data.name, data.total_amount, data.contributor).accountsStrict({
                split: splitPda,
                splitAuthority: provider.publicKey,
                systemProgram: SystemProgram.programId,
            }).rpc()
        },
        onSuccess: (signature) => {
            // Show success toast with custom message
            transactionToast(signature, {
                title: 'Split Created Successfully! 🎉',
                description: 'Your payment split is now live and ready for contributions'
            })
            // Refresh the data to show the new split
            refreshSplitsData()
        },
        onError: (error) => {
            console.error('Create split error:', error)
            toast.error('Failed to Create Split', {
                description: 'Please check your wallet connection and try again',
                duration: 6000,
            })
        },
    })

    const contributeSplit = useMutation({
        mutationKey: ['split', 'contributeSplit', { cluster }],
        mutationFn: (data: { receiver: PublicKey, name: string }) => {
            const hexString = crypto.createHash('sha256').update(data.name, 'utf-8').digest('hex');
            const name_seed = Uint8Array.from(Buffer.from(hexString, 'hex'));

            const [splitPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("SPLIT_SEED"), data.receiver.toBuffer(), name_seed],
                program.programId
            );

            return program.methods.contributeSplit().accountsStrict({
                split: splitPda,
                contributor: provider.publicKey,
                systemProgram: SystemProgram.programId,
            }).rpc()
        },
        onSuccess: (signature) => {
            // Show success toast with custom message
            transactionToast(signature, {
                title: 'Contribution Successful! 💰',
                description: 'Your contribution has been recorded on the blockchain'
            })
            // Refresh the data to show updated contribution status
            refreshSplitsData()
        },
        onError: (error) => {
            console.error('Contribute split error:', error)
            toast.error('Contribution Failed', {
                description: 'Unable to process your contribution. Please try again.',
                duration: 6000,
            })
        },
    })

    const releaseSplit = useMutation({
        mutationKey: ['split', 'releaseSplit', { cluster }],
        mutationFn: (data: { receiver: PublicKey, name: string }) => {
            const hexString = crypto.createHash('sha256').update(data.name, 'utf-8').digest('hex');
            const name_seed = Uint8Array.from(Buffer.from(hexString, 'hex'));

            const [splitPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("SPLIT_SEED"), data.receiver.toBuffer(), name_seed],
                program.programId
            );

            return program.methods.releaseSplit().accountsStrict({
                split: splitPda,
                splitAuthority: provider.publicKey,
                receiver: data.receiver,
                systemProgram: SystemProgram.programId,
            }).rpc()
        },
        onSuccess: (signature) => {
            // Show success toast with custom message
            transactionToast(signature, {
                title: 'Funds Released! 🚀',
                description: 'The split funds have been successfully released to the receiver'
            })
            // Refresh the data to show updated release status
            refreshSplitsData()
        },
        onError: (error) => {
            console.error('Release split error:', error)
            toast.error('Release Failed', {
                description: 'Unable to release funds. Please verify you have the required permissions.',
                duration: 6000,
            })
        },
    })

    return {
        provider,
        program,
        programId,
        getProgramAccount,
        createSplit,
        getAllSplits,
        contributeSplit,
        releaseSplit,
    }
}