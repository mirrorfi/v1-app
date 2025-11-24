import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Vault from "@/lib/database/models/vault";

/** 
 * POST /api/vault/database
 * Creates a new vault entry in the database
 * Body: { vaultAddress: string, description: string }
 * 
 * Used to store description of vaults so users can edit it
 * 
 * NOTE: NOT IMPLEMENTED EDIT
*/
export async function POST(req: NextRequest) {
  try{
    await connectToDatabase();

    const { vaultAddress, description } = await req.json();
    
    if (!vaultAddress || !description) {
      return NextResponse.json(
        { error: "Missing vaultAddress or description in request body" }, 
        { status: 400 }
      );
    }

    const newVault = await Vault.create({
      vaultAddress,
      description,
    });

    return NextResponse.json({ 
      success: true,
      message: "New vault created",
      vault: newVault,
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating vault:", error);
    return NextResponse.json(
      { error: "Failed to create vault" }, 
      { status: 500 }
    );
  }
}