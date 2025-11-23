"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GridStyleBackground } from "@/components/ui/GridStyleBackground"
import { Navbar } from "@/components/Navbar"
import { useIsMobile } from "@/lib/hooks/useIsMobile"

export default function CreatePage() {
    const isMobile = useIsMobile()

    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-black">
        {/* Base Grid Pattern */}
        <GridStyleBackground />
        {!isMobile && <Navbar />}

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
                <h1 className="text-4xl font-bold text-white mb-6">Coming Soon!</h1>
            </div>
        </main>
    )
}