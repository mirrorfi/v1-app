import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CreatePage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Base Grid Pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            backgroundPosition: "center center",
          }}
        />
      </div>





    </main>
  )
}