/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/mirrorfi.json`.
 */
export type Mirrorfi = {
  "address": "M1RtniT4YxLewLRTnJkhEHB41hm7KXRWDtsMp3ZGGbX",
  "metadata": {
    "name": "mirrorfi",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claimManagerFee",
      "discriminator": [
        45,
        176,
        17,
        46,
        196,
        133,
        17,
        238
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "vault"
        },
        {
          "name": "mint"
        },
        {
          "name": "vaultTokenAccount",
          "writable": true
        },
        {
          "name": "managerAuthorityTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": []
    },
    {
      "name": "closeStrategy",
      "discriminator": [
        56,
        247,
        170,
        246,
        89,
        221,
        134,
        200
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "vault"
        },
        {
          "name": "strategy",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "closeVault",
      "discriminator": [
        141,
        103,
        17,
        126,
        72,
        75,
        29,
        29
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "depositMint"
        },
        {
          "name": "vaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "depositMintTokenProgram"
              },
              {
                "kind": "account",
                "path": "depositMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "depositMintTokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "depositVault",
      "discriminator": [
        126,
        224,
        21,
        255,
        228,
        53,
        117,
        33
      ],
      "accounts": [
        {
          "name": "depositor",
          "writable": true,
          "signer": true
        },
        {
          "name": "config"
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "vaultDepositor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "depositor"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "depositMint"
        },
        {
          "name": "depositorTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "depositor"
              },
              {
                "kind": "account",
                "path": "depositMintTokenProgram"
              },
              {
                "kind": "account",
                "path": "depositMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "vaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "depositMintTokenProgram"
              },
              {
                "kind": "account",
                "path": "depositMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "depositMintTokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "depositMintAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "executeStrategyJupiterSwap",
      "discriminator": [
        74,
        119,
        15,
        69,
        226,
        14,
        128,
        52
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "config"
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "strategy",
          "writable": true
        },
        {
          "name": "sourceMint"
        },
        {
          "name": "destinationMint"
        },
        {
          "name": "vaultSourceTokenAccount",
          "writable": true
        },
        {
          "name": "vaultDestinationTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "destinationMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "eventAuthority",
          "address": "D8cy77BBepLMngZx6ZukaTff5hCt1HrWyKk3Hnd9oitf"
        },
        {
          "name": "jupiterProgram",
          "address": "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
        }
      ],
      "args": [
        {
          "name": "swapData",
          "type": "bytes"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "slippageBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "executeStrategyKaminoLend",
      "discriminator": [
        32,
        241,
        253,
        113,
        171,
        25,
        159,
        208
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "config"
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "strategy",
          "writable": true
        },
        {
          "name": "obligation",
          "writable": true
        },
        {
          "name": "lendingMarket"
        },
        {
          "name": "lendingMarketAuthority"
        },
        {
          "name": "reserve",
          "writable": true
        },
        {
          "name": "reserveLiquiditySupply",
          "writable": true
        },
        {
          "name": "reserveDestinationDepositCollateral",
          "writable": true
        },
        {
          "name": "reserveFarmState",
          "writable": true
        },
        {
          "name": "obligationFarmState",
          "writable": true
        },
        {
          "name": "vaultTokenAccount",
          "writable": true
        },
        {
          "name": "liquidityTokenMint"
        },
        {
          "name": "collateralTokenMint",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "liquidityTokenProgram"
        },
        {
          "name": "collateralTokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "instructionsSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "klendProgram",
          "address": "KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD"
        },
        {
          "name": "kfarmsProgram",
          "address": "FarmsPZpWu9i7Kky8tPN37rs2TpmMrAZrC7S7vJa91Hr"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "initFarm",
          "type": "bool"
        }
      ]
    },
    {
      "name": "executeStrategyMeteoraDammV2",
      "discriminator": [
        202,
        101,
        186,
        114,
        96,
        43,
        138,
        69
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "config"
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "strategy",
          "writable": true
        },
        {
          "name": "position",
          "writable": true
        },
        {
          "name": "eventAuthority"
        },
        {
          "name": "pool",
          "writable": true
        },
        {
          "name": "vaultTokenAAccount",
          "writable": true
        },
        {
          "name": "vaultTokenBAccount",
          "writable": true
        },
        {
          "name": "poolTokenAAccount",
          "writable": true
        },
        {
          "name": "poolTokenBAccount",
          "writable": true
        },
        {
          "name": "tokenAMint"
        },
        {
          "name": "tokenBMint"
        },
        {
          "name": "positionNftAccount"
        },
        {
          "name": "tokenAProgram"
        },
        {
          "name": "tokenBProgram"
        },
        {
          "name": "cpAmmProgram",
          "address": "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "addLiquidityParameters"
            }
          }
        }
      ]
    },
    {
      "name": "exitStrategyJupiterSwap",
      "discriminator": [
        38,
        44,
        63,
        16,
        138,
        12,
        247,
        207
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "config"
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "strategy",
          "writable": true
        },
        {
          "name": "sourceMint"
        },
        {
          "name": "destinationMint"
        },
        {
          "name": "vaultSourceTokenAccount",
          "writable": true
        },
        {
          "name": "vaultDestinationTokenAccount",
          "writable": true
        },
        {
          "name": "treasuryTokenAccount",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "destinationTokenProgram"
        },
        {
          "name": "sourceTokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "eventAuthority",
          "address": "D8cy77BBepLMngZx6ZukaTff5hCt1HrWyKk3Hnd9oitf"
        },
        {
          "name": "jupiterProgram",
          "address": "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
        }
      ],
      "args": [
        {
          "name": "swapData",
          "type": "bytes"
        },
        {
          "name": "swapInAmount",
          "type": "u64"
        },
        {
          "name": "slippageBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "exitStrategyKaminoLend",
      "discriminator": [
        55,
        222,
        230,
        236,
        18,
        214,
        215,
        0
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "config"
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "strategy",
          "writable": true
        },
        {
          "name": "obligation",
          "writable": true
        },
        {
          "name": "lendingMarket"
        },
        {
          "name": "lendingMarketAuthority"
        },
        {
          "name": "reserve",
          "writable": true
        },
        {
          "name": "reserveLiquiditySupply",
          "writable": true
        },
        {
          "name": "reserveSourceCollateral",
          "writable": true
        },
        {
          "name": "reserveFarmState",
          "writable": true
        },
        {
          "name": "obligationFarmState",
          "writable": true
        },
        {
          "name": "vaultTokenAccount",
          "writable": true
        },
        {
          "name": "liquidityTokenMint"
        },
        {
          "name": "collateralTokenMint",
          "writable": true
        },
        {
          "name": "treasuryTokenAccount",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "liquidityTokenProgram"
        },
        {
          "name": "collateralTokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "instructionsSysvar"
        },
        {
          "name": "klendProgram",
          "address": "KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD"
        },
        {
          "name": "kfarmsProgram",
          "address": "FarmsPZpWu9i7Kky8tPN37rs2TpmMrAZrC7S7vJa91Hr"
        }
      ],
      "args": [
        {
          "name": "collateralAmount",
          "type": "u64"
        },
        {
          "name": "hasFarm",
          "type": "bool"
        }
      ]
    },
    {
      "name": "exitStrategyMeteoraDammV2",
      "discriminator": [
        252,
        113,
        233,
        217,
        228,
        59,
        121,
        32
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "config"
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "strategy",
          "writable": true
        },
        {
          "name": "position",
          "writable": true
        },
        {
          "name": "eventAuthority"
        },
        {
          "name": "poolAuthority"
        },
        {
          "name": "pool"
        },
        {
          "name": "vaultTokenAAccount",
          "writable": true
        },
        {
          "name": "vaultTokenBAccount",
          "writable": true
        },
        {
          "name": "poolTokenAAccount",
          "writable": true
        },
        {
          "name": "poolTokenBAccount",
          "writable": true
        },
        {
          "name": "tokenAMint"
        },
        {
          "name": "tokenBMint"
        },
        {
          "name": "positionNftAccount"
        },
        {
          "name": "tokenAProgram"
        },
        {
          "name": "tokenBProgram"
        },
        {
          "name": "treasuryTokenAccount",
          "writable": true
        },
        {
          "name": "cpAmmProgram",
          "address": "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG"
        }
      ],
      "args": [
        {
          "name": "liquidityDelta",
          "type": {
            "option": "u128"
          }
        },
        {
          "name": "tokenAAmountThreshold",
          "type": "u64"
        },
        {
          "name": "tokenBAmountThreshold",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeConfig",
      "discriminator": [
        208,
        127,
        21,
        1,
        194,
        190,
        196,
        70
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "treasury",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "initializeConfigArgs"
            }
          }
        }
      ]
    },
    {
      "name": "initializeStrategyJupiterSwap",
      "discriminator": [
        200,
        157,
        119,
        164,
        132,
        34,
        6,
        70
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "strategy",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  114,
                  97,
                  116,
                  101,
                  103,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "destinationMint"
              }
            ]
          }
        },
        {
          "name": "destinationMint"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeStrategyKaminoLend",
      "discriminator": [
        66,
        217,
        33,
        104,
        148,
        33,
        10,
        253
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "strategy",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  114,
                  97,
                  116,
                  101,
                  103,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "reserve"
              }
            ]
          }
        },
        {
          "name": "userMetadata"
        },
        {
          "name": "referrerUserMetadata"
        },
        {
          "name": "obligation"
        },
        {
          "name": "lendingMarket"
        },
        {
          "name": "reserve"
        },
        {
          "name": "seed1Account"
        },
        {
          "name": "seed2Account"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "klendProgram",
          "address": "KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "userLookupTable",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "initializeStrategyMeteoraDammV2",
      "discriminator": [
        78,
        203,
        104,
        179,
        112,
        0,
        39,
        169
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "strategy",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  114,
                  97,
                  116,
                  101,
                  103,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "position"
              }
            ]
          }
        },
        {
          "name": "position"
        },
        {
          "name": "eventAuthority"
        },
        {
          "name": "pool"
        },
        {
          "name": "poolAuthority"
        },
        {
          "name": "positionNftAccount"
        },
        {
          "name": "positionNftMint"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "cpAmmProgram",
          "address": "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG"
        }
      ],
      "args": []
    },
    {
      "name": "initializeUser",
      "discriminator": [
        111,
        17,
        185,
        250,
        60,
        122,
        38,
        254
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeVault",
      "discriminator": [
        48,
        191,
        163,
        44,
        71,
        129,
        63,
        164
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "config"
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "depositMint"
        },
        {
          "name": "vaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "depositMintTokenProgram"
              },
              {
                "kind": "account",
                "path": "depositMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "treasury"
        },
        {
          "name": "treasuryTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "treasury"
              },
              {
                "kind": "account",
                "path": "depositMintTokenProgram"
              },
              {
                "kind": "account",
                "path": "depositMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "depositMintTokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "initializeVaultArgs"
            }
          }
        }
      ]
    },
    {
      "name": "migrateReceiptToDepositor",
      "discriminator": [
        169,
        158,
        117,
        194,
        166,
        144,
        116,
        14
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "user"
        },
        {
          "name": "config"
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "vaultDepositor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "receiptMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  99,
                  101,
                  105,
                  112,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "receiptMintTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "receiptMintTokenProgram"
              },
              {
                "kind": "account",
                "path": "receiptMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "receiptMintTokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": []
    },
    {
      "name": "updateConfig",
      "discriminator": [
        29,
        158,
        252,
        191,
        10,
        83,
        219,
        99
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "config",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "updateConfigArgs"
            }
          }
        }
      ]
    },
    {
      "name": "updateVault",
      "discriminator": [
        67,
        229,
        185,
        188,
        226,
        11,
        210,
        60
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "vault",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "updateVaultArgs"
            }
          }
        }
      ]
    },
    {
      "name": "withdrawTreasury",
      "discriminator": [
        40,
        63,
        122,
        158,
        144,
        216,
        83,
        96
      ],
      "accounts": [
        {
          "name": "treasuryAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "config"
        },
        {
          "name": "mint"
        },
        {
          "name": "treasury"
        },
        {
          "name": "treasuryTokenAccount",
          "writable": true
        },
        {
          "name": "treasuryAuthorityTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "treasuryAuthority"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": []
    },
    {
      "name": "withdrawVault",
      "discriminator": [
        135,
        7,
        237,
        120,
        149,
        94,
        95,
        7
      ],
      "accounts": [
        {
          "name": "withdrawer",
          "writable": true,
          "signer": true
        },
        {
          "name": "config"
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "vaultDepositor",
          "writable": true
        },
        {
          "name": "depositMint"
        },
        {
          "name": "withdrawerTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "withdrawer"
              },
              {
                "kind": "account",
                "path": "depositMintTokenProgram"
              },
              {
                "kind": "account",
                "path": "depositMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "vaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "depositMintTokenProgram"
              },
              {
                "kind": "account",
                "path": "depositMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "depositMintTokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "receiptMintAmount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "config",
      "discriminator": [
        155,
        12,
        170,
        224,
        30,
        250,
        204,
        130
      ]
    },
    {
      "name": "strategy",
      "discriminator": [
        174,
        110,
        39,
        119,
        82,
        106,
        169,
        102
      ]
    },
    {
      "name": "user",
      "discriminator": [
        159,
        117,
        95,
        227,
        239,
        151,
        58,
        236
      ]
    },
    {
      "name": "vault",
      "discriminator": [
        211,
        8,
        232,
        43,
        2,
        152,
        117,
        119
      ]
    },
    {
      "name": "vaultDepositor",
      "discriminator": [
        87,
        109,
        182,
        106,
        87,
        96,
        63,
        211
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidPubkey",
      "msg": "Pubkey cannot be the default pubkey"
    },
    {
      "code": 6001,
      "name": "invalidNewAdmin",
      "msg": "New admin cannot be the same as the current admin"
    },
    {
      "code": 6002,
      "name": "invalidTransferAmount",
      "msg": "Transfer amount must be greater than zero"
    },
    {
      "code": 6003,
      "name": "mathOverflow",
      "msg": "Math overflow"
    },
    {
      "code": 6004,
      "name": "conversionFailed",
      "msg": "Math conversion failed"
    },
    {
      "code": 6005,
      "name": "invalidBasisPoints",
      "msg": "Basis points cannot exceed 10,000"
    },
    {
      "code": 6006,
      "name": "invalidRemainingAccounts",
      "msg": "Invalid amount of remaining accounts passed"
    },
    {
      "code": 6007,
      "name": "invalidConfig",
      "msg": "Config address does not match"
    },
    {
      "code": 6008,
      "name": "invalidTreasury",
      "msg": "Treasury address does not match"
    },
    {
      "code": 6009,
      "name": "invalidAdmin",
      "msg": "Admin does not match"
    },
    {
      "code": 6010,
      "name": "invalidTreasuryAuthority",
      "msg": "Treasury authority does not match"
    },
    {
      "code": 6011,
      "name": "protocolNotOperational",
      "msg": "Protocol is paused or in reduce-only status"
    },
    {
      "code": 6012,
      "name": "protocolNotWithdrawable",
      "msg": "Protocol is not in a withdrawable status"
    },
    {
      "code": 6013,
      "name": "invalidVault",
      "msg": "Vault address does not match"
    },
    {
      "code": 6014,
      "name": "invalidVaultDepositor",
      "msg": "Vault depositor does not match"
    },
    {
      "code": 6015,
      "name": "invalidVaultAuthority",
      "msg": "Vault authority does not match"
    },
    {
      "code": 6016,
      "name": "invalidStrategyType",
      "msg": "Strategy type is invalid for this operation"
    },
    {
      "code": 6017,
      "name": "vaultNotOperational",
      "msg": "Vault is paused or in reduce-only status"
    },
    {
      "code": 6018,
      "name": "vaultNotWithdrawable",
      "msg": "Vault is not in a withdrawable status"
    },
    {
      "code": 6019,
      "name": "depositCapReached",
      "msg": "Deposit cap for the vault has been reached"
    },
    {
      "code": 6020,
      "name": "invalidVaultDestinationTokenAccount",
      "msg": "Vault destination token account does not match"
    },
    {
      "code": 6021,
      "name": "invalidDepositMint",
      "msg": "Deposit mint does not match"
    },
    {
      "code": 6022,
      "name": "vaultHasDepositsInStrategies",
      "msg": "Vault cannot be closed until all deposits in strategies are withdrawn"
    },
    {
      "code": 6023,
      "name": "invalidSharesAmount",
      "msg": "Shares amount must be greater than zero"
    },
    {
      "code": 6024,
      "name": "exceedsMaxRemovableShares",
      "msg": "Shares to remove exceeds max removable shares"
    },
    {
      "code": 6025,
      "name": "managerFeeBpsTooHigh",
      "msg": "Sum of manager fee BPS and platform fee BPS cannot exceed 10,000"
    },
    {
      "code": 6026,
      "name": "invalidVaultDepositorAuthority",
      "msg": "Vault depositor authority does not match"
    },
    {
      "code": 6027,
      "name": "invalidVaultDepositorVault",
      "msg": "Vault depositor vault does not match"
    },
    {
      "code": 6028,
      "name": "insufficientShares",
      "msg": "Vault depositor does not have enough shares"
    },
    {
      "code": 6029,
      "name": "invalidStrategy",
      "msg": "Strategy address does not match"
    },
    {
      "code": 6030,
      "name": "strategyHasDepositsDeployed",
      "msg": "Strategy cannot be closed until all deposits deployed are withdrawn"
    },
    {
      "code": 6031,
      "name": "invalidDestinationMint",
      "msg": "Destination mint does not match"
    },
    {
      "code": 6032,
      "name": "invalidSourceMint",
      "msg": "Source mint does not match strategy destination mint"
    },
    {
      "code": 6033,
      "name": "invalidUser",
      "msg": "User address does not match"
    },
    {
      "code": 6034,
      "name": "invalidObligationCollateral",
      "msg": "Reserve not found in obligation"
    },
    {
      "code": 6035,
      "name": "invalidObligation",
      "msg": "Obligation address does not match"
    },
    {
      "code": 6036,
      "name": "invalidReserve",
      "msg": "Reserve address does not match"
    },
    {
      "code": 6037,
      "name": "invalidPosition",
      "msg": "Position address does not match"
    }
  ],
  "types": [
    {
      "name": "addLiquidityParameters",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "liquidityDelta",
            "type": "u128"
          },
          {
            "name": "tokenAAmountThreshold",
            "type": "u64"
          },
          {
            "name": "tokenBAmountThreshold",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "config",
      "serialization": "bytemuck",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "treasuryAuthority",
            "type": "pubkey"
          },
          {
            "name": "nextVaultId",
            "docs": [
              "Vault ID, increments with each new vault."
            ],
            "type": "u64"
          },
          {
            "name": "platformPerformanceFeeBps",
            "docs": [
              "Fee taken from eligble profits above previous high water mark in basis points."
            ],
            "type": "u16"
          },
          {
            "name": "platformDepositFeeBps",
            "type": "u16"
          },
          {
            "name": "platformWithdrawalFeeBps",
            "type": "u16"
          },
          {
            "name": "platformReferralFeeBps",
            "type": "u16"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "protocolStatus"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "treasuryBump",
            "type": "u8"
          },
          {
            "name": "padding0",
            "type": {
              "array": [
                "u8",
                5
              ]
            }
          }
        ]
      }
    },
    {
      "name": "initializeConfigArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "platformComissionFeeBps",
            "type": "u16"
          },
          {
            "name": "platformDepositFeeBps",
            "type": "u16"
          },
          {
            "name": "platformWithdrawalFeeBps",
            "type": "u16"
          },
          {
            "name": "platformReferralFeeBps",
            "type": "u16"
          },
          {
            "name": "treasuryAuthority",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "initializeVaultArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "description",
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          },
          {
            "name": "managerFeeBps",
            "type": "u16"
          },
          {
            "name": "depositCap",
            "type": "u64"
          },
          {
            "name": "lockedProfitDuration",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "protocolStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "normal"
          },
          {
            "name": "paused"
          },
          {
            "name": "reduceOnly"
          }
        ]
      }
    },
    {
      "name": "strategy",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "depositsDeployed",
            "docs": [
              "Total deposits deployed to the strategy."
            ],
            "type": "u64"
          },
          {
            "name": "id",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "padding0",
            "type": {
              "array": [
                "u8",
                5
              ]
            }
          },
          {
            "name": "strategyType",
            "type": {
              "defined": {
                "name": "strategyType"
              }
            }
          }
        ]
      }
    },
    {
      "name": "strategyType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "jupiterSwap",
            "fields": [
              {
                "name": "targetMint",
                "type": "pubkey"
              }
            ]
          },
          {
            "name": "kaminoLend",
            "fields": [
              {
                "name": "obligation",
                "type": "pubkey"
              },
              {
                "name": "reserve",
                "type": "pubkey"
              }
            ]
          },
          {
            "name": "meteoraDammV2",
            "fields": [
              {
                "name": "position",
                "type": "pubkey"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "updateConfigArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "newAdmin",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "platformPerformanceFeeBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "platformWithdrawalFeeBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "platformReferralFeeBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "treasuryAuthority",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "status",
            "type": {
              "option": {
                "defined": {
                  "name": "protocolStatus"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "updateVaultArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "description",
            "type": {
              "option": {
                "array": [
                  "u8",
                  64
                ]
              }
            }
          },
          {
            "name": "managerFeeBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "depositCap",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "status",
            "type": {
              "option": {
                "defined": {
                  "name": "vaultStatus"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "user",
      "serialization": "bytemuck",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "vault",
      "serialization": "bytemuck",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "description",
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          },
          {
            "name": "depositMint",
            "docs": [
              "Mint accepted as vault deposits."
            ],
            "type": "pubkey"
          },
          {
            "name": "unused0",
            "docs": [
              "Unused field, can be reopened."
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "depositCap",
            "docs": [
              "Max deposits accepted."
            ],
            "type": "u64"
          },
          {
            "name": "userDeposits",
            "docs": [
              "Total user deposits, changes on user deposit/withdraw."
            ],
            "type": "u64"
          },
          {
            "name": "realizedPnl",
            "docs": [
              "Total realized profit and loss across all strategies, accumulated on strategy execute/exit, deducted on user withdrawals, excluding fees.",
              "",
              "Profit is only realized when exiting from strategies and deposits are withdrawn back to vault token accounts."
            ],
            "type": "i64"
          },
          {
            "name": "depositsInStrategies",
            "docs": [
              "Total deposits currently allocated in strategies, equals to sum of all Strategy deposits_deployed."
            ],
            "type": "u64"
          },
          {
            "name": "lockedProfit",
            "docs": [
              "Currently locked profit amount."
            ],
            "type": "u64"
          },
          {
            "name": "lockedProfitDuration",
            "docs": [
              "Duration over which depositor's share of vault profit cannot be fully withdrawn.",
              "",
              "A longer duration punishes late depositors attempting to front-run vault profit by depositing late and withdrawing at the earliest."
            ],
            "type": "u64"
          },
          {
            "name": "lastProfitLockTs",
            "docs": [
              "Last timestamp when profit is recorded."
            ],
            "type": "i64"
          },
          {
            "name": "totalShares",
            "docs": [
              "Total deposit shares, changes on user deposit."
            ],
            "type": "u64"
          },
          {
            "name": "unclaimedManagerFee",
            "docs": [
              "Claimable manager fees, accrues on profitable strategy exits."
            ],
            "type": "u64"
          },
          {
            "name": "performanceFeeBps",
            "docs": [
              "Fee taken from eligble profits above previous high water mark in basis points."
            ],
            "type": "u16"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "vaultStatus"
              }
            }
          },
          {
            "name": "nextStrategyId",
            "docs": [
              "Strategy ID, increments with each new strategy."
            ],
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "padding0",
            "type": {
              "array": [
                "u8",
                3
              ]
            }
          },
          {
            "name": "assetPerShare",
            "docs": [
              "Last recorded asset per share."
            ],
            "type": {
              "defined": {
                "name": "wrappedI80f48"
              }
            }
          },
          {
            "name": "highWaterMark",
            "docs": [
              "All-time highest recorded asset per share.",
              "",
              "Fees are only taken on profits above this mark."
            ],
            "type": {
              "defined": {
                "name": "wrappedI80f48"
              }
            }
          },
          {
            "name": "padding1",
            "type": {
              "array": [
                "u64",
                28
              ]
            }
          }
        ]
      }
    },
    {
      "name": "vaultDepositor",
      "serialization": "bytemuck",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "shares",
            "docs": [
              "Total shares of the vault owned by the depositor."
            ],
            "type": "u64"
          },
          {
            "name": "lastVaultAssetPerShare",
            "docs": [
              "Last recorded vault asset per share at the time of deposit/withdraw."
            ],
            "type": {
              "defined": {
                "name": "wrappedI80f48"
              }
            }
          },
          {
            "name": "lastDepositTs",
            "docs": [
              "Timestamp of the last deposit made."
            ],
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "padding0",
            "type": {
              "array": [
                "u8",
                7
              ]
            }
          }
        ]
      }
    },
    {
      "name": "vaultStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "normal"
          },
          {
            "name": "paused"
          },
          {
            "name": "reduceOnly"
          }
        ]
      }
    },
    {
      "name": "wrappedI80f48",
      "docs": [
        "Borsh serializable wrapper for [`fixed::types::I80F48`].",
        "Calculations are never performed on this type directly as Solana's runtime has limited support for floating operations."
      ],
      "repr": {
        "kind": "c",
        "align": 8
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "value",
            "type": {
              "array": [
                "u8",
                16
              ]
            }
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "maxBps",
      "type": "u16",
      "value": "10000"
    }
  ]
};
