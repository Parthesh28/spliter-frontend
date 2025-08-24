import React from 'react'
import { Github, ExternalLink } from 'lucide-react'

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Brand/Credits */}
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span>Built</span>
            <span>using</span>
            <a
              href="https://github.com/solana-developers/create-solana-dapp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
            >
              <span className="font-medium">create-solana-dapp</span>
              <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* Center - App Info */}
          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
              <span>Solana Devnet</span>
            </div>
            <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700"></div>
            <span>Spliter v1.0</span>
          </div>

          {/* Right side - Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              aria-label="View source code"
            >
              <Github className="w-4 h-4" />
            </a>
            <div className="text-xs text-zinc-400 dark:text-zinc-600">
              © 2025 Spliter
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}