import {
  AccountMeta,
  AddressLookupTableAccount,
  Connection,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import { getSwapInstructions } from "../api/swap";
import { Address } from "@coral-xyz/anchor";
import { BigIntString } from "@/types/accounts";
import { CLIENT_CONNECTION } from "./solana";

const EXACT_OUT_ROUTE_DISCRIMINATOR = [208, 51, 239, 151, 123, 43, 237, 92];
const ROUTE_DISCRIMINATOR = [229, 23, 203, 151, 122, 227, 173, 42];
const SHARED_ACCOUNTS_EXACT_OUT_ROUTE_DISCRIMINATOR = [
  176, 209, 105, 168, 154, 125, 69, 62,
];
const SHARED_ACCOUNTS_ROUTE_DISCRIMINATOR = [
  193, 32, 155, 51, 65, 214, 156, 129,
];

function deserializeInstruction(
  instruction: any,
): TransactionInstruction {
  return new TransactionInstruction({
    programId: new PublicKey(instruction.programId),
    keys: instruction.accounts.map((key: any) => ({
      pubkey: new PublicKey(key.pubkey),
      isSigner: key.isSigner,
      isWritable: key.isWritable,
    })),
    data: Buffer.from(instruction.data, "base64"),
  });
}

async function getAddressLookupTableAccounts(
  keys: string[],
  connection: Connection,
): Promise<AddressLookupTableAccount[]> {
  const addressLookupTableAccountInfos =
    await connection.getMultipleAccountsInfo(
      keys.map((key) => new PublicKey(key)),
    );

  return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
    const addressLookupTableAddress = keys[index];
    if (accountInfo) {
      const addressLookupTableAccount = new AddressLookupTableAccount({
        key: new PublicKey(addressLookupTableAddress),
        state: AddressLookupTableAccount.deserialize(new Uint8Array(accountInfo.data)),
      });
      acc.push(addressLookupTableAccount);
    }

    return acc;
  }, new Array<AddressLookupTableAccount>());
}

export async function swap({
  inputMint,
  outputMint,
  amount,
  slippageBps,
  exactOutRoute,
  onlyDirectRoutes,
  userPublicKey,
}: {
  inputMint: Address,
  outputMint: Address,
  amount: BigIntString,
  slippageBps: number,
  exactOutRoute: boolean,
  onlyDirectRoutes: boolean,
  userPublicKey: Address,
}): Promise<{
  swapInstruction: TransactionInstruction;
  computeBudgetInstructions: TransactionInstruction[];
  setupInstructions: TransactionInstruction[];
  addressLookupTableAccounts: AddressLookupTableAccount[];
  remainingAccounts: AccountMeta[];
}> {
  const instructions = await getSwapInstructions({
    inputMint,
    outputMint,
    amount,
    slippageBps,
    exactOutRoute,
    onlyDirectRoutes,
    userPublicKey: userPublicKey.toString(),
  })

  const {
    swapInstruction: swapInstructionPayload, // The actual swap instruction.
    computeBudgetInstructions,
    setupInstructions,
    addressLookupTableAddresses, // The lookup table addresses that you can use if you are using versioned transaction.
  } = instructions;

  const swapInstruction = deserializeInstruction(swapInstructionPayload);

  return {
    swapInstruction,
    computeBudgetInstructions: computeBudgetInstructions.map(
      deserializeInstruction,
    ),
    setupInstructions: setupInstructions.map(deserializeInstruction),
    addressLookupTableAccounts: await getAddressLookupTableAccounts(
      addressLookupTableAddresses,
      CLIENT_CONNECTION,
    ),
    remainingAccounts: extractRemainingAccountsForSwap(
      swapInstruction,
    ).remainingAccounts
  };
}

function arraysEqual(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((val, index) => val === b[index]);
}

export function extractRemainingAccountsForSwap(
  swapInstruction: TransactionInstruction,
): { remainingAccounts: AccountMeta[] } {
  const instructionData = swapInstruction.data;

  // Check discriminator (first 8 bytes)
  const discriminator = Array.from(instructionData.slice(0, 8));

  let remainingAccounts: any[] = [];

  if (arraysEqual(discriminator, ROUTE_DISCRIMINATOR)) {
    // For Route, the first 9 accounts are base accounts
    remainingAccounts = swapInstruction.keys.slice(9);
  } else if (arraysEqual(discriminator, EXACT_OUT_ROUTE_DISCRIMINATOR)) {
    // For ExactOutRoute, the first 11 accounts are base accounts
    remainingAccounts = swapInstruction.keys.slice(11);
  } else if (
    arraysEqual(discriminator, SHARED_ACCOUNTS_EXACT_OUT_ROUTE_DISCRIMINATOR) ||
    arraysEqual(discriminator, SHARED_ACCOUNTS_ROUTE_DISCRIMINATOR)
  ) {
    // For SharedAccounts (ExactOutRoute or Route)
    // The smart contract expects:
    // - remaining_accounts[0] = program authority (position 1 in Jupiter response)
    // - remaining_accounts[1] = program source token account (position 4 in Jupiter response)
    // - remaining_accounts[2] = program destination token account (position 5 in Jupiter response)
    // - remaining_accounts[3+] = all other remaining accounts (position 11+ in Jupiter response)
    const programAuthority = swapInstruction.keys[1]; // position 1
    const programSourceTokenAccount = swapInstruction.keys[4]; // position 4
    const programDestinationTokenAccount = swapInstruction.keys[5]; // position 5
    const otherRemainingAccounts = swapInstruction.keys.slice(13); // after position 12 (index 13+)

    remainingAccounts = [
      programAuthority,
      programSourceTokenAccount,
      programDestinationTokenAccount,
      ...otherRemainingAccounts,
    ];
  } else {
    throw new Error(`Unknown discriminator: ${discriminator}`);
  }

  return {
    remainingAccounts,
  };
}
