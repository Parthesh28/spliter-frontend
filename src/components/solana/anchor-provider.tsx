// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import SplitIDL from '../../lib/idl/spliter.json'
import type { Spliter } from '../../lib/types/spliter'

// Re-export the generated IDL and type
export { Spliter, SplitIDL }

// The programId is imported from the program IDL.
export const SPLIT_PROGRAM_ID = new PublicKey(SplitIDL.address)

// This is a helper function to get the Basic Anchor program.
export function getSpliterProgram(provider: AnchorProvider, address?: PublicKey): Program<Spliter> {
    return new Program({ ...SplitIDL, address: address ? address.toBase58() : SplitIDL.address } as Spliter, provider)
}

// This is a helper function to get the program ID for the Basic program depending on the cluster.
export function getSpliterProgramId(cluster: Cluster) {
    switch (cluster) {
        case 'devnet':
            return SPLIT_PROGRAM_ID;

        case 'testnet':
            return SPLIT_PROGRAM_ID;

        case 'mainnet-beta':
            return SPLIT_PROGRAM_ID;

        default:
            return SPLIT_PROGRAM_ID;
    }
}