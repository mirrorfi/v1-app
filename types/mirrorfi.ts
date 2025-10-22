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
          "name": "protocolTokenAccount"
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
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "depositor"
              }
            ]
          }
        },
        {
          "name": "depositMint"
        },
        {
          "name": "receiptMint",
          "writable": true
        },
        {
          "name": "depositorTokenAccount",
          "writable": true
        },
        {
          "name": "receiptMintTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultDepositor"
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
          "name": "vaultTokenAccount",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "depositMintTokenProgram"
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
          "name": "instructionsSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
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
          "name": "hasFarm",
          "type": "bool"
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
                "path": "vault"
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
                "path": "vault"
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
          "name": "priceUpdateV2"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "depositMintTokenProgram"
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
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "withdrawer"
              }
            ]
          }
        },
        {
          "name": "depositMint"
        },
        {
          "name": "receiptMint",
          "writable": true
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
          "name": "receiptMintTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultDepositor"
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
          "name": "vaultTokenAccount",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "depositMintTokenProgram"
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
      "name": "priceUpdateV2",
      "discriminator": [
        34,
        241,
        35,
        99,
        157,
        126,
        244,
        205
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
      "name": "insufficientRemainingAccounts",
      "msg": "Insufficient remaining accounts"
    },
    {
      "code": 6004,
      "name": "insufficientDataLength",
      "msg": "Unable to deserialize data"
    },
    {
      "code": 6005,
      "name": "mathOverflow",
      "msg": "Math overflow"
    },
    {
      "code": 6006,
      "name": "conversionFailed",
      "msg": "Math conversion failed"
    },
    {
      "code": 6007,
      "name": "staleOracle",
      "msg": "Oracle needs to be refreshed"
    },
    {
      "code": 6008,
      "name": "noReceiptTokensMinted",
      "msg": "No receipt tokens will be minted for deposit"
    },
    {
      "code": 6009,
      "name": "noReceiptTokensBurned",
      "msg": "No receipt tokens will be burned for withdraw"
    },
    {
      "code": 6010,
      "name": "invalidConfig",
      "msg": "Config address does not match"
    },
    {
      "code": 6011,
      "name": "invalidTreasury",
      "msg": "Treasury address does not match"
    },
    {
      "code": 6012,
      "name": "invalidAdmin",
      "msg": "Admin does not match"
    },
    {
      "code": 6013,
      "name": "invalidTreasuryAuthority",
      "msg": "Treasury authority does not match"
    },
    {
      "code": 6014,
      "name": "protocolNotOperational",
      "msg": "Protocol is paused or in reduce-only status"
    },
    {
      "code": 6015,
      "name": "protocolNotWithdrawable",
      "msg": "Protocol is not in a withdrawable status"
    },
    {
      "code": 6016,
      "name": "invalidVault",
      "msg": "Vault address does not match"
    },
    {
      "code": 6017,
      "name": "invalidVaultDepositor",
      "msg": "Vault depositor does not match"
    },
    {
      "code": 6018,
      "name": "invalidReceiptMint",
      "msg": "Receipt mint address does not match"
    },
    {
      "code": 6019,
      "name": "invalidVaultAuthority",
      "msg": "Vault authority does not match"
    },
    {
      "code": 6020,
      "name": "invalidStrategyType",
      "msg": "Strategy type is invalid for this operation"
    },
    {
      "code": 6021,
      "name": "vaultDepositCapReached",
      "msg": "Vault deposit cap exceeded"
    },
    {
      "code": 6022,
      "name": "vaultNotOperational",
      "msg": "Vault is paused or in reduce-only status"
    },
    {
      "code": 6023,
      "name": "vaultNotWithdrawable",
      "msg": "Vault is not in a withdrawable status"
    },
    {
      "code": 6024,
      "name": "depositCapReached",
      "msg": "Deposit cap for the vault has been reached"
    },
    {
      "code": 6025,
      "name": "insufficientVaultFundsToDeposit",
      "msg": "Insufficient funds in the vault to deposit to strategy"
    },
    {
      "code": 6026,
      "name": "zeroNetDeposits",
      "msg": "Vault has zero net deposits, cannot mint or burn shares"
    },
    {
      "code": 6027,
      "name": "invalidStrategy",
      "msg": "Strategy address does not match"
    },
    {
      "code": 6028,
      "name": "strategyTokenAccountNotEmpty",
      "msg": "Strategy token account balance is not zero"
    },
    {
      "code": 6029,
      "name": "invalidProtocolProgram",
      "msg": "Protocol program does not match"
    },
    {
      "code": 6030,
      "name": "invalidObligation",
      "msg": "Obligation address does not match"
    },
    {
      "code": 6031,
      "name": "invalidLendingMarket",
      "msg": "Lending market address does not match"
    },
    {
      "code": 6032,
      "name": "invalidDestinationMint",
      "msg": "Destination mint does not match"
    },
    {
      "code": 6033,
      "name": "invalidSourceMint",
      "msg": "Source mint does not match strategy destination mint"
    },
    {
      "code": 6034,
      "name": "invalidUser",
      "msg": "User address does not match"
    }
  ],
  "types": [
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
              "Vault ID, increments with each new vault"
            ],
            "type": "u64"
          },
          {
            "name": "platformComissionFeeBps",
            "docs": [
              "Fee taken on profits in basis points"
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
            "name": "lockedProfitDegradationDuration",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "priceFeedMessage",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "feedId",
            "docs": [
              "`FeedId` but avoid the type alias because of compatibility issues with Anchor's `idl-build` feature."
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "price",
            "type": "i64"
          },
          {
            "name": "conf",
            "type": "u64"
          },
          {
            "name": "exponent",
            "type": "i32"
          },
          {
            "name": "publishTime",
            "docs": [
              "The timestamp of this price update in seconds"
            ],
            "type": "i64"
          },
          {
            "name": "prevPublishTime",
            "docs": [
              "The timestamp of the previous price update. This field is intended to allow users to",
              "identify the single unique price update for any moment in time:",
              "for any time t, the unique update is the one such that prev_publish_time < t <= publish_time.",
              "",
              "Note that there may not be such an update while we are migrating to the new message-sending logic,",
              "as some price updates on pythnet may not be sent to other chains (because the message-sending",
              "logic may not have triggered). We can solve this problem by making the message-sending mandatory",
              "(which we can do once publishers have migrated over).",
              "",
              "Additionally, this field may be equal to publish_time if the message is sent on a slot where",
              "where the aggregation was unsuccesful. This problem will go away once all publishers have",
              "migrated over to a recent version of pyth-agent."
            ],
            "type": "i64"
          },
          {
            "name": "emaPrice",
            "type": "i64"
          },
          {
            "name": "emaConf",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "priceUpdateV2",
      "docs": [
        "A price update account. This account is used by the Pyth Receiver program to store a verified price update from a Pyth price feed.",
        "It contains:",
        "- `write_authority`: The write authority for this account. This authority can close this account to reclaim rent or update the account to contain a different price update.",
        "- `verification_level`: The [`VerificationLevel`] of this price update. This represents how many Wormhole guardian signatures have been verified for this price update.",
        "- `price_message`: The actual price update.",
        "- `posted_slot`: The slot at which this price update was posted."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "writeAuthority",
            "type": "pubkey"
          },
          {
            "name": "verificationLevel",
            "type": {
              "defined": {
                "name": "verificationLevel"
              }
            }
          },
          {
            "name": "priceMessage",
            "type": {
              "defined": {
                "name": "priceFeedMessage"
              }
            }
          },
          {
            "name": "postedSlot",
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
      "serialization": "bytemuck",
      "repr": {
        "kind": "c"
      },
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
              "Total deposits deployed to the strategy"
            ],
            "type": "u64"
          },
          {
            "name": "id",
            "type": "u8"
          },
          {
            "name": "strategyType",
            "type": {
              "defined": {
                "name": "strategyType"
              }
            }
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
                "name": "lendingMarket",
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
            "name": "platformComissionFeeBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "platformDepositFeeBps",
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
              "Mint accepted as vault deposits"
            ],
            "type": "pubkey"
          },
          {
            "name": "priceUpdateV2",
            "docs": [
              "Pyth PriceUpdateV2"
            ],
            "type": "pubkey"
          },
          {
            "name": "depositCap",
            "docs": [
              "Max deposits accepted"
            ],
            "type": "u64"
          },
          {
            "name": "userDeposits",
            "docs": [
              "Total user deposits, changes on user deposit/withdraw"
            ],
            "type": "u64"
          },
          {
            "name": "realizedPnl",
            "docs": [
              "Total realized profit and loss across all strategies, accumulated on strategy deposit/withdraw, excluding fees",
              "",
              "Profit is only realized when exiting from strategies and deposits are withdrawn back to vault token accounts"
            ],
            "type": "i64"
          },
          {
            "name": "depositsInStrategies",
            "docs": [
              "Total deposits currently allocated in strategies, equals to sum of all Strategy deposits_deployed"
            ],
            "type": "u64"
          },
          {
            "name": "lockedProfit",
            "docs": [
              "Currently locked profit amount"
            ],
            "type": "u64"
          },
          {
            "name": "lockedProfitDegradationDuration",
            "docs": [
              "Duration over which locked profit degrades to zero in seconds"
            ],
            "type": "u64"
          },
          {
            "name": "lastProfitLockTs",
            "docs": [
              "Last timestamp when profit is recorded"
            ],
            "type": "i64"
          },
          {
            "name": "lastRefreshTs",
            "docs": [
              "Last vault refresh timestamp"
            ],
            "type": "i64"
          },
          {
            "name": "unclaimedManagerFee",
            "docs": [
              "Claimable manager fees, accrues on profitable strategy exits"
            ],
            "type": "u64"
          },
          {
            "name": "managerFeeBps",
            "docs": [
              "Fee taken from positive user withdrawals in basis points"
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
              "Strategy ID, increments with each new strategy"
            ],
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "receiptMintBump",
            "type": "u8"
          },
          {
            "name": "padding0",
            "type": {
              "array": [
                "u8",
                2
              ]
            }
          },
          {
            "name": "padding1",
            "type": {
              "array": [
                "u64",
                32
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
          },
          {
            "name": "totalShares",
            "type": "u64"
          },
          {
            "name": "totalCost",
            "type": "u64"
          },
          {
            "name": "realizedPnl",
            "type": "i64"
          },
          {
            "name": "padding1",
            "type": {
              "array": [
                "u64",
                8
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
      "name": "verificationLevel",
      "docs": [
        "Pyth price updates are bridged to all blockchains via Wormhole.",
        "Using the price updates on another chain requires verifying the signatures of the Wormhole guardians.",
        "The usual process is to check the signatures for two thirds of the total number of guardians, but this can be cumbersome on Solana because of the transaction size limits,",
        "so we also allow for partial verification.",
        "",
        "This enum represents how much a price update has been verified:",
        "- If `Full`, we have verified the signatures for two thirds of the current guardians.",
        "- If `Partial`, only `num_signatures` guardian signatures have been checked.",
        "",
        "# Warning",
        "Using partially verified price updates is dangerous, as it lowers the threshold of guardians that need to collude to produce a malicious price update."
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "partial",
            "fields": [
              {
                "name": "numSignatures",
                "type": "u8"
              }
            ]
          },
          {
            "name": "full"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "maxOracleStalenessSecs",
      "type": "u16",
      "value": "120"
    }
  ]
};
