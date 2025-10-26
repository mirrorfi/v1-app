/**
 * Example: How to integrate activity logging into your transaction handlers
 * 
 * This file shows practical examples of when and how to log activities
 */

import { logActivity } from '@/lib/utils/activity-logger';
import { PublicKey } from '@solana/web3.js';

// ============================================================================
// EXAMPLE 1: Deposit Transaction Handler
// ============================================================================

export async function handleVaultDeposit(
  publicKey: PublicKey,
  vaultAddress: string,
  tokenSymbol: string,
  amount: number,
  connection: any
) {
  try {
    // 1. Execute the actual deposit transaction
    console.log('Executing deposit transaction...');
    const signature = await executeDepositTransaction(
      publicKey,
      vaultAddress,
      amount,
      connection
    );
    
    // 2. Wait for confirmation
    await connection.confirmTransaction(signature, 'confirmed');
    
    // 3. Get USD value (from price API or oracle)
    const tokenPriceUsd = await getTokenPriceUSD(tokenSymbol);
    const amountInUsd = (amount * tokenPriceUsd).toFixed(2);
    
    // 4. Log the activity
    const logResult = await logActivity({
      wallet: publicKey.toBase58(),
      activity: 'deposit',
      vault: vaultAddress,
      token: tokenSymbol,
      amount: amount.toString(),
      amountInUsd: amountInUsd,
      txHash: signature,
      metadata: {
        timestamp: new Date().toISOString(),
        network: 'mainnet-beta',
      }
    });
    
    if (!logResult.success) {
      console.error('Failed to log activity:', logResult.error);
      // Note: Transaction succeeded, just logging failed - that's okay
    }
    
    return { success: true, signature };
  } catch (error) {
    console.error('Deposit failed:', error);
    return { success: false, error };
  }
}

// ============================================================================
// EXAMPLE 2: Withdrawal Transaction Handler
// ============================================================================

export async function handleVaultWithdraw(
  publicKey: PublicKey,
  vaultAddress: string,
  tokenSymbol: string,
  amount: number,
  connection: any
) {
  try {
    console.log('Executing withdrawal transaction...');
    const signature = await executeWithdrawTransaction(
      publicKey,
      vaultAddress,
      amount,
      connection
    );
    
    await connection.confirmTransaction(signature, 'confirmed');
    
    const tokenPriceUsd = await getTokenPriceUSD(tokenSymbol);
    const amountInUsd = (amount * tokenPriceUsd).toFixed(2);
    
    // Log withdrawal activity
    await logActivity({
      wallet: publicKey.toBase58(),
      activity: 'withdraw',
      vault: vaultAddress,
      token: tokenSymbol,
      amount: amount.toString(),
      amountInUsd: amountInUsd,
      txHash: signature,
    });
    
    return { success: true, signature };
  } catch (error) {
    console.error('Withdrawal failed:', error);
    return { success: false, error };
  }
}

// ============================================================================
// EXAMPLE 3: Token Swap Handler
// ============================================================================

export async function handleTokenSwap(
  publicKey: PublicKey,
  fromToken: string,
  toToken: string,
  fromAmount: number,
  toAmount: number,
  connection: any
) {
  try {
    console.log('Executing swap transaction...');
    const signature = await executeSwapTransaction(
      publicKey,
      fromToken,
      toToken,
      fromAmount,
      connection
    );
    
    await connection.confirmTransaction(signature, 'confirmed');
    
    // Calculate USD value based on output token
    const toTokenPriceUsd = await getTokenPriceUSD(toToken);
    const amountInUsd = (toAmount * toTokenPriceUsd).toFixed(2);
    
    // Log swap activity
    await logActivity({
      wallet: publicKey.toBase58(),
      activity: 'swap',
      token: `${fromToken}->${toToken}`,
      amount: toAmount.toString(),
      amountInUsd: amountInUsd,
      txHash: signature,
      metadata: {
        fromToken,
        toToken,
        fromAmount: fromAmount.toString(),
        toAmount: toAmount.toString(),
        swapProtocol: 'Jupiter', // or whatever protocol you use
      }
    });
    
    return { success: true, signature };
  } catch (error) {
    console.error('Swap failed:', error);
    return { success: false, error };
  }
}

// ============================================================================
// EXAMPLE 4: Vault Creation Handler
// ============================================================================

