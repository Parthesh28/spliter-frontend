import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import SplitIDL from '../../lib/idl/spliter.json'
import type { Spliter } from '../../lib/types/spliter'

export { Spliter, SplitIDL }

export const SPLIT_PROGRAM_ID = new PublicKey(SplitIDL.address)

export function getSpliterProgram(provider: AnchorProvider, address?: PublicKey): Program<Spliter> {
    return new Program({ ...SplitIDL, address: address ? address.toBase58() : SplitIDL.address } as Spliter, provider)
}

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