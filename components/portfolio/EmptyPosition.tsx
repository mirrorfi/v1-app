import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmtpyPosition() {
  const router = useRouter();

  return (
    <Card className="bg-linear-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm rounded-xl shadow-lg mt-12">
      <CardContent className="p-12 text-center">
        <div className="p-4 bg-slate-800/50 rounded-full w-fit mx-auto mb-4">
          <Wallet className="h-12 w-12 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No Positions Yet
        </h3>
        <p className="text-slate-400 mb-6 max-w-md mx-auto">
          You don't have any active positions. Start by depositing into a vault
          to begin your DeFi journey.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Explore Vaults
        </Button>
      </CardContent>
    </Card>
  );
}