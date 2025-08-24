  import { Split } from "lucide-react"
  import { WalletButton } from "./solana/solana-provider"
  import { ThemeSelect } from "./theme-select"

  export default function Navbar() {
    return (
      <header
        className="
          fixed top-4 left-1/2 -translate-x-1/2 z-50
          w-[90%] max-w-4xl   /* 👈 responsive width */
          rounded-full px-4 sm:px-6 py-2 sm:py-3
          backdrop-blur-xl
          bg-white/70 border border-zinc-200/50 shadow-lg shadow-zinc-900/5
          dark:bg-zinc-900/70 dark:border-zinc-700/50 dark:shadow-zinc-900/20
        "
      >
        <div className="flex items-center justify-between w-full">
          {/* Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Logo/Icon */}
            <div
              className="
                w-7 h-7 sm:w-8 sm:h-8 rounded-lg 
                bg-gradient-to-br from-zinc-200 to-zinc-100 border border-zinc-300/70
                dark:from-zinc-700 dark:to-zinc-800 dark:border-zinc-600/50
                flex items-center justify-center
              "
            >
              <Split className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700 dark:text-zinc-200" />
            </div>

            {/* Brand Text */}
            <div className="text-base sm:text-lg font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
              SPLITER
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <WalletButton />
            <ThemeSelect />
          </div>
        </div>
      </header>
    )
  }
