import Link from "next/link";
import { cn } from "@/lib/utils";

export function Flipbook() {
  return (
    <div className="w-full md:w-3/5 pr-4 md:pr-8 lg:pr-12 border border-zinc-800 bg-black">
      <div className="aspect-[3/2] bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block px-4 py-2 border border-zinc-700 bg-black text-zinc-600 rounded text-sm">
            Flipbook
          </div>
          <div className="mt-4">
            <div className="text-zinc-600">154</div>
            <div className="text-zinc-600">155</div>
          </div>
        </div>
        <p className="mt-4 text-sm text-zinc-500">
          Deep Interconnection, Intercomparison and Re-use
        </p>
      </div>
    </div>
  );
}
