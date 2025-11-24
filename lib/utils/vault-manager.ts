export async function createVault(
  vaultAddress: string,
  description: string
): Promise<{
    success: boolean;
    vault?: any;
    error?: string;
}> {
  try {
    const response = await fetch('/api/vault/database', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vaultAddress, description }),
    });
    const data = await response.json();

    if (!response.ok) {
        console.error('Failed to create vault:', data.error);
        return { success: false, error: data.error };
    }
    return {
        success: true,
        vault: data.vault,
    };
    } catch (error) {
    console.error('Error creating vault:', error);
    return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}