export type BuildGatewayTransactionResponse = {
  result: {
    transaction: string;
    latestBlockhash: {
      blockhash: string;
      lastValidBlockHeight: string;
    };
  };
}

export type DeliveryResult = {
  result?: string;
  error?: {
    code: number,
	message: string
  }
};