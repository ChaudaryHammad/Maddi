import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="px-3 py-6">
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <p>© {new Date().getFullYear()} Muhammad Hammad</p>
        <p className="flex items-center gap-1">
          Built with <Heart className="w-3 h-3 text-red-400" fill="currentColor" /> &amp; Next.js
        </p>
      </div>
    </footer>
  );
}