export async function handleVaultCreate(
  publicKey: PublicKey,
  vaultName: string,
  depositToken: string,
  connection: any
) {
  try {
    console.log('Creating new vault...');
    const { signature, vaultAddress } = await executeVaultCreateTransaction(
      publicKey,
      vaultName,
      depositToken,
      connection
    );
    
    await connection.confirmTransaction(signature, 'confirmed');
    
    // Log vault creation
    await logActivity({
      wallet: publicKey.toBase58(),
      activity: 'vault_create',
      vault: vaultAddress,
      txHash: signature,
      metadata: {
        vaultName,
        depositToken,
        createdAt: new Date().toISOString(),
      }
    });
    
    return { success: true, signature, vaultAddress };
  } catch (error) {
    console.error('Vault creation failed:', error);
    return { success: false, error };
  }
}

// ============================================================================
// EXAMPLE 5: Strategy Execution Handler
// ============================================================================

export async function handleStrategyExecute(
  publicKey: PublicKey,
  vaultAddress: string,
  strategyId: string,
  strategyName: string,
  connection: any
) {
  try {
    console.log('Executing strategy...');
    const signature = await executeStrategyTransaction(
      publicKey,
      vaultAddress,
      strategyId,
      connection
    );
    
    await connection.confirmTransaction(signature, 'confirmed');
    
    // Log strategy execution
    await logActivity({
      wallet: publicKey.toBase58(),
      activity: 'strategy_execute',
      vault: vaultAddress,
      txHash: signature,
      metadata: {
        strategyId,
        strategyName,
        executedAt: new Date().toISOString(),
      }
    });
    
    return { success: true, signature };
  } catch (error) {
    console.error('Strategy execution failed:', error);
    return { success: false, error };
  }
}

// ============================================================================
// Helper Functions (you'll need to implement these based on your app)
// ============================================================================

async function executeDepositTransaction(
  publicKey: PublicKey,
  vaultAddress: string,
  amount: number,
  connection: any
): Promise<string> {
  // Your actual deposit transaction logic here
  // Return transaction signature
  throw new Error('Implement your deposit logic');
}

async function executeWithdrawTransaction(
  publicKey: PublicKey,
  vaultAddress: string,
  amount: number,
  connection: any
): Promise<string> {
  // Your actual withdraw transaction logic here
  throw new Error('Implement your withdraw logic');
}

async function executeSwapTransaction(
  publicKey: PublicKey,
  fromToken: string,
  toToken: string,
  amount: number,
  connection: any
): Promise<string> {
  // Your actual swap transaction logic here
  throw new Error('Implement your swap logic');
}

async function executeVaultCreateTransaction(
  publicKey: PublicKey,
  vaultName: string,
  depositToken: string,
  connection: any
): Promise<{ signature: string; vaultAddress: string }> {
  // Your actual vault creation logic here
  throw new Error('Implement your vault creation logic');
}

async function executeStrategyTransaction(
  publicKey: PublicKey,
  vaultAddress: string,
  strategyId: string,
  connection: any
): Promise<string> {
  // Your actual strategy execution logic here
  throw new Error('Implement your strategy execution logic');
}

async function getTokenPriceUSD(tokenSymbol: string): Promise<number> {
  // Fetch token price from your price API
  // You might use CoinGecko, Jupiter, or your own price oracle
  // For now, return a mock value
  const prices: Record<string, number> = {
    'SOL': 100,
    'USDC': 1,
    'USDT': 1,
  };
  return prices[tokenSymbol] || 0;
}

// ============================================================================
// EXAMPLE 6: Using in a React Component
// ============================================================================

/*
import { useWallet } from '@solana/wallet-adapter-react';
import { getConnection } from '@/lib/solana';
import { handleVaultDeposit } from '@/lib/transaction-handlers';

function DepositButton() {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  
  const handleDeposit = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      const result = await handleVaultDeposit(
        publicKey,
        'VaultAddress123...',
        'SOL',
        0.1,
        getConnection()
      );
      
      if (result.success) {
        toast.success('Deposit successful!');
        // Activity is automatically logged
      } else {
        toast.error('Deposit failed');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button onClick={handleDeposit} disabled={loading}>
      {loading ? 'Depositing...' : 'Deposit'}
    </button>
  );
}
*/
